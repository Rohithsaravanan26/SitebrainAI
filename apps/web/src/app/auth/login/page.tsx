'use client';

import * as React from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
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
import { HardHat, LogIn } from 'lucide-react';
import { authClient } from '@/lib/auth-client';

export default function LoginPage() {
  const router = useRouter();
  const [email, setEmail] = React.useState('');
  const [password, setPassword] = React.useState('');
  const [isLoading, setIsLoading] = React.useState(false);
  const [error, setError] = React.useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setIsLoading(true);

    try {
      await authClient.login({ email, password });
      router.push('/');
    } catch (err: any) {
      setError(err.message || 'Invalid email or password credentials');
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
        <span className="font-mono text-[11px] text-slate-400">Enterprise Authentication</span>
      </HeaderNav>

      <main className="flex-1 flex items-center justify-center p-4">
        <Card className="w-full max-w-md shadow-md rounded-md border-slate-300 dark:border-slate-800">
          <CardHeader className="space-y-1">
            <CardTitle className="text-lg font-bold text-slate-900 dark:text-slate-100 flex items-center gap-2">
              <LogIn className="h-5 w-5 text-orange-600" />
              Sign In to SiteBrain AI
            </CardTitle>
            <CardDescription>
              Enter your enterprise credentials to access project telemetry & field operations.
            </CardDescription>
          </CardHeader>
          
          <form onSubmit={handleSubmit}>
            <CardContent className="space-y-4">
              {error && (
                <Alert
                  variant="danger"
                  title="Authentication Error"
                  description={error}
                  onClose={() => setError(null)}
                />
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

              <div className="space-y-1.5">
                <div className="flex items-center justify-between">
                  <Label htmlFor="password">Password</Label>
                  <Link
                    href="/auth/forgot-password"
                    className="text-xs text-orange-600 hover:text-orange-700 font-medium"
                  >
                    Forgot password?
                  </Link>
                </div>
                <Input
                  id="password"
                  type="password"
                  placeholder="••••••••"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
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
                Sign In
              </Button>
              <div className="text-center text-xs text-slate-500">
                Don't have an enterprise account?{' '}
                <Link href="/auth/register" className="text-orange-600 hover:underline font-semibold">
                  Register Account
                </Link>
              </div>
            </CardFooter>
          </form>
        </Card>
      </main>

      <footer className="py-3 px-6 text-center text-xs text-slate-500 border-t border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 font-mono">
        SiteBrain AI Platform Security • ISO 27001 & SOC2 Compliant
      </footer>
    </div>
  );
}
