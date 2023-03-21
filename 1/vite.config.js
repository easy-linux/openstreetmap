import { defineConfig } from "vite";
import timeMarkPlugin from "./plugins/vite-plugin-timemark";

export default defineConfig({
  build: {
    target: "es2017",
    outDir: "build",
    lib:{
      entry: 'src/map-component.js',
      name: 'EasyItMap',
      fileName: 'easy-it-map'
    }
    // rollupOptions: {
    //   output: {
    //     assetFileNames: ({ name }) => {
    //       if (/\.(gif|jpe?g|png|svg)$/.test(name ?? "")) {
    //         return "assets/images/[name]-[hash][extname]";
    //       }

    //       if (/\.(ttf|otf|fnt|woff)$/.test(name ?? "")) {
    //         return "assets/fonts/[name]-[hash][extname]";
    //       }

    //       if (/\.css$/.test(name ?? "")) {
    //         return "assets/css/[name]-[hash][extname]";
    //       }

    //       return "assets/[name]-[hash][extname]";
    //     },
    //   },
    // },
  },
  server: {
    port: 3000,
    host: "0.0.0.0",
    hmr: true,
  },
  plugins: [
    timeMarkPlugin(),
  ],
});
