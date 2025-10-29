import { Link } from 'react-router';

import { LoginForm } from '../_components/login-form';

export default function LoginPage() {
  return (
    <>
      <LoginForm />
      <p className="text-muted-foreground text-center text-xs">
        By logging in, you agree to our{' '}
        <Link to="#" className="underline underline-offset-4">
          Terms of Service
        </Link>{' '}
        and{' '}
        <Link to="#" className="underline underline-offset-4">
          Privacy Policy
        </Link>
        .
      </p>
    </>
  );
}
