import type { Config } from 'tailwindcss'

// 🎨 FOLLOW THE AROMA — Design Tokens
//
// Palette: NYT Cooking warmth meets Indian spice market.
// American editorial clarity + exotic Indian depth.
//
//   Spice      → the personality. Terracotta-red. Indian heat.
//   Ink        → deep warm black. Headlines. Authority.
//   Parchment  → warm off-white. The page. Never clinical.
//   Sand       → warm mid-tone. Secondary text.
//   Gold       → accent. Featured items. Special moments.
//   Sage       → quiet green. Supporting only, never dominant.

const config: Config = {
  content: [
    './pages/**/*.{js,ts,jsx,tsx,mdx}',
    './components/**/*.{js,ts,jsx,tsx,mdx}',
    './app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        // Core palette
        'ink':          '#1a1612',   // Warm black — headlines, logo
        'bark':         '#3d2b1f',   // Deep brown — story section
        'stone':        '#6b5c52',   // Warm grey — body text
        'sand':         '#c4a882',   // Warm tan — meta text, labels
        'parchment':    '#faf6f0',   // Warm off-white — section backgrounds
        'cream':        '#fffdf9',   // Warmest white — page background

        // Accent palette
        'spice':        '#c8440f',   // Terracotta red — CTAs, links, accents
        'spice-soft':   '#e8845a',   // Softer spice — hover states
        'gold':         '#d4962a',   // Warm gold — featured badges, special
        'gold-pale':    '#fdf3dc',   // Pale gold — kids section background
        'sage':         '#5c7a5a',   // Muted green — quick tags only
      },

      fontFamily: {
        // Playfair Display — classic American editorial. NYT energy.
        // Beautiful italics for the logo and pull quotes.
        display: ['var(--font-playfair)', 'Georgia', 'serif'],
        // Inter — clean, modern, universally legible
        body:    ['var(--font-inter)', 'system-ui', 'sans-serif'],
      },

      keyframes: {
        fadeUp: {
          '0%':   { opacity: '0', transform: 'translateY(20px)' },
          '100%': { opacity: '1', transform: 'translateY(0)'    },
        },
        fadeIn: {
          '0%':   { opacity: '0' },
          '100%': { opacity: '1' },
        },
        bob: {
          '0%, 100%': { transform: 'translateY(0)'   },
          '50%':      { transform: 'translateY(-7px)' },
        },
        ticker: {
          '0%':   { transform: 'translateX(0)'    },
          '100%': { transform: 'translateX(-50%)' },
        },
      },
      animation: {
        'fade-up': 'fadeUp 0.65s ease both',
        'fade-in': 'fadeIn 0.5s ease both',
        'bob':     'bob 3s ease-in-out infinite',
        'ticker':  'ticker 24s linear infinite',
      },
    },
  },
  plugins: [],
}

export default config
