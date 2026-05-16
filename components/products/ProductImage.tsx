"use client";

import { useState } from "react";

interface ProductImageProps {
  src: string;
  alt: string;
  emoji: string;
}

export function ProductImage({ src, alt, emoji }: ProductImageProps) {
  const [failed, setFailed] = useState(false);

  if (failed) {
    return <span className="text-8xl">{emoji}</span>;
  }

  return (
    // eslint-disable-next-line @next/next/no-img-element
    <img
      src={src}
      alt={alt}
      className="h-56 w-56 object-contain"
      onError={() => setFailed(true)}
    />
  );
}
