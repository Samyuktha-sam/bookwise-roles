import React, { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Logo } from '@/components/ui/logo';
import { useAuth } from '@/contexts/AuthContext';
import { useToast } from '@/hooks/use-toast';
import { Loader2, Mail, Eye, EyeOff } from 'lucide-react';
import { cn } from '@/lib/utils';

export default function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});
  
  const { login, loginWithSSO } = useAuth();
  const { toast } = useToast();
  const navigate = useNavigate();
  const location = useLocation();

  const from = location.state?.from?.pathname || '/dashboard';

  const validateForm = () => {
    const newErrors: Record<string, string> = {};
    
    if (!email) {
      newErrors.email = 'Email is required';
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      newErrors.email = 'Please enter a valid email address';
    }
    
    if (!password) {
      newErrors.password = 'Password is required';
    } else if (password.length < 6) {
      newErrors.password = 'Password must be at least 6 characters';
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) return;
    
    setIsLoading(true);
    try {
      await login({ email, password });
      toast({
        title: 'Welcome back!',
        description: 'You have successfully signed in.',
      });
      navigate(from, { replace: true });
    } catch (error) {
      toast({
        variant: 'destructive',
        title: 'Sign in failed',
        description: error instanceof Error ? error.message : 'Invalid credentials',
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleSSOLogin = async (provider: 'google' | 'microsoft') => {
    setIsLoading(true);
    try {
      // Mock SSO flow - in real app, this would redirect to OAuth provider
      const mockIdToken = `mock-${provider}-id-token`;
      await loginWithSSO(provider, mockIdToken);
      
      toast({
        title: 'Welcome!',
        description: `Successfully signed in with ${provider === 'google' ? 'Google' : 'Microsoft'}.`,
      });
      navigate(from, { replace: true });
    } catch (error) {
      toast({
        variant: 'destructive',
        title: 'SSO sign in failed',
        description: 'Please try again or contact support.',
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-muted/30 p-4">
      <div className="w-full max-w-md space-y-8">
        <div className="text-center">
          <Logo className="justify-center" size="lg" />
          <h1 className="mt-6 text-3xl font-bold text-foreground">
            Sign in to BookMS
          </h1>
          <p className="mt-2 text-muted-foreground">
            Access your book management dashboard
          </p>
        </div>

        <Card className="shadow-elevated border-0">
          <CardHeader className="space-y-1 text-center">
            <CardTitle className="text-xl">Continue with</CardTitle>
            <CardDescription>
              Choose your preferred sign in method
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            {/* SSO Buttons */}
            <div className="grid grid-cols-1 gap-3">
              <Button
                variant="outline"
                onClick={() => handleSSOLogin('google')}
                disabled={isLoading}
                className="h-11"
              >
                <svg className="mr-2 h-4 w-4" viewBox="0 0 24 24">
                  <path
                    fill="currentColor"
                    d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                  />
                  <path
                    fill="currentColor"
                    d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                  />
                  <path
                    fill="currentColor"
                    d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
                  />
                  <path
                    fill="currentColor"
                    d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
                  />
                </svg>
                Continue with Google
              </Button>
              
              <Button
                variant="outline"
                onClick={() => handleSSOLogin('microsoft')}
                disabled={isLoading}
                className="h-11"
              >
                <svg className="mr-2 h-4 w-4" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M11.4 24H0V12.6h11.4V24zM24 24H12.6V12.6H24V24zM11.4 11.4H0V0h11.4v11.4zM24 11.4H12.6V0H24v11.4z"/>
                </svg>
                Continue with Microsoft
              </Button>
            </div>

            <div className="relative">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-border" />
              </div>
              <div className="relative flex justify-center text-xs uppercase">
                <span className="bg-card px-2 text-muted-foreground">
                  Or continue with email
                </span>
              </div>
            </div>

            {/* Email/Password Form */}
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="email">Email address</Label>
                <div className="relative">
                  <Mail className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                  <Input
                    id="email"
                    type="email"
                    placeholder="Enter your email"
                    value={email}
                    onChange={(e) => {
                      setEmail(e.target.value);
                      if (errors.email) setErrors(prev => ({ ...prev, email: '' }));
                    }}
                    className={cn(
                      'pl-10',
                      errors.email && 'border-destructive focus-visible:ring-destructive'
                    )}
                    disabled={isLoading}
                    aria-describedby={errors.email ? 'email-error' : undefined}
                  />
                </div>
                {errors.email && (
                  <p id="email-error" className="text-sm text-destructive">
                    {errors.email}
                  </p>
                )}
              </div>

              <div className="space-y-2">
                <Label htmlFor="password">Password</Label>
                <div className="relative">
                  <Input
                    id="password"
                    type={showPassword ? 'text' : 'password'}
                    placeholder="Enter your password"
                    value={password}
                    onChange={(e) => {
                      setPassword(e.target.value);
                      if (errors.password) setErrors(prev => ({ ...prev, password: '' }));
                    }}
                    className={cn(
                      'pr-10',
                      errors.password && 'border-destructive focus-visible:ring-destructive'
                    )}
                    disabled={isLoading}
                    aria-describedby={errors.password ? 'password-error' : undefined}
                  />
                  <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    className="absolute right-0 top-0 h-full px-3 py-2 hover:bg-transparent"
                    onClick={() => setShowPassword(!showPassword)}
                    disabled={isLoading}
                  >
                    {showPassword ? (
                      <EyeOff className="h-4 w-4 text-muted-foreground" />
                    ) : (
                      <Eye className="h-4 w-4 text-muted-foreground" />
                    )}
                  </Button>
                </div>
                {errors.password && (
                  <p id="password-error" className="text-sm text-destructive">
                    {errors.password}
                  </p>
                )}
              </div>

              <Button
                type="submit"
                className="w-full h-11"
                disabled={isLoading}
              >
                {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                Sign in
              </Button>
            </form>

            <div className="text-center">
              <Button variant="link" className="text-sm text-primary">
                Forgot your password?
              </Button>
            </div>

            {/* Demo Credentials */}
            <div className="mt-6 p-4 bg-muted rounded-lg text-sm">
              <p className="font-semibold text-foreground mb-2">Demo Credentials:</p>
              <div className="space-y-1 text-muted-foreground">
                <p><strong>SuperAdmin:</strong> admin@bookms.com / password123</p>
                <p><strong>Admin:</strong> manager@bookms.com / password123</p>
                <p><strong>User:</strong> user@bookms.com / password123</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}