// @ts-check
import { defineConfig, fontProviders } from "astro/config";

import cloudflare from "@astrojs/cloudflare";

import tailwindcss from "@tailwindcss/vite";

// https://astro.build/config
export default defineConfig({
  adapter: cloudflare(),
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
});
