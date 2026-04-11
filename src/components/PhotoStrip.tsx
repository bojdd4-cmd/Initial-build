"use client";

import Image from "next/image";

interface Photo {
  src: string;
  alt: string;
}

export default function PhotoStrip({ photos }: { photos: Photo[] }) {
  // Duplicate for seamless loop
  const doubled = [...photos, ...photos];

  return (
    <div className="flex gap-4" style={{ animation: "scrollX 28s linear infinite" }}>
      {doubled.map((photo, i) => (
        <div
          key={i}
          className="relative flex-shrink-0 w-48 h-64 rounded-xl overflow-hidden"
          style={{ border: "1px solid rgba(255,255,255,0.06)" }}
        >
          <Image
            src={photo.src}
            alt={photo.alt}
            fill
            className="object-cover object-top"
            sizes="192px"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-[#080810]/80 via-transparent to-transparent" />
        </div>
      ))}
    </div>
  );
}
