"use client";

import { Eye, EyeOff } from "lucide-react";
import Link from "next/link";
import { useState } from "react";
import { useSearchParams } from "next/navigation";
import { useForm } from "react-hook-form";
import { z } from "zod";

import { sanitizeAdminRedirect } from "@/lib/auth/sanitize-redirect";
import { createClient } from "@/lib/supabase/client";

const loginSchema = z.object({
  email: z.string().min(1, "Email is required").email("Enter a valid email"),
  password: z.string().min(1, "Password is required"),
});

type LoginFormValues = z.infer<typeof loginSchema>;

export function LoginForm() {
  const searchParams = useSearchParams();
  const [authError, setAuthError] = useState<string | null>(null);
  const [showPassword, setShowPassword] = useState(false);

  const {
    register,
    handleSubmit,
    setError,
    formState: { errors, isSubmitting },
  } = useForm<LoginFormValues>({
    defaultValues: { email: "", password: "" },
  });

  const onSubmit = handleSubmit(async (raw) => {
    setAuthError(null);
    const parsed = loginSchema.safeParse(raw);
    if (!parsed.success) {
      let setField = false;
      for (const issue of parsed.error.issues) {
        const field = issue.path[0];
        if (field === "email" || field === "password") {
          setError(field, { message: issue.message });
          setField = true;
        }
      }
      if (!setField) {
        setAuthError("Please check your email and password.");
      }
      return;
    }
    const { email, password } = parsed.data;
    const supabase = createClient();
    const { error } = await supabase.auth.signInWithPassword({
      email: email.trim(),
      password,
    });
    if (error) {
      setAuthError(
        "This account is not registered as a CFL coach. Contact the site owner.",
      );
      return;
    }
    const redirectTo = sanitizeAdminRedirect(
      searchParams.get("redirectTo") ?? undefined,
    );
    window.location.assign(redirectTo);
  });

  return (
    <form
      className="flex w-full max-w-sm flex-col gap-4"
      noValidate
      onSubmit={onSubmit}
    >
      <div className="flex flex-col gap-1">
        <label className="text-sm text-cfl-gray" htmlFor="email">
          Email
        </label>
        <input
          id="email"
          type="email"
          autoComplete="email"
          className="rounded border border-cfl-gold/30 bg-cfl-navy-light px-3 py-2 text-cfl-white placeholder:text-cfl-gray/60 focus:border-cfl-gold focus:outline-none"
          {...register("email")}
        />
        {errors.email ? (
          <p className="text-sm text-red-400">{errors.email.message}</p>
        ) : null}
      </div>
      <div className="flex flex-col gap-1">
        <label className="text-sm text-cfl-gray" htmlFor="password">
          Password
        </label>
        <div className="relative w-full">
          <input
            id="password"
            type={showPassword ? "text" : "password"}
            autoComplete="current-password"
            className="w-full rounded border border-cfl-gold/30 bg-cfl-navy-light py-2 pl-3 pr-10 text-cfl-white placeholder:text-cfl-gray/60 focus:border-cfl-gold focus:outline-none"
            {...register("password")}
          />
          <button
            type="button"
            className="absolute right-2 top-1/2 -translate-y-1/2 rounded p-1 text-cfl-gray transition hover:text-cfl-gold focus:outline-none focus-visible:ring-2 focus-visible:ring-cfl-gold/50"
            aria-label={showPassword ? "Hide password" : "Show password"}
            aria-pressed={showPassword}
            onClick={() => setShowPassword((v) => !v)}
          >
            {showPassword ? (
              <EyeOff className="size-5" aria-hidden />
            ) : (
              <Eye className="size-5" aria-hidden />
            )}
          </button>
        </div>
        {errors.password ? (
          <p className="text-sm text-red-400">{errors.password.message}</p>
        ) : null}
      </div>
      {authError ? (
        <p
          className="rounded border border-amber-500/40 bg-amber-500/10 px-3 py-2 text-center text-sm text-amber-200"
          role="alert"
        >
          {authError}
        </p>
      ) : null}
      <Link
        className="text-center text-sm text-cfl-gold hover:underline"
        href="/login/forgot-password"
      >
        Forgot password?
      </Link>
      <button
        type="submit"
        disabled={isSubmitting}
        className="rounded bg-cfl-gold px-4 py-2 font-[family-name:var(--font-bebas-neue)] text-lg tracking-wider text-cfl-navy transition hover:bg-cfl-gold/90 disabled:opacity-50"
      >
        {isSubmitting ? "Signing in…" : "Sign in"}
      </button>
    </form>
  );
}
