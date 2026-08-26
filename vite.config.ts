import { defineConfig } from "vite";
import react from "@vitejs/plugin-react-swc";
import path from "path";
import fs from "fs";
import { fileURLToPath } from "url";
import { componentTagger } from "lovable-tagger";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// https://vitejs.dev/config/
export default defineConfig(({ mode }) => ({
  server: {
    host: "::",
    port: 8080,
    configureServer: (server) => {
      server.middlewares.use((req, res, next) => {
        if (req.url) {
          const pathname = req.url.split('?')[0];
          if (pathname.startsWith('/reviewdash/') && !pathname.includes('.')) {
            const indexPath = path.resolve(__dirname, 'public/reviewdash/index.html');
            if (fs.existsSync(indexPath)) {
              res.setHeader('Content-Type', 'text/html');
              res.end(fs.readFileSync(indexPath));
              return;
            }
          }
        }
        next();
      });
    }
  },
  plugins: [
    react(),
    mode === "development" && componentTagger()
  ].filter(Boolean),
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
  },
}));
