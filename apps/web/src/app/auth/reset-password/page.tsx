'use client';

import * as React from 'react';
import Link from 'next/link';
import { useSearchParams, useRouter } from 'next/navigation';
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
import { HardHat, ShieldCheck } from 'lucide-react';
import { authClient } from '@/lib/auth-client';

export default function ResetPasswordPage() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const tokenFromUrl = searchParams.get('token') || '';

  const [token, setToken] = React.useState(tokenFromUrl);
  const [newPassword, setNewPassword] = React.useState('');
  const [isLoading, setIsLoading] = React.useState(false);
  const [message, setMessage] = React.useState<string | null>(null);
  const [error, setError] = React.useState<string | null>(null);

  React.useEffect(() => {
    if (tokenFromUrl) {
      setToken(tokenFromUrl);
    }
  }, [tokenFromUrl]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setMessage(null);
    setIsLoading(true);

    try {
      const res = await authClient.resetPassword(token, newPassword);
      setMessage(res.message);
      setTimeout(() => {
        router.push('/auth/login');
      }, 2000);
    } catch (err: any) {
      setError(err.message || 'Reset password failed');
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
        <span className="font-mono text-[11px] text-slate-400">Password Reset</span>
      </HeaderNav>

      <main className="flex-1 flex items-center justify-center p-4">
        <Card className="w-full max-w-md shadow-md rounded-md border-slate-300 dark:border-slate-800">
          <CardHeader className="space-y-1">
            <CardTitle className="text-lg font-bold text-slate-900 dark:text-slate-100 flex items-center gap-2">
              <ShieldCheck className="h-5 w-5 text-orange-600" />
              Reset Password
            </CardTitle>
            <CardDescription>
              Set a new secure password for your SiteBrain enterprise profile.
            </CardDescription>
          </CardHeader>

          <form onSubmit={handleSubmit}>
            <CardContent className="space-y-4">
              {error && (
                <Alert
                  variant="danger"
                  title="Reset Error"
                  description={error}
                  onClose={() => setError(null)}
                />
              )}

              {message && (
                <Alert variant="success" title="Password Updated" description={message} />
              )}

              <div className="space-y-1.5">
                <Label htmlFor="token">Reset Token</Label>
                <Input
                  id="token"
                  type="text"
                  placeholder="Enter reset token"
                  value={token}
                  onChange={(e) => setToken(e.target.value)}
                  required
                />
              </div>

              <div className="space-y-1.5">
                <Label htmlFor="newPassword">New Password (Min 8 Chars)</Label>
                <Input
                  id="newPassword"
                  type="password"
                  placeholder="••••••••"
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
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
                Update Password
              </Button>
              <div className="text-center text-xs text-slate-500">
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
