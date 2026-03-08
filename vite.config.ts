import { defineConfig, Plugin } from 'vite'
import path from 'path'
import tailwindcss from '@tailwindcss/vite'
import react from '@vitejs/plugin-react'

/**
 * Resolves `figma:asset/<hash>.<ext>` virtual imports to the public logo
 * so the project builds correctly outside of the Figma Make sandbox.
 *
 * All assets used in this project resolve to the same PhxNorth logo SVG.
 * If you add raster images in the future, extend the `assetMap` below with
 * the exact hash strings and the corresponding file paths under `/public`.
 */
function figmaAssetPlugin(): Plugin {
  const SCHEME = 'figma:asset/'
  const VIRTUAL_PREFIX = '\0figma:asset:'

  // Map specific known asset hashes to real public paths.
  // The fallback '/logo.svg' is used for any unrecognised hash.
  const assetMap: Record<string, string> = {
    'b1f426d4ba424225ba35199a602ba050b5c13573.png': '/logo.svg',
  }

  return {
    name: 'figma-asset-resolver',
    resolveId(source) {
      if (source.startsWith(SCHEME)) {
        return VIRTUAL_PREFIX + source.slice(SCHEME.length)
      }
    },
    load(id) {
      if (id.startsWith(VIRTUAL_PREFIX)) {
        const assetName = id.slice(VIRTUAL_PREFIX.length)
        const resolved = assetMap[assetName] ?? '/logo.svg'
        return `export default ${JSON.stringify(resolved)}`
      }
    },
  }
}

export default defineConfig({
  plugins: [
    // The React and Tailwind plugins are both required for Make, even if
    // Tailwind is not being actively used – do not remove them
    react(),
    tailwindcss(),
    figmaAssetPlugin(),
  ],
  resolve: {
    alias: {
      // Alias @ to the src directory
      '@': path.resolve(__dirname, './src'),
    },
  },

  // File types to support raw imports. Never add .css, .tsx, or .ts files to this.
  assetsInclude: ['**/*.svg', '**/*.csv'],

  server: {
    proxy: {
      '/api': {
        target: 'http://localhost:8081',
        changeOrigin: true,
      },
    },
  },

  build: {
    // Standard output directory for hosting platforms (Vercel, Netlify, etc.)
    outDir: 'dist',
    // Produce source maps for production debugging
    sourcemap: false,
    // Raise the chunk-size warning limit slightly given the SaaS feature set
    chunkSizeWarningLimit: 1500,
    rollupOptions: {
      output: {
        // Manual chunk splitting for better caching
        manualChunks: {
          vendor: ['react', 'react-dom'],
          router: ['react-router'],
          ui: ['@radix-ui/react-dialog', '@radix-ui/react-tabs', '@radix-ui/react-dropdown-menu'],
          charts: ['recharts'],
          motion: ['motion'],
        },
      },
    },
  },
})
