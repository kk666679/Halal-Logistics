/** @type {import('tailwindcss').Config} */
export default {
  darkMode: ["class"],
  content: [
    "./pages/**/*.{ts,tsx}",
    "./components/**/*.{ts,tsx}",
    "./app/**/*.{ts,tsx}",
    "./src/**/*.{ts,tsx}",
    "*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    container: {
      center: true,
      padding: "2rem",
      screens: {
        "2xl": "1400px",
      },
    },
    extend: {
      fontFamily: {
        sans: ["var(--font-sans)"],
        heading: ["var(--font-heading)"],
      },
      colors: {
        border: "hsl(var(--border))",
        input: "hsl(var(--input))",
        ring: "hsl(var(--ring))",
        background: "hsl(var(--background))",
        foreground: "hsl(var(--foreground))",
        primary: {
          DEFAULT: "hsl(var(--primary))",
          foreground: "hsl(var(--primary-foreground))",
        },
        secondary: {
          DEFAULT: "hsl(var(--secondary))",
          foreground: "hsl(var(--secondary-foreground))",
        },
        destructive: {
          DEFAULT: "hsl(var(--destructive))",
          foreground: "hsl(var(--destructive-foreground))",
        },
        muted: {
          DEFAULT: "hsl(var(--muted))",
          foreground: "hsl(var(--muted-foreground))",
        },
        accent: {
          DEFAULT: "hsl(var(--accent))",
          foreground: "hsl(var(--accent-foreground))",
        },
        popover: {
          DEFAULT: "hsl(var(--popover))",
          foreground: "hsl(var(--popover-foreground))",
        },
        card: {
        // Add explicit color definitions for light mode
        "background-light": "hsl(0 0% 100%)",
        "foreground-light": "hsl(220 13% 26%)",
        "card-light": "hsl(48 100% 96%)",
        "card-foreground-light": "hsl(220 13% 26%)",
        "popover-light": "hsl(0 0% 100%)",
        "popover-foreground-light": "hsl(220 13% 26%)",
        "primary-light": "hsl(32 95% 44%)",
        "primary-foreground-light": "hsl(0 0% 100%)",
        "secondary-light": "hsl(244 58% 67%)",
        "secondary-foreground-light": "hsl(0 0% 100%)",
        "muted-light": "hsl(48 100% 96%)",
        "muted-foreground-light": "hsl(220 13% 26%)",
        "accent-light": "hsl(244 58% 67%)",
        "accent-foreground-light": "hsl(0 0% 100%)",
        "destructive-light": "hsl(0 72% 51%)",
        "destructive-foreground-light": "hsl(0 0% 100%)",
        "border-light": "hsl(220 13% 91%)",
        "input-light": "hsl(220 13% 97%)",
        "ring-light": "hsl(32 95% 44%)",
        // Add explicit color definitions for dark mode
        "background-dark": "hsl(220 13% 9%)",
        "foreground-dark": "hsl(0 0% 95%)",
        "card-dark": "hsl(220 13% 12%)",
        "card-foreground-dark": "hsl(0 0% 95%)",
        "popover-dark": "hsl(220 13% 9%)",
        "popover-foreground-dark": "hsl(0 0% 95%)",
        "primary-dark": "hsl(32 95% 44%)",
        "primary-foreground-dark": "hsl(0 0% 100%)",
        "secondary-dark": "hsl(244 58% 67%)",
        "secondary-foreground-dark": "hsl(0 0% 100%)",
        "muted-dark": "hsl(220 13% 15%)",
        "muted-foreground-dark": "hsl(220 13% 65%)",
        "accent-dark": "hsl(244 58% 67%)",
        "accent-foreground-dark": "hsl(0 0% 100%)",
        "destructive-dark": "hsl(0 72% 51%)",
        "destructive-foreground-dark": "hsl(0 0% 100%)",
        "border-dark": "hsl(220 13% 18%)",
        "input-dark": "hsl(220 13% 18%)",
        "ring-dark": "hsl(32 95% 44%)",
          DEFAULT: "hsl(var(--card))",
          foreground: "hsl(var(--card-foreground))",
        },
      },
      borderRadius: {
        lg: "var(--radius)",
        md: "calc(var(--radius) - 2px)",
        sm: "calc(var(--radius) - 4px)",
      },
      keyframes: {
        "accordion-down": {
          from: { height: "0" },
          to: { height: "var(--radix-accordion-content-height)" },
        },
        "accordion-up": {
          from: { height: "var(--radix-accordion-content-height)" },
          to: { height: "0" },
        },
      },
      animation: {
        "accordion-down": "accordion-down 0.2s ease-out",
        "accordion-up": "accordion-up 0.2s ease-out",
      },
    },
  },
}
