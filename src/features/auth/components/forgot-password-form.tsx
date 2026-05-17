"use client";

import Link from "next/link";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";

import { createClient } from "@/lib/supabase/client";

const schema = z.object({
  email: z.string().min(1, "Email is required").email("Enter a valid email"),
});

type FormValues = z.infer<typeof schema>;

export function ForgotPasswordForm() {
  const [sent, setSent] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<FormValues>({
    defaultValues: { email: "" },
  });

  const onSubmit = handleSubmit(async (raw) => {
    setError(null);
    const parsed = schema.safeParse(raw);
    if (!parsed.success) {
      return;
    }
    const supabase = createClient();
    const redirectTo = `${window.location.origin}/auth/reset-password`;
    const { error: resetError } = await supabase.auth.resetPasswordForEmail(
      parsed.data.email.trim(),
      { redirectTo },
    );
    if (resetError) {
      setError(resetError.message);
      return;
    }
    setSent(true);
  });

  if (sent) {
    return (
      <div className="flex w-full max-w-sm flex-col gap-4 text-center">
        <p className="text-sm leading-7 text-cfl-gray">
          If an account exists for that email, we sent a reset link. Check your
          inbox and open the link to choose a new password.
        </p>
        <Link
          className="text-sm text-cfl-gold hover:underline"
          href="/login"
        >
          Back to login
        </Link>
      </div>
    );
  }

  return (
    <form
      className="flex w-full max-w-sm flex-col gap-4"
      noValidate
      onSubmit={onSubmit}
    >
      <p className="text-center text-sm text-cfl-gray">
        Enter your coach account email. We will send a link to reset your
        password.
      </p>
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
      {error ? (
        <p
          className="rounded border border-amber-500/40 bg-amber-500/10 px-3 py-2 text-center text-sm text-amber-200"
          role="alert"
        >
          {error}
        </p>
      ) : null}
      <button
        type="submit"
        disabled={isSubmitting}
        className="rounded bg-cfl-gold px-4 py-2 font-[family-name:var(--font-bebas-neue)] text-lg tracking-wider text-cfl-navy transition hover:bg-cfl-gold/90 disabled:opacity-50"
      >
        {isSubmitting ? "Sending…" : "Send reset link"}
      </button>
      <Link
        className="text-center text-sm text-cfl-gold hover:underline"
        href="/login"
      >
        Back to login
      </Link>
    </form>
  );
}
