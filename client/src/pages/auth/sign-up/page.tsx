import { Link } from 'react-router';

import { SignupForm } from '../_components/signup-form';

export default function SignupPage() {
  return (
    <>
      <SignupForm />
      <p className="text-muted-foreground text-center text-xs">
        By signing up, you agree to our{' '}
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
