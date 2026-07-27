'use client';

import * as React from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { UserRole } from '@sitebrain/types';
import {
  Button,
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
  CardFooter,
  Input,
  Select,
  Label,
  Alert,
  HeaderNav,
} from '@sitebrain/ui';
import { HardHat, UserPlus } from 'lucide-react';
import { authClient } from '@/lib/auth-client';

export default function RegisterPage() {
  const router = useRouter();
  const [email, setEmail] = React.useState('');
  const [fullName, setFullName] = React.useState('');
  const [password, setPassword] = React.useState('');
  const [role, setRole] = React.useState<UserRole>('SITE_ENGINEER');
  const [isLoading, setIsLoading] = React.useState(false);
  const [error, setError] = React.useState<string | null>(null);
  const [successMsg, setSuccessMsg] = React.useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setSuccessMsg(null);
    setIsLoading(true);

    try {
      const res = await authClient.register({
        email,
        password,
        fullName,
        role,
      });
      setSuccessMsg(res.message);
      if (res.token) {
        setTimeout(() => {
          router.push(`/auth/verify-email?token=${res.token}`);
        }, 1500);
      }
    } catch (err: any) {
      setError(err.message || 'Registration failed');
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
        <span className="font-mono text-[11px] text-slate-400">Account Onboarding</span>
      </HeaderNav>

      <main className="flex-1 flex items-center justify-center p-4">
        <Card className="w-full max-w-md shadow-md rounded-md border-slate-300 dark:border-slate-800">
          <CardHeader className="space-y-1">
            <CardTitle className="text-lg font-bold text-slate-900 dark:text-slate-100 flex items-center gap-2">
              <UserPlus className="h-5 w-5 text-orange-600" />
              Create Enterprise Account
            </CardTitle>
            <CardDescription>
              Register your profile to access construction management & field analytics.
            </CardDescription>
          </CardHeader>

          <form onSubmit={handleSubmit}>
            <CardContent className="space-y-3.5">
              {error && (
                <Alert
                  variant="danger"
                  title="Registration Error"
                  description={error}
                  onClose={() => setError(null)}
                />
              )}

              {successMsg && (
                <Alert variant="success" title="Account Created" description={successMsg} />
              )}

              <div className="space-y-1">
                <Label htmlFor="fullName">Full Name</Label>
                <Input
                  id="fullName"
                  type="text"
                  placeholder="e.g. Marcus Vance"
                  value={fullName}
                  onChange={(e) => setFullName(e.target.value)}
                  required
                />
              </div>

              <div className="space-y-1">
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

              <div className="space-y-1">
                <Label htmlFor="role">Construction Role</Label>
                <Select
                  id="role"
                  value={role}
                  onChange={(e) => setRole(e.target.value as UserRole)}
                >
                  <option value="ADMIN">System Administrator</option>
                  <option value="PROJECT_MANAGER">Project Manager (PM)</option>
                  <option value="SITE_ENGINEER">Site Engineer</option>
                  <option value="SUPERVISOR">Site Supervisor</option>
                  <option value="WORKER">Field Worker / Subcontractor</option>
                </Select>
              </div>

              <div className="space-y-1">
                <Label htmlFor="password">Password (Min 8 Chars)</Label>
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
                Create Account
              </Button>
              <div className="text-center text-xs text-slate-500">
                Already registered?{' '}
                <Link href="/auth/login" className="text-orange-600 hover:underline font-semibold">
                  Sign In
                </Link>
              </div>
            </CardFooter>
          </form>
        </Card>
      </main>

      <footer className="py-3 px-6 text-center text-xs text-slate-500 border-t border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 font-mono">
        SiteBrain AI Platform Security • Multi-Tenant RBAC Protection
      </footer>
    </div>
  );
}
