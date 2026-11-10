import { defineConfig, type Plugin } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'
import { handleAuthApi } from './server/authBackend.ts'

function authApiPlugin(): Plugin {
  return {
    name: 'carbonova-auth-api-plugin',
    configureServer(server) {
      server.middlewares.use(async (req, res, next) => {
        try {
          const handled = await handleAuthApi(req, res)
          if (!handled) next()
        } catch (err) {
          next(err)
        }
      })
    },
    configurePreviewServer(server) {
      server.middlewares.use(async (req, res, next) => {
        try {
          const handled = await handleAuthApi(req, res)
          if (!handled) next()
        } catch (err) {
          next(err)
        }
      })
    },
  }
}

// https://vite.dev/config/
export default defineConfig({
  plugins: [
    react(),
    tailwindcss(),
    authApiPlugin(),
  ],
})
