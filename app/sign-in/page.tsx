"use client";

import { AuthDialog } from "@/components/auth/auth-dialog";

export default function SignInPage() {
  return (
    <main className="container mx-auto px-4 py-8 flex justify-center">
      <AuthDialog defaultMode="login">
        <button className="btn btn-primary">Open Sign In</button>
      </AuthDialog>
    </main>
  );
}
