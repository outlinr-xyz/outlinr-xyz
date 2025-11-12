import { zodResolver } from '@hookform/resolvers/zod';
import { Eye, EyeOff, Loader2 } from 'lucide-react';
import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { Link, useNavigate, useSearchParams } from 'react-router-dom';
import { toast } from 'sonner';
import { z } from 'zod';

import { Button } from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import {
  Field,
  FieldDescription,
  FieldGroup,
  FieldLabel,
} from '@/components/ui/field';
import { Input } from '@/components/ui/input';
import { supabase } from '@/lib/supabase';
import { cn, oauthProviders } from '@/lib/utils';
import { useAuthStore } from '@/store/auth.store';

type Props = React.ComponentProps<'div'>;

const SignupSchema = z
  .object({
    email: z.email('Please enter a valid email address.'),
    password: z
      .string()
      .min(8, 'Password must be at least 8 characters.')
      .max(128, 'Password is too long.'),
    confirmPassword: z.string().min(1, 'Please confirm your password.'),
  })
  .superRefine((val, ctx) => {
    if (val.password !== val.confirmPassword) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        path: ['confirmPassword'],
        message: 'Passwords do not match.',
      });
    }
  });

type SignupFormValues = z.infer<typeof SignupSchema>;

type LoadingProvider =
  | 'email'
  | 'google'
  | 'azure'
  | 'discord'
  | 'linkedin_oidc'
  | null;

