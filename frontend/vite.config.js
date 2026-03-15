import { defineConfig } from "vite";
import { resolve } from "path";

export default defineConfig({
  build: {
    rollupOptions: {
      input: {
        main: resolve(__dirname, "index.html"),
        about: resolve(__dirname, "about.html"),
        admin: resolve(__dirname, "admin.html"),
        book: resolve(__dirname, "book.html"),
        cars: resolve(__dirname, "cars.html"),
        contact: resolve(__dirname, "contact.html"),
        login: resolve(__dirname, "login.html"),
        profile: resolve(__dirname, "profile.html"),
        register: resolve(__dirname, "register.html"),
      },
    },
  },
});
