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
import { HardHat, CheckCircle } from 'lucide-react';
import { authClient } from '@/lib/auth-client';

export default function VerifyEmailPage() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const tokenFromUrl = searchParams.get('token') || '';

  const [token, setToken] = React.useState(tokenFromUrl);
  const [isLoading, setIsLoading] = React.useState(false);
  const [message, setMessage] = React.useState<string | null>(null);
  const [error, setError] = React.useState<string | null>(null);

  React.useEffect(() => {
    if (tokenFromUrl) {
      setToken(tokenFromUrl);
    }
  }, [tokenFromUrl]);

  const handleVerify = async (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    if (!token) return;

    setError(null);
    setMessage(null);
    setIsLoading(true);

    try {
      const res = await authClient.verifyEmail(token);
      setMessage(res.message);
      setTimeout(() => {
        router.push('/auth/login');
      }, 2000);
    } catch (err: any) {
      setError(err.message || 'Verification failed');
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
          <span className="font-bold tracking-wider uppercase text-xs text-white">SiteBrain AI</span>
        </div>
        <span className="font-mono text-[11px] text-slate-400">Email Verification</span>
      </HeaderNav>

      <main className="flex-1 flex items-center justify-center p-4">
        <Card className="w-full max-w-md shadow-md rounded-md border-slate-300 dark:border-slate-800">
          <CardHeader className="space-y-1">
            <CardTitle className="text-lg font-bold text-slate-900 dark:text-slate-100 flex items-center gap-2">
              <CheckCircle className="h-5 w-5 text-orange-600" />
              Verify Work Email
            </CardTitle>
            <CardDescription>
              Confirm your email address token to activate full platform access.
            </CardDescription>
          </CardHeader>

          <form onSubmit={handleVerify}>
            <CardContent className="space-y-4">
              {error && (
                <Alert
                  variant="danger"
                  title="Verification Failed"
                  description={error}
                  onClose={() => setError(null)}
                />
              )}

              {message && (
                <Alert
                  variant="success"
                  title="Email Verified"
                  description={message}
                />
              )}

              <div className="space-y-1.5">
                <Label htmlFor="token">Verification Token</Label>
                <Input
                  id="token"
                  type="text"
                  placeholder="Enter email verification token"
                  value={token}
                  onChange={(e) => setToken(e.target.value)}
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
                Verify Email Address
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
