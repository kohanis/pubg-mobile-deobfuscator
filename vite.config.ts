import { defineConfig } from 'vite'
import purgecss from 'vite-plugin-purgecss'

// https://vite.dev/config/
export default defineConfig({
  plugins: [
    purgecss({
      content: ['./**/*.html'],
      // variables: true,
      // keyframes: true,
    })
  ],
  css: {
    transformer: 'lightningcss',
  },
})