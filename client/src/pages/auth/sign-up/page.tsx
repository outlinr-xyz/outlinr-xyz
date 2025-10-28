import { SignupForm } from '../_components/signup-form';

export default function SignupPage() {
  return (
    <>
      <SignupForm />
      <p className="text-muted-foreground text-center text-xs">
        By signing up, you agree to our{' '}
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
