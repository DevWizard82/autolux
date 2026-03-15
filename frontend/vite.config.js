import { defineConfig } from "vite";
import tailwindcss from "@tailwindcss/vite";
import { resolve, dirname } from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

export default defineConfig({
  plugins: [tailwindcss()],
  build: {
    rollupOptions: {
      input: {
        main: resolve(__dirname, "index.html"),
        about: resolve(__dirname, "about.html"),
        admin: resolve(__dirname, "admin.html"),
        book: resolve(__dirname, "book.html"),
        cars: resolve(__dirname, "cars.html"),
        carviewer: resolve(__dirname, "carviewer.html"),
        contact: resolve(__dirname, "contact.html"),
        login: resolve(__dirname, "login.html"),
        profile: resolve(__dirname, "profile.html"),
        register: resolve(__dirname, "register.html"),
      },
    },
  },
});
