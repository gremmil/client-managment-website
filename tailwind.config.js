/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/**/*.{html,ts}",
  ],
  theme: {
    extend: {
      colors: {
        't-bg': 'var(--color-bg)',
        't-surface': 'var(--color-surface)',
        't-surface-alt': 'var(--color-surface-alt)',
        't-border': 'var(--color-border)',
        't-border-light': 'var(--color-border-light)',
        't-text': 'var(--color-text)',
        't-text-secondary': 'var(--color-text-secondary)',
        't-text-muted': 'var(--color-text-muted)',
        't-primary': 'var(--color-primary)',
        't-primary-hover': 'var(--color-primary-hover)',
        't-primary-light': 'var(--color-primary-light)',
        't-primary-text': 'var(--color-primary-text)',
        't-success': 'var(--color-success)',
        't-success-light': 'var(--color-success-light)',
        't-danger': 'var(--color-danger)',
        't-danger-light': 'var(--color-danger-light)',
        't-warning': 'var(--color-warning)',
        't-warning-light': 'var(--color-warning-light)',
        't-input-bg': 'var(--color-input-bg)',
        't-input-border': 'var(--color-input-border)',
        't-overlay': 'var(--color-overlay)',
      },
    },
  },
  plugins: [],
}
