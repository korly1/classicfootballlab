import { ResetPasswordForm } from "@/features/auth/components/reset-password-form";

export const metadata = {
  title: "Reset password | Classic Football Lab",
};

export default function ResetPasswordPage() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-center gap-6 p-8">
      <h1 className="font-[family-name:var(--font-bebas-neue)] text-3xl tracking-[0.2em] text-cfl-white">
        Set new password
      </h1>
      <ResetPasswordForm />
    </main>
  );
}
