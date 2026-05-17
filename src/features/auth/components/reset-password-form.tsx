"use client";

import { Eye, EyeOff } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { useForm, type UseFormRegisterReturn } from "react-hook-form";
import { z } from "zod";

import { createClient } from "@/lib/supabase/client";

const schema = z
  .object({
    password: z.string().min(8, "Password must be at least 8 characters"),
    confirmPassword: z.string().min(1, "Confirm your password"),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Passwords do not match",
    path: ["confirmPassword"],
  });

type FormValues = z.infer<typeof schema>;

function parseHashParams(): URLSearchParams {
  const raw = window.location.hash.replace(/^#/, "");
  return new URLSearchParams(raw);
}

export function ResetPasswordForm() {
  const router = useRouter();
  const [status, setStatus] = useState<"loading" | "ready" | "error">("loading");
  const [statusMessage, setStatusMessage] = useState<string | null>(null);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);

  const {
    register,
    handleSubmit,
    setError,
    formState: { errors, isSubmitting },
  } = useForm<FormValues>({
    defaultValues: { password: "", confirmPassword: "" },
  });

  useEffect(() => {
    let cancelled = false;

    async function establishRecoverySession() {
      const supabase = createClient();
      const params = parseHashParams();
      const accessToken = params.get("access_token");
      const refreshToken = params.get("refresh_token");
      const type = params.get("type");

      if (type === "recovery" && accessToken && refreshToken) {
        const { error } = await supabase.auth.setSession({
          access_token: accessToken,
          refresh_token: refreshToken,
        });
        if (cancelled) {
          return;
        }
        if (error) {
          setStatus("error");
          setStatusMessage(
            "This reset link is invalid or has expired. Request a new one from the login page.",
          );
          return;
        }
        window.history.replaceState(
          {},
          document.title,
          window.location.pathname,
        );
        setStatus("ready");
        return;
      }

      const {
        data: { session },
      } = await supabase.auth.getSession();
      if (cancelled) {
        return;
      }
      if (session) {
        setStatus("ready");
        return;
      }

      setStatus("error");
      setStatusMessage(
        "Open the reset link from your email, or request a new one from the login page.",
      );
    }

    void establishRecoverySession();

    return () => {
      cancelled = true;
    };
  }, []);

  const onSubmit = handleSubmit(async (raw) => {
    const parsed = schema.safeParse(raw);
    if (!parsed.success) {
      for (const issue of parsed.error.issues) {
        const field = issue.path[0];
        if (field === "password" || field === "confirmPassword") {
          setError(field, { message: issue.message });
        }
      }
      return;
    }

    const supabase = createClient();
    const { error } = await supabase.auth.updateUser({
      password: parsed.data.password,
    });

    if (error) {
      setStatusMessage(error.message);
      return;
    }

    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (user) {
      const { data: coach } = await supabase
        .from("coaches")
        .select("id")
        .eq("id", user.id)
        .maybeSingle();

      if (coach) {
        router.replace("/admin");
        router.refresh();
        return;
      }
    }

    router.replace("/login");
    router.refresh();
  });

  if (status === "loading") {
    return (
      <p className="text-center text-sm text-cfl-gray">Verifying reset link…</p>
    );
  }

  if (status === "error") {
    return (
      <ErrorPanel>
        <p className="text-center text-sm text-cfl-gray">{statusMessage}</p>
        <Link
          className="mt-4 inline-flex justify-center rounded border border-cfl-gold/30 px-4 py-2 font-[family-name:var(--font-bebas-neue)] text-base tracking-wider text-cfl-gold transition hover:border-cfl-gold hover:bg-cfl-gold/10"
          href="/login"
        >
          Back to login
        </Link>
      </ErrorPanel>
    );
  }

  return (
    <form
      className="flex w-full max-w-sm flex-col gap-4"
      noValidate
      onSubmit={onSubmit}
    >
      <p className="text-center text-sm text-cfl-gray">
        Choose a new password for your coach account.
      </p>
      <PasswordField
        id="password"
        label="New password"
        show={showPassword}
        onToggle={() => setShowPassword((v) => !v)}
        register={register("password")}
        error={errors.password?.message}
      />
      <PasswordField
        id="confirmPassword"
        label="Confirm password"
        show={showConfirm}
        onToggle={() => setShowConfirm((v) => !v)}
        register={register("confirmPassword")}
        error={errors.confirmPassword?.message}
      />
      {statusMessage ? (
        <p
          className="rounded border border-amber-500/40 bg-amber-500/10 px-3 py-2 text-center text-sm text-amber-200"
          role="alert"
        >
          {statusMessage}
        </p>
      ) : null}
      <button
        type="submit"
        disabled={isSubmitting}
        className="rounded bg-cfl-gold px-4 py-2 font-[family-name:var(--font-bebas-neue)] text-lg tracking-wider text-cfl-navy transition hover:bg-cfl-gold/90 disabled:opacity-50"
      >
        {isSubmitting ? "Saving…" : "Update password"}
      </button>
    </form>
  );
}

function ErrorPanel({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex w-full max-w-sm flex-col items-center">{children}</div>
  );
}

type PasswordFieldProps = {
  id: string;
  label: string;
  show: boolean;
  onToggle: () => void;
  register: UseFormRegisterReturn;
  error?: string;
};

function PasswordField({
  id,
  label,
  show,
  onToggle,
  register,
  error,
}: PasswordFieldProps) {
  return (
    <div className="flex flex-col gap-1">
      <label className="text-sm text-cfl-gray" htmlFor={id}>
        {label}
      </label>
      <div className="relative w-full">
        <input
          id={id}
          type={show ? "text" : "password"}
          autoComplete="new-password"
          className="w-full rounded border border-cfl-gold/30 bg-cfl-navy-light py-2 pl-3 pr-10 text-cfl-white placeholder:text-cfl-gray/60 focus:border-cfl-gold focus:outline-none"
          {...register}
        />
        <button
          type="button"
          className="absolute right-2 top-1/2 -translate-y-1/2 rounded p-1 text-cfl-gray transition hover:text-cfl-gold focus:outline-none focus-visible:ring-2 focus-visible:ring-cfl-gold/50"
          aria-label={show ? "Hide password" : "Show password"}
          aria-pressed={show}
          onClick={onToggle}
        >
          {show ? (
            <EyeOff className="size-5" aria-hidden />
          ) : (
            <Eye className="size-5" aria-hidden />
          )}
        </button>
      </div>
      {error ? <p className="text-sm text-red-400">{error}</p> : null}
    </div>
  );
}
