import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import tailwindcss from "@tailwindcss/vite";

export default defineConfig({
  base: "/sell-site/",
  plugins: [
    {
      name: "rewrite-base-without-slash",
      configureServer(server) {
        server.middlewares.use((req, _res, next) => {
          if (req.url && req.url.startsWith("/sell-site") && !req.url.startsWith("/sell-site/")) {
            req.url = "/sell-site/" + req.url.slice("/sell-site".length);
          }
          next();
        });
      },
    },
    react(),
    tailwindcss(),
  ],
});
