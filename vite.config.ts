import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import tailwindcss from '@tailwindcss/vite';

export default defineConfig({
  plugins: [react(), tailwindcss()],
  server: {
    port: 5173,
    // These platforms do not consistently permit browser cross-origin requests.
    // Keeping the proxy local means usernames and public stats remain the only data sent.
    proxy: {
      '/api/leetcode': { target: 'https://leetcode.com', changeOrigin: true, rewrite: (path) => path.replace(/^\/api\/leetcode/, '') },
      '/api/codeforces': { target: 'https://codeforces.com', changeOrigin: true, rewrite: (path) => path.replace(/^\/api\/codeforces/, '') },
      '/api/codechef': { target: 'https://www.codechef.com', changeOrigin: true, rewrite: (path) => path.replace(/^\/api\/codechef/, '') },
    },
  },
});
