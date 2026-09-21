"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import { Loader2, LockKeyhole } from "lucide-react";
import { Alert } from "@/components/ui/StateMessage";
import { Field, Input } from "@/components/ui/Field";
import { Button } from "@/components/ui/Button";
import { Logo } from "@/components/layout/Logo";

export function AdminLogin({ devHint }: { devHint?: string }) {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [pending, setPending] = useState(false);

  async function handleSubmit(event: React.FormEvent) {
    event.preventDefault();
    setPending(true);
    setError(null);

    try {
      const response = await fetch("/api/admin/session", {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({ email, password }),
      });
      const payload = (await response.json()) as { ok: boolean; error?: string };
      if (!response.ok || !payload.ok) {
        setError(payload.error ?? "Email or password is incorrect.");
        setPending(false);
        return;
      }
      router.refresh();
    } catch {
      setError("Sign-in failed. Please try again.");
      setPending(false);
    }
  }

  return (
    <div className="grid min-h-dvh place-items-center bg-mist px-5 py-12">
      <div className="w-full max-w-md">
        <div className="mb-6 flex justify-center">
          <Logo />
        </div>
        <form onSubmit={handleSubmit} className="surface p-6" noValidate>
          <h1 className="flex items-center gap-2 text-xl">
            <LockKeyhole className="size-5 text-nexus" aria-hidden />
            Admin sign in
          </h1>
          <p className="mt-2 text-sm text-slate-600">
            CRM, audit submissions and order control are restricted to authorised Nexus Lift staff.
          </p>

          {error ? (
            <Alert tone="danger" className="mt-5">
              {error}
            </Alert>
          ) : null}

          <div className="mt-5 grid gap-4">
            <Field label="Email" htmlFor="admin-email" required>
              <Input
                id="admin-email"
                type="email"
                autoComplete="username"
                value={email}
                onChange={(event) => setEmail(event.target.value)}
                required
              />
            </Field>
            <Field label="Password" htmlFor="admin-password" required>
              <Input
                id="admin-password"
                type="password"
                autoComplete="current-password"
                value={password}
                onChange={(event) => setPassword(event.target.value)}
                required
              />
            </Field>
          </div>

          <Button type="submit" size="lg" fullWidth className="mt-6" disabled={pending}>
            {pending ? <Loader2 className="size-4 animate-spin" aria-hidden /> : null}
            {pending ? "Signing in…" : "Sign in"}
          </Button>

          {devHint ? <p className="mt-4 text-xs leading-relaxed text-slate-500">{devHint}</p> : null}
        </form>
      </div>
    </div>
  );
}
