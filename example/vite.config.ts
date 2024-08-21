import path from 'node:path'
import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
// import autoI18n from 'vite-auto-i18n'
import autoI18n from '../dist'

export default defineConfig(() => {
  const root = __dirname

  return {
    root,
    build: {
      minify: false,
    },
    plugins: [
      autoI18n(),
      react(),
    ],
    resolve: {
      alias: {
        '@': path.join(__dirname, 'src'),
      },
    },
  }
})
