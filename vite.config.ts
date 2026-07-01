import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
export default defineConfig({
  // GitHub Pages project site: https://laurarxs2-maker.github.io/Busca-Prestador/
  base: '/Busca-Prestador/',
  // Variáveis sensíveis ficam em .secrets/.env (pasta gitignored).
  envDir: '.secrets',
  plugins: [react()],
})
