import { ForgotPasswordForm } from "@/features/auth/components/forgot-password-form";

export const metadata = {
  title: "Forgot password | Classic Football Lab",
};

export default function ForgotPasswordPage() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-center gap-6 p-8">
      <h1 className="font-[family-name:var(--font-bebas-neue)] text-3xl tracking-[0.2em] text-cfl-white">
        Reset password
      </h1>
      <ForgotPasswordForm />
    </main>
  );
}
