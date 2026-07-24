from datetime import datetime, timedelta, timezone
from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from app.api.deps import get_db, get_current_user
from app.core.config import settings
from app.core.security import (
    verify_password,
    get_password_hash,
    create_access_token,
    create_refresh_token,
    decode_token,
    generate_opaque_token
)
from app.models.auth import User, RefreshToken, PasswordResetToken, EmailVerificationToken
from app.schemas.auth import (
    UserCreate,
    UserLogin,
    UserResponse,
    TokenResponse,
    RefreshTokenRequest,
    ForgotPasswordRequest,
    ResetPasswordRequest,
    VerifyEmailRequest,
    MessageResponse
)

router = APIRouter(prefix="/auth", tags=["Authentication"])

@router.post("/register", response_model=MessageResponse, status_code=status.HTTP_201_CREATED)
def register_user(user_in: UserCreate, db: Session = Depends(get_db)):
    existing_user = db.query(User).filter(User.email == user_in.email.lower()).first()
    if existing_user:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="User with this email already exists"
        )
    
    hashed_pwd = get_password_hash(user_in.password)
    new_user = User(
        email=user_in.email.lower(),
        hashed_password=hashed_pwd,
        full_name=user_in.full_name,
        role=user_in.role,
        is_active=True,
        is_verified=False
    )
    db.add(new_user)
    db.commit()
    db.refresh(new_user)

    # Generate verification token
    verification_token = generate_opaque_token()
    expires_at = datetime.now(timezone.utc) + timedelta(hours=settings.VERIFICATION_TOKEN_EXPIRE_HOURS)
    token_entry = EmailVerificationToken(
        token=verification_token,
        user_id=new_user.id,
        expires_at=expires_at
    )
    db.add(token_entry)
    db.commit()

    return MessageResponse(
        message="Registration successful. Please verify your email.",
        token=verification_token
    )

@router.post("/login", response_model=TokenResponse)
def login_user(login_in: UserLogin, db: Session = Depends(get_db)):
    user = db.query(User).filter(User.email == login_in.email.lower()).first()
    if not user or not verify_password(login_in.password, user.hashed_password):
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Incorrect email or password"
        )
    
    if not user.is_active:
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Account is inactive"
        )

    access_token = create_access_token(subject=user.id, role=user.role.value)
    refresh_token_str = create_refresh_token(subject=user.id)

    # Store refresh token in database
    expires_at = datetime.now(timezone.utc) + timedelta(days=settings.REFRESH_TOKEN_EXPIRE_DAYS)
    db_refresh = RefreshToken(
        token=refresh_token_str,
        user_id=user.id,
        expires_at=expires_at
    )
    db.add(db_refresh)
    db.commit()

    return TokenResponse(
        access_token=access_token,
        refresh_token=refresh_token_str,
        token_type="bearer",
        user=UserResponse.model_validate(user)
    )

@router.post("/refresh", response_model=TokenResponse)
def refresh_token(token_in: RefreshTokenRequest, db: Session = Depends(get_db)):
    payload = decode_token(token_in.refresh_token)
    if not payload or payload.get("type") != "refresh":
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Invalid refresh token"
        )

    user_id = payload.get("sub")
    db_token = db.query(RefreshToken).filter(
        RefreshToken.token == token_in.refresh_token,
        RefreshToken.user_id == user_id,
        RefreshToken.is_revoked == False
    ).first()

    if not db_token or db_token.expires_at.replace(tzinfo=timezone.utc) < datetime.now(timezone.utc):
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Refresh token is expired or revoked"
        )

    user = db.query(User).filter(User.id == user_id).first()
    if not user or not user.is_active:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="User no longer active"
        )

    # Revoke old refresh token & issue new pair
    db_token.is_revoked = True
    new_access_token = create_access_token(subject=user.id, role=user.role.value)
    new_refresh_token_str = create_refresh_token(subject=user.id)

    new_db_refresh = RefreshToken(
        token=new_refresh_token_str,
        user_id=user.id,
        expires_at=datetime.now(timezone.utc) + timedelta(days=settings.REFRESH_TOKEN_EXPIRE_DAYS)
    )
    db.add(new_db_refresh)
    db.commit()

    return TokenResponse(
        access_token=new_access_token,
        refresh_token=new_refresh_token_str,
        token_type="bearer",
        user=UserResponse.model_validate(user)
    )

@router.post("/logout", response_model=MessageResponse)
def logout(token_in: RefreshTokenRequest, db: Session = Depends(get_db)):
    db_token = db.query(RefreshToken).filter(RefreshToken.token == token_in.refresh_token).first()
    if db_token:
        db_token.is_revoked = True
        db.commit()
    return MessageResponse(message="Successfully logged out")

@router.post("/forgot-password", response_model=MessageResponse)
def forgot_password(request_in: ForgotPasswordRequest, db: Session = Depends(get_db)):
    user = db.query(User).filter(User.email == request_in.email.lower()).first()
    if not user:
        # Return generic message to prevent email enumeration
        return MessageResponse(message="If the email exists, a password reset token has been generated.")

    reset_token = generate_opaque_token()
    expires_at = datetime.now(timezone.utc) + timedelta(hours=settings.RESET_PASSWORD_TOKEN_EXPIRE_HOURS)

    token_entry = PasswordResetToken(
        token=reset_token,
        user_id=user.id,
        expires_at=expires_at
    )
    db.add(token_entry)
    db.commit()

    return MessageResponse(
        message="If the email exists, a password reset token has been generated.",
        token=reset_token
    )

@router.post("/reset-password", response_model=MessageResponse)
def reset_password(request_in: ResetPasswordRequest, db: Session = Depends(get_db)):
    db_token = db.query(PasswordResetToken).filter(
        PasswordResetToken.token == request_in.token,
        PasswordResetToken.is_used == False
    ).first()

    if not db_token or db_token.expires_at.replace(tzinfo=timezone.utc) < datetime.now(timezone.utc):
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Invalid or expired reset token"
        )

    user = db.query(User).filter(User.id == db_token.user_id).first()
    if not user:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="User not found"
        )

    user.hashed_password = get_password_hash(request_in.new_password)
    db_token.is_used = True
    db.commit()

    return MessageResponse(message="Password reset successfully. You may now log in.")

@router.post("/verify-email", response_model=MessageResponse)
def verify_email(request_in: VerifyEmailRequest, db: Session = Depends(get_db)):
    db_token = db.query(EmailVerificationToken).filter(
        EmailVerificationToken.token == request_in.token,
        EmailVerificationToken.is_used == False
    ).first()

    if not db_token or db_token.expires_at.replace(tzinfo=timezone.utc) < datetime.now(timezone.utc):
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Invalid or expired verification token"
        )

    user = db.query(User).filter(User.id == db_token.user_id).first()
    if not user:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="User not found"
        )

    user.is_verified = True
    db_token.is_used = True
    db.commit()

    return MessageResponse(message="Email verified successfully.")

@router.get("/me", response_model=UserResponse)
def get_me(current_user: User = Depends(get_current_user)):
    return UserResponse.model_validate(current_user)
