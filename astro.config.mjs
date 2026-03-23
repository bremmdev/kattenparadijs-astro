// @ts-check
import { defineConfig, fontProviders } from "astro/config";

import cloudflare from "@astrojs/cloudflare";

import tailwindcss from "@tailwindcss/vite";

import react from "@astrojs/react";

// https://astro.build/config
export default defineConfig({
  adapter: cloudflare(),
  security: {
    csp: {
      directives: [
        "default-src 'self'",
        "img-src 'self' https://cdn.sanity.io",
        "media-src 'self' https://cdn.sanity.io",
        "font-src 'self'",
        "object-src 'none'",
        "base-uri 'self'",
        "form-action 'self'",
        "upgrade-insecure-requests",
      ],
      styleDirective: { resources: ["'self'"] },
      scriptDirective: { resources: ["'self'"] },
    },
  },
  fonts: [
    {
      provider: fontProviders.fontsource(),
      name: "Dancing Script",
      cssVariable: "--font-dancing-script",
    },
    {
      provider: fontProviders.fontsource(),
      name: "Poppins",
      weights: [400, 500, 700],
      cssVariable: "--font-poppins",
    },
  ],
  vite: {
    plugins: [tailwindcss()],
  },

  integrations: [react()],
});