export function SignupForm({ className, ...props }: Props) {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const redirectTo = searchParams.get('redirectTo') || '/app/home';

  const setSession = useAuthStore((s) => s.setSession);
  const setUser = useAuthStore((s) => s.setUser);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<SignupFormValues>({
    resolver: zodResolver(SignupSchema),
    mode: 'onTouched',
  });

  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [loadingProvider, setLoadingProvider] = useState<LoadingProvider>(null);
  const isAnyLoading = loadingProvider !== null;
  const isEmailLoading = loadingProvider === 'email';

  async function onSubmit(values: SignupFormValues) {
    setLoadingProvider('email');
    toast.dismiss();

    try {
      const { data, error } = await supabase.auth.signUp({
        email: values.email,
        password: values.password,
      });

      if (error) {
        if (error.message?.toLowerCase().includes('already')) {
          toast.error('An account with that email already exists.');
        } else {
          toast.error(error.message || 'Unable to create account.');
        }
        return;
      }

      const { session: sessionData, user: userData } = data;
      setSession(sessionData ?? null);
      setUser(userData ?? null);

      toast.success('Account created successfully.');
      navigate(redirectTo, { replace: true });
    } catch (e: unknown) {
      toast.error(e instanceof Error ? e.message : 'Unexpected error.');
    } finally {
      setLoadingProvider(null);
    }
  }

  async function handleOAuth(
    provider: 'google' | 'azure' | 'discord' | 'linkedin_oidc',
  ) {
    setLoadingProvider(provider);
    toast.dismiss();
    try {
      const { error } = await supabase.auth.signInWithOAuth({
        provider,
        options: {
          redirectTo: `${window.location.origin}/app/home`,
        },
      });
      if (error) {
        toast.error(error.message || 'OAuth failed.');
        setLoadingProvider(null);
        return;
      }
      toast('Redirecting to provider...');
    } catch (e: unknown) {
      toast.error(e instanceof Error ? e.message : 'Unexpected OAuth error.');
      setLoadingProvider(null);
    }
  }

  return (
    <div className={cn('flex flex-col gap-6', className)} {...props}>
      <Card>
        <CardHeader>
          <CardTitle>Create your account</CardTitle>
          <CardDescription>
            Enter your details below to sign up for a new account
          </CardDescription>
        </CardHeader>

        <CardContent>
          <form
            className="space-y-4"
            onSubmit={handleSubmit(onSubmit)}
            noValidate
          >
            <FieldGroup>
              <Field>
                <FieldLabel htmlFor="email">Email</FieldLabel>
                <Input
                  id="email"
                  type="email"
                  placeholder="m@example.com"
                  aria-invalid={!!errors.email}
                  disabled={isAnyLoading}
                  {...register('email')}
                />
                {errors.email?.message && (
                  <p className="text-destructive mt-1 text-xs">
                    {errors.email.message}
                  </p>
                )}
              </Field>

              <Field>
                <FieldLabel htmlFor="password">Password</FieldLabel>
                <div className="relative">
                  <Input
                    id="password"
                    type={showPassword ? 'text' : 'password'}
                    className="pr-10"
                    aria-invalid={!!errors.password}
                    disabled={isAnyLoading}
                    {...register('password')}
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword((s) => !s)}
                    className="text-muted-foreground absolute inset-y-0 right-3 flex items-center"
                    aria-label={
                      showPassword ? 'Hide password' : 'Show password'
                    }
                  >
                    {showPassword ? (
                      <EyeOff className="h-4 w-4" />
                    ) : (
                      <Eye className="h-4 w-4" />
                    )}
                  </button>
                </div>
                {errors.password?.message && (
                  <p className="text-destructive mt-1 text-xs">
                    {errors.password.message}
                  </p>
                )}
              </Field>

              <Field>
                <FieldLabel htmlFor="confirm-password">
                  Confirm Password
                </FieldLabel>
                <div className="relative">
                  <Input
                    id="confirm-password"
                    type={showConfirmPassword ? 'text' : 'password'}
                    className="pr-10"
                    aria-invalid={!!errors.confirmPassword}
                    disabled={isAnyLoading}
                    {...register('confirmPassword')}
                  />
                  <button
                    type="button"
                    onClick={() => setShowConfirmPassword((s) => !s)}
                    className="text-muted-foreground absolute inset-y-0 right-3 flex items-center"
                    aria-label={
                      showConfirmPassword ? 'Hide password' : 'Show password'
                    }
                  >
                    {showConfirmPassword ? (
                      <EyeOff className="h-4 w-4" />
                    ) : (
                      <Eye className="h-4 w-4" />
                    )}
                  </button>
                </div>
                {errors.confirmPassword?.message && (
                  <p className="text-destructive mt-1 text-xs">
                    {errors.confirmPassword.message}
                  </p>
                )}
              </Field>

              <Field>
                <Button
                  type="submit"
                  className="w-full"
                  disabled={isAnyLoading}
                >
                  {isEmailLoading ? (
                    <>
                      <Loader2 className="h-4 w-4 animate-spin" />
                      Signing up...
                    </>
                  ) : (
                    'Sign Up'
                  )}
                </Button>
              </Field>

              <div className="text-muted-foreground flex items-center justify-center gap-2 py-2 text-sm">
                <span className="bg-border h-px w-16"></span>
                or sign up with
                <span className="bg-border h-px w-16"></span>
              </div>

              <div className="grid grid-cols-2 gap-3">
                {oauthProviders.map((p) => {
                  const isProviderLoading = loadingProvider === p.provider;
                  return (
                    <Button
                      key={p.provider}
                      variant="outline"
                      type="button"
                      className="flex items-center justify-center gap-2"
                      disabled={isAnyLoading}
                      onClick={() =>
                        handleOAuth(
                          p.provider as
                            | 'google'
                            | 'azure'
                            | 'discord'
                            | 'linkedin_oidc',
                        )
                      }
                    >
                      {isProviderLoading ? (
                        <Loader2 className="h-4 w-4 animate-spin" />
                      ) : (
                        <img
                          src={p.icon}
                          alt={p.name}
                          className="h-5 w-5 object-contain"
                        />
                      )}
                      {p.name}
                    </Button>
                  );
                })}
              </div>

              <FieldDescription className="text-center">
                Already have an account?{' '}
                <Link to="/auth/login" className="underline underline-offset-4">
                  Login
                </Link>
              </FieldDescription>
            </FieldGroup>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
