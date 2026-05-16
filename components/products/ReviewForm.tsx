"use client";

import { useState } from "react";
import { useSession } from "next-auth/react";
import { Star, Send, Loader2, CheckCircle2, AlertCircle, LogIn } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import Link from "next/link";

interface ReviewFormProps {
  productId: string;
}

export function ReviewForm({ productId }: ReviewFormProps) {
  const { status } = useSession();
  const [rating, setRating]     = useState(0);
  const [hovered, setHovered]   = useState(0);
  const [title, setTitle]       = useState("");
  const [body, setBody]         = useState("");
  const [loading, setLoading]   = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [error, setError]       = useState<string | null>(null);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (rating === 0) { setError("Selecciona una puntuación."); return; }
    setError(null);
    setLoading(true);

    const res = await fetch(`/api/reviews/${productId}`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ rating, title: title.trim(), body: body.trim() }),
    });

    const data = await res.json();
    if (res.ok) {
      setSubmitted(true);
    } else {
      setError(data.error ?? "Error al enviar la reseña.");
    }
    setLoading(false);
  }

  /* ── No autenticado ── */
  if (status === "unauthenticated") {
    return (
      <div className="flex flex-col items-center gap-3 py-6 text-center">
        <LogIn className="h-8 w-8 text-gray-300" />
        <p className="text-sm text-gray-500">Inicia sesión para dejar una reseña</p>
        <Link href="/login">
          <Button size="sm" className="bg-[#2D1B69] hover:bg-[#4A2D9C] text-white rounded-xl">
            Iniciar sesión
          </Button>
        </Link>
      </div>
    );
  }

  /* ── Enviado ── */
  if (submitted) {
    return (
      <div className="flex flex-col items-center gap-3 py-6 text-center">
        <CheckCircle2 className="h-10 w-10 text-green-500" />
        <p className="font-semibold text-gray-800">¡Gracias por tu reseña!</p>
        <p className="text-sm text-gray-500">Será visible una vez aprobada por el equipo.</p>
      </div>
    );
  }

  /* ── Formulario ── */
  return (
    <form onSubmit={handleSubmit} className="space-y-4">

      {/* Estrellas */}
      <div className="space-y-1.5">
        <Label className="text-sm font-medium text-gray-700">
          Puntuación <span className="text-red-500">*</span>
        </Label>
        <div className="flex gap-1">
          {[1, 2, 3, 4, 5].map((s) => (
            <button
              key={s}
              type="button"
              onClick={() => setRating(s)}
              onMouseEnter={() => setHovered(s)}
              onMouseLeave={() => setHovered(0)}
              className="transition-transform hover:scale-110"
              aria-label={`${s} estrella${s > 1 ? "s" : ""}`}
            >
              <Star
                className={`h-8 w-8 transition-colors ${
                  s <= (hovered || rating)
                    ? "fill-amber-400 text-amber-400"
                    : "fill-gray-100 text-gray-300"
                }`}
              />
            </button>
          ))}
        </div>
        {rating > 0 && (
          <p className="text-xs text-gray-400">
            {["", "Muy malo", "Malo", "Regular", "Bueno", "Excelente"][rating]}
          </p>
        )}
      </div>

      {/* Título */}
      <div className="space-y-1.5">
        <Label className="text-sm font-medium text-gray-700">Título (opcional)</Label>
        <Input
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          placeholder="Resume tu experiencia en pocas palabras"
          maxLength={80}
          className="rounded-xl border-gray-200 h-10 focus-visible:ring-[#7C3AED]"
        />
      </div>

      {/* Comentario */}
      <div className="space-y-1.5">
        <Label className="text-sm font-medium text-gray-700">Comentario (opcional)</Label>
        <textarea
          value={body}
          onChange={(e) => setBody(e.target.value)}
          placeholder="Cuéntanos más sobre el producto, ¿lo recomendarías?"
          maxLength={500}
          rows={3}
          className="w-full rounded-xl border border-gray-200 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[#7C3AED] resize-none"
        />
        <p className="text-xs text-gray-400 text-right">{body.length}/500</p>
      </div>

      {/* Error */}
      {error && (
        <div className="flex items-center gap-2 text-sm text-red-600 bg-red-50 border border-red-200 rounded-xl px-3 py-2">
          <AlertCircle className="h-4 w-4 shrink-0" />
          {error}
        </div>
      )}

      <Button
        type="submit"
        disabled={loading}
        className="bg-[#2D1B69] hover:bg-[#4A2D9C] text-white rounded-xl gap-2 h-10"
      >
        {loading
          ? <Loader2 className="h-4 w-4 animate-spin" />
          : <Send className="h-4 w-4" />}
        Enviar reseña
      </Button>
    </form>
  );
}
