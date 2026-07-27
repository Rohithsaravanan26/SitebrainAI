'use client';

import * as React from 'react';
import Link from 'next/link';
import {
  Button,
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
  CardFooter,
  Input,
  Label,
  Alert,
  HeaderNav,
} from '@sitebrain/ui';
import { HardHat, KeyRound } from 'lucide-react';
import { authClient } from '@/lib/auth-client';

export default function ForgotPasswordPage() {
  const [email, setEmail] = React.useState('');
  const [isLoading, setIsLoading] = React.useState(false);
  const [message, setMessage] = React.useState<string | null>(null);
  const [generatedToken, setGeneratedToken] = React.useState<string | null>(null);
  const [error, setError] = React.useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setMessage(null);
    setIsLoading(true);

    try {
      const res = await authClient.forgotPassword(email);
      setMessage(res.message);
      if (res.token) {
        setGeneratedToken(res.token);
      }
    } catch (err: any) {
      setError(err.message || 'Password reset request failed');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-100 dark:bg-slate-950 flex flex-col justify-between">
      <HeaderNav>
        <div className="flex items-center space-x-2">
          <div className="bg-orange-600 p-1 rounded-sm">
            <HardHat className="h-4 w-4 text-white" />
          </div>
          <span className="font-bold tracking-wider uppercase text-xs text-white">
            SiteBrain AI
          </span>
        </div>
        <span className="font-mono text-[11px] text-slate-400">Account Recovery</span>
      </HeaderNav>

      <main className="flex-1 flex items-center justify-center p-4">
        <Card className="w-full max-w-md shadow-md rounded-md border-slate-300 dark:border-slate-800">
          <CardHeader className="space-y-1">
            <CardTitle className="text-lg font-bold text-slate-900 dark:text-slate-100 flex items-center gap-2">
              <KeyRound className="h-5 w-5 text-orange-600" />
              Forgot Password
            </CardTitle>
            <CardDescription>
              Enter your registered work email to receive a password reset token link.
            </CardDescription>
          </CardHeader>

          <form onSubmit={handleSubmit}>
            <CardContent className="space-y-4">
              {error && (
                <Alert
                  variant="danger"
                  title="Request Error"
                  description={error}
                  onClose={() => setError(null)}
                />
              )}

              {message && (
                <Alert variant="info" title="Reset Request Processed" description={message} />
              )}

              {generatedToken && (
                <div className="p-3 bg-amber-50 border border-amber-200 rounded-sm text-xs space-y-1 font-mono">
                  <p className="font-bold text-amber-900">Dev Mode Password Reset Token:</p>
                  <p className="text-amber-800 break-all">{generatedToken}</p>
                  <Link
                    href={`/auth/reset-password?token=${generatedToken}`}
                    className="inline-block mt-1 text-orange-700 font-bold underline"
                  >
                    Proceed to Reset Password →
                  </Link>
                </div>
              )}

              <div className="space-y-1.5">
                <Label htmlFor="email">Work Email</Label>
                <Input
                  id="email"
                  type="email"
                  placeholder="name@company.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                />
              </div>
            </CardContent>

            <CardFooter className="flex flex-col space-y-3">
              <Button
                type="submit"
                variant="accent"
                className="w-full font-bold uppercase tracking-wider text-xs"
                isLoading={isLoading}
              >
                Send Reset Token
              </Button>
              <div className="text-center text-xs text-slate-500">
                Remember your password?{' '}
                <Link href="/auth/login" className="text-orange-600 hover:underline font-semibold">
                  Back to Sign In
                </Link>
              </div>
            </CardFooter>
          </form>
        </Card>
      </main>

      <footer className="py-3 px-6 text-center text-xs text-slate-500 border-t border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 font-mono">
        SiteBrain AI Platform Security
      </footer>
    </div>
  );
}
