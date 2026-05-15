"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { signIn } from "next-auth/react";
import { Eye, EyeOff, Loader2, LogIn } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

export function LoginForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const callbackUrl = searchParams.get("callbackUrl") ?? "/";

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    setLoading(true);

    const res = await signIn("credentials", {
      email,
      password,
      redirect: false,
    });

    setLoading(false);

    if (res?.error) {
      setError("Correo o contraseña incorrectos");
      return;
    }

    router.push(callbackUrl);
    router.refresh();
  }

  return (
    <div className="bg-white rounded-2xl shadow-xl p-8">
      {/* Logo */}
      <div className="text-center mb-8">
        <div className="inline-flex h-14 w-14 items-center justify-center rounded-2xl bg-[#2D1B69] text-white text-2xl font-bold mb-4">
          P
        </div>
        <h1 className="text-2xl font-bold text-gray-900">Bienvenido de nuevo</h1>
        <p className="text-gray-500 text-sm mt-1">Inicia sesión en Droguería Pilar</p>
      </div>

      {/* Error */}
      {error && (
        <div className="mb-4 rounded-xl bg-red-50 border border-red-200 px-4 py-3 text-sm text-red-600">
          {error}
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="space-y-1.5">
          <Label className="text-sm font-medium text-gray-700">Correo electrónico</Label>
          <Input
            type="email"
            placeholder="tu@correo.com"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            autoComplete="email"
            className="h-11 rounded-xl border-gray-200 focus-visible:ring-[#7C3AED]"
          />
        </div>

        <div className="space-y-1.5">
          <div className="flex justify-between items-center">
            <Label className="text-sm font-medium text-gray-700">Contraseña</Label>
            <button
              type="button"
              className="text-xs text-[#7C3AED] hover:text-[#2D1B69]"
            >
              ¿Olvidaste tu contraseña?
            </button>
          </div>
          <div className="relative">
            <Input
              type={showPassword ? "text" : "password"}
              placeholder="••••••••"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              autoComplete="current-password"
              className="h-11 rounded-xl border-gray-200 focus-visible:ring-[#7C3AED] pr-10"
            />
            <button
              type="button"
              onClick={() => setShowPassword((v) => !v)}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
            >
              {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
            </button>
          </div>
        </div>

        <Button
          type="submit"
          disabled={loading}
          className="w-full h-11 bg-[#2D1B69] hover:bg-[#4A2D9C] text-white rounded-xl font-semibold text-sm gap-2"
        >
          {loading ? (
            <><Loader2 className="h-4 w-4 animate-spin" /> Ingresando...</>
          ) : (
            <><LogIn className="h-4 w-4" /> Iniciar sesión</>
          )}
        </Button>
      </form>

      {/* Demo credentials */}
      <div className="mt-4 rounded-xl bg-purple-50 border border-purple-100 p-3 text-xs text-purple-700">
        <p className="font-medium mb-1">Credenciales de prueba:</p>
        <p>Admin: <span className="font-mono">admin@drogueriapilar.com</span> / <span className="font-mono">Admin1234!</span></p>
        <p>Cliente: <span className="font-mono">maria@ejemplo.com</span> / <span className="font-mono">Cliente123!</span></p>
      </div>

      <p className="text-center text-sm text-gray-500 mt-6">
        ¿No tienes cuenta?{" "}
        <Link href="/register" className="text-[#7C3AED] hover:text-[#2D1B69] font-medium">
          Regístrate gratis
        </Link>
      </p>
    </div>
  );
}
