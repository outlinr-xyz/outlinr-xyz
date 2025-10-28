import { LoginForm } from '../_components/login-form';

export default function LoginPage() {
  return (
    <>
      <LoginForm />
      <p className="text-muted-foreground text-center text-xs">
        By logging in, you agree to our{' '}
        <a href="#" className="underline underline-offset-4">
          Terms of Service
        </a>{' '}
        and{' '}
        <a href="#" className="underline underline-offset-4">
          Privacy Policy
        </a>
        .
      </p>
    </>
  );
}
