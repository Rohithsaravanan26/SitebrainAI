/**
 * SiteBrain AI - System Shared Types & API Contracts
 */

export type UserRole = 'ADMIN' | 'PROJECT_MANAGER' | 'SITE_ENGINEER' | 'SUPERVISOR' | 'WORKER';

export interface User {
  id: string;
  email: string;
  fullName: string;
  role: UserRole;
  isActive: boolean;
  isVerified: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface TokenResponse {
  accessToken: string;
  refreshToken: string;
  tokenType: string;
  user: User;
}

export interface LoginRequest {
  email: string;
  password: string;
}

export interface RegisterRequest {
  email: string;
  password: string;
  fullName: string;
  role: UserRole;
}

export interface ForgotPasswordRequest {
  email: string;
}

export interface ResetPasswordRequest {
  token: string;
  newPassword: string;
}

export interface VerifyEmailRequest {
  token: string;
}

// -------------------------------------------------------------
// PROJECTS, RFIS & DOCUMENTS TYPES & CONTRACTS
// -------------------------------------------------------------
export type ProjectStatus = 'PLANNING' | 'ACTIVE' | 'ON_HOLD' | 'COMPLETED';
export type RfiStatus = 'OPEN' | 'IN_REVIEW' | 'ANSWERED' | 'CLOSED';
export type RfiPriority = 'LOW' | 'MEDIUM' | 'HIGH' | 'URGENT';

export interface Project {
  id: string;
  code: string;
  name: string;
  description?: string;
  location: string;
  status: ProjectStatus;
  startDate: string;
  endDate: string;
  budget: number;
  projectManagerId?: string;
  projectManagerName?: string;
  progressPercent: number;
  openRfiCount: number;
  createdAt: string;
  updatedAt: string;
}

export interface RFI {
  id: string;
  projectId: string;
  rfiNumber: string;
  title: string;
  question: string;
  answer?: string;
  status: RfiStatus;
  priority: RfiPriority;
  authorId?: string;
  authorName?: string;
  assignedToId?: string;
  assignedToName?: string;
  dueDate: string;
  createdAt: string;
  updatedAt: string;
}

export interface ProjectDocument {
  id: string;
  projectId: string;
  title: string;
  filePath: string;
  fileType: string;
  fileSizeBytes: number;
  uploadedById?: string;
  uploadedByName?: string;
  createdAt: string;
}

// -------------------------------------------------------------
// INVENTORY TYPES & CONTRACTS
// -------------------------------------------------------------
export type MovementType = 'INCOMING' | 'OUTGOING' | 'ADJUSTMENT' | 'RETURN';
export type POStatus = 'DRAFT' | 'ORDERED' | 'PARTIALLY_RECEIVED' | 'DELIVERED' | 'CANCELLED';

export interface Supplier {
  id: string;
  code: string;
  name: string;
  contactPerson: string;
  email: string;
  phone: string;
  rating: number;
}

export interface InventoryItem {
  id: string;
  sku: string;
  name: string;
  category: string;
  unit: string;
  currentStock: number;
  allocatedStock: number;
  reorderLevel: number;
  targetStock: number;
  unitCost: number;
  supplierId?: string;
  supplierName?: string;
  storageLocation: string;
  qrCodeData: string;
  createdAt: string;
  updatedAt: string;
}

export interface StockMovement {
  id: string;
  itemId: string;
  itemName?: string;
  itemSku?: string;
  movementType: MovementType;
  quantity: number;
  referenceNo: string;
  notes?: string;
  performedBy?: string;
  createdAt: string;
}

export interface PurchaseOrder {
  id: string;
  poNumber: string;
  supplierId: string;
  supplierName: string;
  status: POStatus;
  totalAmount: number;
  expectedDelivery: string;
  createdAt: string;
  updatedAt: string;
}

// -------------------------------------------------------------
// COMPUTER VISION TYPES & CONTRACTS
// -------------------------------------------------------------
export type VisionJobStatus = 'PENDING' | 'PROCESSING' | 'COMPLETED' | 'FAILED';

export interface DetectedObject {
  className: string;
  confidence: number;
  bbox?: [number, number, number, number];
}

export interface VisionPrediction {
  id: string;
  jobId: string;
  modelName: string;
  modelVersion: string;
  confidenceScore: number;
  estimatedProgress: number;
  detectedClasses: DetectedObject[];
  rawMetadata?: Record<string, unknown>;
  createdAt: string;
}

export interface VisionJob {
  id: string;
  filename: string;
  fileSizeBytes: number;
  status: VisionJobStatus;
  prediction?: VisionPrediction;
  createdAt: string;
  completedAt?: string;
}

export interface ModelMetadata {
  name: string;
  version: string;
  description: string;
  supportedClasses: string[];
}

// -------------------------------------------------------------
// DIGITAL TWIN & 3D SPATIAL TYPES & CONTRACTS
// -------------------------------------------------------------
export type AnnotationCategory = 'RFI' | 'SAFETY_HAZARD' | 'DEFECT' | 'QUALITY_INSPECTION';
export type ElementProgressStatus = 'COMPLETED' | 'IN_PROGRESS' | 'REMAINING';

export interface SpatialAnnotation {
  id: string;
  modelId: string;
  title: string;
  description?: string;
  category: AnnotationCategory;
  positionX: number;
  positionY: number;
  positionZ: number;
  status: 'OPEN' | 'RESOLVED' | 'UNDER_REVIEW';
  createdBy?: string;
  createdAt: string;
}

export interface DigitalTwinModel {
  id: string;
  name: string;
  version: string;
  elementsCount: number;
  completedProgress: number;
  fileUrl?: string;
  createdAt: string;
}

export interface SystemStatus {
  service: string;
  status: 'healthy' | 'degraded' | 'unhealthy';
  version: string;
  timestamp: string;
  environment: string;
}

export interface ApiResponse<T = unknown> {
  success: boolean;
  data?: T;
  error?: {
    code: string;
    message: string;
    details?: unknown;
  };
  timestamp: string;
}

export interface PaginationParams {
  page: number;
  limit: number;
  sortBy?: string;
  sortOrder?: 'asc' | 'desc';
}

export interface PaginatedResult<T> {
  items: T[];
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}
