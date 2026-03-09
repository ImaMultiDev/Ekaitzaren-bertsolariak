"use client";

import { signIn } from "next-auth/react";
import { useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";

export default function AdminLoginPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const callbackUrl = searchParams.get("callbackUrl") || "/admin";
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError("");
    const res = await signIn("credentials", {
      email,
      password,
      redirect: false,
    });
    if (res?.error) {
      setError("Credenciales incorrectas");
      return;
    }
    router.push(callbackUrl);
    router.refresh();
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-charcoal px-6">
      <form
        onSubmit={handleSubmit}
        className="w-full max-w-sm space-y-6"
      >
        <h1 className="font-display text-2xl text-white-broken text-center">
          Admin
        </h1>
        <div>
          <label htmlFor="email" className="block text-xs text-grey-muted uppercase tracking-wider mb-2">
            Email
          </label>
          <input
            id="email"
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            className="w-full bg-transparent border border-border px-4 py-2 text-white-broken focus:outline-none focus:border-white-broken/40"
          />
        </div>
        <div>
          <label htmlFor="password" className="block text-xs text-grey-muted uppercase tracking-wider mb-2">
            Contraseña
          </label>
          <input
            id="password"
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            className="w-full bg-transparent border border-border px-4 py-2 text-white-broken focus:outline-none focus:border-white-broken/40"
          />
        </div>
        {error && (
          <p className="text-sm text-grey-muted">{error}</p>
        )}
        <button
          type="submit"
          className="w-full py-2 text-sm tracking-widest uppercase text-charcoal bg-white-broken hover:bg-white-muted transition-colors"
        >
          Entrar
        </button>
      </form>
    </div>
  );
}
