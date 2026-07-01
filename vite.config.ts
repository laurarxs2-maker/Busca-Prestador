import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
export default defineConfig({
  // Variáveis sensíveis ficam em .secrets/.env (pasta gitignored).
  envDir: '.secrets',
  plugins: [react()],
})
