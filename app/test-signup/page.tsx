import { SignUp } from "@clerk/nextjs";

export default function TestSignup() {
  return (
    <div className="flex min-h-screen items-center justify-center">
      <SignUp />
    </div>
  );
}