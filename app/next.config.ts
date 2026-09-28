import type { NextConfig } from "next";

import { TAMANHO_MAXIMO_ARQUIVO } from "./lib/limites";

const isDevelopment = process.env.NODE_ENV === "development";

const contentSecurityPolicy = [
  "default-src 'self'",
  `script-src 'self' 'unsafe-inline'${isDevelopment ? " 'unsafe-eval'" : ""}`,
  "style-src 'self' 'unsafe-inline'",
  "img-src 'self' data: blob:",
  "font-src 'self' data:",
  "connect-src 'self'",
  "frame-src 'self' https://www.google.com",
  "object-src 'none'",
  "base-uri 'self'",
  "form-action 'self'",
  "frame-ancestors 'none'",
  ...(isDevelopment ? [] : ["upgrade-insecure-requests"]),
].join("; ");

const securityHeaders = [
  {
    key: "Content-Security-Policy",
    value: contentSecurityPolicy,
  },
  {
    key: "X-Content-Type-Options",
    value: "nosniff",
  },
  {
    key: "X-Frame-Options",
    value: "DENY",
  },
  {
    key: "Referrer-Policy",
    value: "strict-origin-when-cross-origin",
  },
  {
    key: "Permissions-Policy",
    value: "camera=(), microphone=(), geolocation=(), payment=(), usb=()",
  },
];

const documentHeaders = [
  {
    key: "Content-Security-Policy",
    value: "default-src 'self'; frame-ancestors 'self'; object-src 'self'; base-uri 'self'",
  },
  {
    key: "X-Content-Type-Options",
    value: "nosniff",
  },
  {
    key: "X-Frame-Options",
    value: "SAMEORIGIN",
  },
  {
    key: "Referrer-Policy",
    value: "strict-origin-when-cross-origin",
  },
];

const nextConfig: NextConfig = {
  poweredByHeader: false,

  experimental: {
    serverActions: {
      bodySizeLimit: TAMANHO_MAXIMO_ARQUIVO + 1024 * 1024,
    },
  },

  async headers() {
    return [
      // PDFs públicos precisam poder ser exibidos no iframe do próprio site.
      // As demais páginas continuam protegidas contra framing externo.
      {
        source: "/docs/:path*",
        headers: documentHeaders,
      },
      {
        source: "/((?!docs(?:/|$)).*)",
        headers: securityHeaders,
      },
    ];
  },
};

export default nextConfig;
