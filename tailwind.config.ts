import type { Config } from 'tailwindcss';
import animate from 'tailwindcss-animate';
import plugin from 'tailwindcss/plugin';

export default {
  darkMode: ['class'],
  content: ['./index.html', './src/**/*.{ts,tsx}'],
  theme: {
    container: {
      center: true,
      padding: {
        DEFAULT: '1.25rem',
        sm: '1.5rem',
        lg: '2.5rem',
        xl: '3.5rem',
        '2xl': '4rem',
      },
      screens: {
        '2xl': '1560px',
      },
    },
    extend: {
      colors: {
        background: 'hsl(var(--background))',
        foreground: 'hsl(var(--foreground))',
        card: {
          DEFAULT: 'hsl(var(--card))',
          foreground: 'hsl(var(--card-foreground))',
        },
        popover: {
          DEFAULT: 'hsl(var(--popover))',
          foreground: 'hsl(var(--popover-foreground))',
        },
        primary: {
          DEFAULT: 'hsl(var(--primary))',
          foreground: 'hsl(var(--primary-foreground))',
        },
        secondary: {
          DEFAULT: 'hsl(var(--secondary))',
          foreground: 'hsl(var(--secondary-foreground))',
        },
        muted: {
          DEFAULT: 'hsl(var(--muted))',
          foreground: 'hsl(var(--muted-foreground))',
        },
        accent: {
          DEFAULT: 'hsl(var(--accent))',
          foreground: 'hsl(var(--accent-foreground))',
        },
        destructive: {
          DEFAULT: 'hsl(var(--destructive))',
          foreground: 'hsl(var(--destructive-foreground))',
        },
        border: 'hsl(var(--border))',
        input: 'hsl(var(--input))',
        ring: 'hsl(var(--ring))',
        /* Brand palette — bridal, warm, restrained */
        ivory: {
          DEFAULT: 'hsl(var(--ivory))',
          deep: 'hsl(var(--ivory-deep))',
        },
        pearl: 'hsl(var(--pearl))',
        cream: 'hsl(var(--cream))',
        champagne: {
          DEFAULT: 'hsl(var(--champagne))',
          soft: 'hsl(var(--champagne-soft))',
        },
        blush: {
          DEFAULT: 'hsl(var(--blush))',
          deep: 'hsl(var(--blush-deep))',
        },
        taupe: {
          DEFAULT: 'hsl(var(--taupe))',
          light: 'hsl(var(--taupe-light))',
        },
        gold: {
          DEFAULT: 'hsl(var(--gold))',
          soft: 'hsl(var(--gold-soft))',
          deep: 'hsl(var(--gold-deep))',
        },
        ink: {
          DEFAULT: 'hsl(var(--ink))',
          soft: 'hsl(var(--ink-soft))',
          muted: 'hsl(var(--ink-muted))',
        },
      },
      borderRadius: {
        none: '0',
        sm: '2px',
        DEFAULT: '3px',
        md: '4px',
        lg: '6px',
        xl: '10px',
      },
      fontFamily: {
        display: ['"Cormorant Garamond"', 'Georgia', 'Times New Roman', 'serif'],
        sans: ['Manrope', 'system-ui', '-apple-system', 'Segoe UI', 'sans-serif'],
      },
      fontSize: {
        '2xs': ['0.6875rem', { lineHeight: '1.1' }],
        'display-sm': ['clamp(1.75rem, 4.2vw, 2.5rem)', { lineHeight: '1.08', letterSpacing: '-0.015em' }],
        'display-md': ['clamp(2.25rem, 5.4vw, 3.5rem)', { lineHeight: '1.04', letterSpacing: '-0.02em' }],
        'display-lg': ['clamp(2.75rem, 7vw, 4.75rem)', { lineHeight: '1', letterSpacing: '-0.025em' }],
        'display-xl': ['clamp(3.25rem, 8.5vw, 6rem)', { lineHeight: '0.96', letterSpacing: '-0.03em' }],
      },
      letterSpacing: {
        eyebrow: '0.16em',
        wider2: '0.1em',
      },
      spacing: {
        section: '5.5rem',
        'section-lg': '8rem',
      },
      maxWidth: {
        prose: '68ch',
        editorial: '82ch',
      },
      aspectRatio: {
        editorial: '4 / 5',
        portrait: '3 / 4',
        wide: '16 / 9',
        banner: '21 / 9',
      },
      boxShadow: {
        /* Deliberately restrained: no floating-card look */
        hairline: '0 0 0 1px hsl(var(--border))',
        lift: '0 1px 2px hsl(var(--ink) / 0.06)',
        drawer: '-1px 0 0 hsl(var(--border))',
      },
      transitionTimingFunction: {
        editorial: 'cubic-bezier(0.22, 0.61, 0.36, 1)',
      },
      keyframes: {
        'accordion-down': {
          from: { height: '0' },
          to: { height: 'var(--radix-accordion-content-height)' },
        },
        'accordion-up': {
          from: { height: 'var(--radix-accordion-content-height)' },
          to: { height: '0' },
        },
        'fade-in': {
          from: { opacity: '0' },
          to: { opacity: '1' },
        },
        marquee: {
          from: { transform: 'translateX(0)' },
          to: { transform: 'translateX(calc(-100% - var(--gap)))' },
        },
        'marquee-vertical': {
          from: { transform: 'translateY(0)' },
          to: { transform: 'translateY(calc(-100% - var(--gap)))' },
        },
        'shimmer-slide': {
          to: { transform: 'translate(calc(100cqw - 100%), 0)' },
        },
        'spin-around': {
          '0%': { transform: 'translateZ(0) rotate(0)' },
          '15%, 35%': { transform: 'translateZ(0) rotate(90deg)' },
          '65%, 85%': { transform: 'translateZ(0) rotate(270deg)' },
          '100%': { transform: 'translateZ(0) rotate(360deg)' },
        },
      },
      animation: {
        'accordion-down': 'accordion-down 0.2s ease-out',
        'accordion-up': 'accordion-up 0.2s ease-out',
        'fade-in': 'fade-in 0.3s ease-out both',
        marquee: 'marquee var(--duration) linear infinite',
        'marquee-vertical': 'marquee-vertical var(--duration) linear infinite',
        'shimmer-slide': 'shimmer-slide var(--speed) ease-in-out infinite alternate',
        'spin-around': 'spin-around calc(var(--speed) * 2) infinite linear',
      },
    },
  },
  plugins: [
    animate,
    plugin(({ addVariant }) => {
      /* Hover effects only where there is a real pointer. On touch devices a
         stuck hover state is worse than no effect at all. */
      addVariant('can-hover', '@media (hover: hover) and (pointer: fine)');
    }),
  ],
} satisfies Config;
