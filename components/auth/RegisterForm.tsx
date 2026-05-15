"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { signIn } from "next-auth/react";
import { Eye, EyeOff, Loader2, UserPlus } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

export function RegisterForm() {
  const router = useRouter();

  const [form, setForm] = useState({
    firstName: "",
    lastName: "",
    email: "",
    password: "",
    confirmPassword: "",
  });
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  function set(field: string, value: string) {
    setForm((prev) => ({ ...prev, [field]: value }));
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);

    if (form.password !== form.confirmPassword) {
      setError("Las contraseñas no coinciden");
      return;
    }
    if (form.password.length < 8) {
      setError("La contraseña debe tener mínimo 8 caracteres");
      return;
    }

    setLoading(true);

    const res = await fetch("/api/register", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        firstName: form.firstName,
        lastName: form.lastName,
        email: form.email,
        password: form.password,
      }),
    });

    if (!res.ok) {
      const data = await res.json();
      setError(data.error ?? "Error al crear la cuenta");
      setLoading(false);
      return;
    }

    // Auto-login después del registro
    await signIn("credentials", {
      email: form.email,
      password: form.password,
      redirect: false,
    });

    setLoading(false);
    router.push("/");
    router.refresh();
  }

  return (
    <div className="bg-white rounded-2xl shadow-xl p-8">
      {/* Logo */}
      <div className="text-center mb-8">
        <div className="inline-flex h-14 w-14 items-center justify-center rounded-2xl bg-[#2D1B69] text-white text-2xl font-bold mb-4">
          P
        </div>
        <h1 className="text-2xl font-bold text-gray-900">Crear cuenta</h1>
        <p className="text-gray-500 text-sm mt-1">Únete a Droguería Pilar</p>
      </div>

      {/* Error */}
      {error && (
        <div className="mb-4 rounded-xl bg-red-50 border border-red-200 px-4 py-3 text-sm text-red-600">
          {error}
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="grid grid-cols-2 gap-3">
          <div className="space-y-1.5">
            <Label className="text-sm font-medium text-gray-700">Nombre</Label>
            <Input
              placeholder="María"
              value={form.firstName}
              onChange={(e) => set("firstName", e.target.value)}
              required
              className="h-11 rounded-xl border-gray-200 focus-visible:ring-[#7C3AED]"
            />
          </div>
          <div className="space-y-1.5">
            <Label className="text-sm font-medium text-gray-700">Apellido</Label>
            <Input
              placeholder="García"
              value={form.lastName}
              onChange={(e) => set("lastName", e.target.value)}
              required
              className="h-11 rounded-xl border-gray-200 focus-visible:ring-[#7C3AED]"
            />
          </div>
        </div>

        <div className="space-y-1.5">
          <Label className="text-sm font-medium text-gray-700">Correo electrónico</Label>
          <Input
            type="email"
            placeholder="tu@correo.com"
            value={form.email}
            onChange={(e) => set("email", e.target.value)}
            required
            className="h-11 rounded-xl border-gray-200 focus-visible:ring-[#7C3AED]"
          />
        </div>

        <div className="space-y-1.5">
          <Label className="text-sm font-medium text-gray-700">Contraseña</Label>
          <div className="relative">
            <Input
              type={showPassword ? "text" : "password"}
              placeholder="Mínimo 8 caracteres"
              value={form.password}
              onChange={(e) => set("password", e.target.value)}
              required
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

        <div className="space-y-1.5">
          <Label className="text-sm font-medium text-gray-700">Confirmar contraseña</Label>
          <Input
            type="password"
            placeholder="Repite tu contraseña"
            value={form.confirmPassword}
            onChange={(e) => set("confirmPassword", e.target.value)}
            required
            className="h-11 rounded-xl border-gray-200 focus-visible:ring-[#7C3AED]"
          />
        </div>

        {/* Password strength indicator */}
        {form.password && (
          <div className="space-y-1">
            <div className="flex gap-1">
              {[1, 2, 3, 4].map((i) => (
                <div
                  key={i}
                  className={`h-1 flex-1 rounded-full transition-colors ${
                    form.password.length >= i * 3
                      ? i <= 1 ? "bg-red-400" : i <= 2 ? "bg-amber-400" : i <= 3 ? "bg-blue-400" : "bg-green-500"
                      : "bg-gray-200"
                  }`}
                />
              ))}
            </div>
            <p className="text-xs text-gray-400">
              {form.password.length < 4 ? "Muy corta" : form.password.length < 7 ? "Débil" : form.password.length < 10 ? "Aceptable" : "Segura"}
            </p>
          </div>
        )}

        <Button
          type="submit"
          disabled={loading}
          className="w-full h-11 bg-[#2D1B69] hover:bg-[#4A2D9C] text-white rounded-xl font-semibold text-sm gap-2"
        >
          {loading ? (
            <><Loader2 className="h-4 w-4 animate-spin" /> Creando cuenta...</>
          ) : (
            <><UserPlus className="h-4 w-4" /> Crear cuenta</>
          )}
        </Button>
      </form>

      <p className="text-center text-sm text-gray-500 mt-6">
        ¿Ya tienes cuenta?{" "}
        <Link href="/login" className="text-[#7C3AED] hover:text-[#2D1B69] font-medium">
          Inicia sesión
        </Link>
      </p>
    </div>
  );
}
