import mdx from "@astrojs/mdx";
import react from "@astrojs/react";
import sitemap from "@astrojs/sitemap";
import tailwind from "@astrojs/tailwind";
import AutoImport from "astro-auto-import";
import { defineConfig } from "astro/config";
import remarkCollapse from "remark-collapse";
import remarkToc from "remark-toc";
import rehypeKatex from "rehype-katex";
import remarkMath from "remark-math";
import cloudflare from "@astrojs/cloudflare";

// https://astro.build/config
export default defineConfig({
  output: "server", // Enable SSR for Cloudflare Workers
  site: "https://www.arktoshealth.com",
  base: "/",
  trailingSlash: "ignore",

  prefetch: {
    prefetchAll: true
  },

  integrations: [react(), sitemap(), tailwind({
    config: {
      applyBaseStyles: false
    }
  }), AutoImport({
    imports: ["@components/common/Button.astro", "@shortcodes/Accordion", "@shortcodes/Notice", "@shortcodes/Youtube", "@shortcodes/Tabs", "@shortcodes/Tab"]
  }), mdx()],

  markdown: {
    remarkPlugins: [remarkToc, [remarkCollapse, {
      test: "Table of contents"
    }], remarkMath],
    rehypePlugins: [[rehypeKatex, {}]],
    shikiConfig: {
      themes: { // https://shiki.style/themes
        light: "light-plus",
        dark: "dark-plus",
      } 
    },
    extendDefaultPlugins: true,
    allowDangerousHtml: true
  },

  // Configure image service for Cloudflare Workers compatibility
  // Sharp optimizes images at build time for prerendered pages
  adapter: cloudflare({
    imageService: "compile",
    runtime: {
      mode: "local"
    }
  }),

  vite: {
    ssr: {
      external: ["sharp"]
    },
    optimizeDeps: {
      exclude: ["sharp"]
    }
  }
});