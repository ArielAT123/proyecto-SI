/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        brand: {
          primary: '#D32F2F',
          primaryHover: '#B71C1C',
          primaryActive: '#8E0000',
          secondary: '#FF9800',
          accent: '#43A047',
          warning: '#F9A825',
          error: '#E53935',
          bg: '#FAFAFA',
          card: '#FFFFFF',
          navbar: '#FFFFFF',
          footer: '#202124',
          border: '#E5E5E5',
          borderCard: '#ECECEC',
          borderInput: '#D9D9D9',
        },
        brandText: {
          title: '#212121',
          subtitle: '#424242',
          body: '#616161',
          disabled: '#9E9E9E',
          onRed: '#FFFFFF',
        },
        state: {
          available: '#43A047',
          occupied: '#E53935',
          few: '#FB8C00',
          reserved: '#1565C0',
        }
      },
      fontFamily: {
        sans: ['Inter', 'sans-serif'],
        display: ['Poppins', 'sans-serif'],
      },
      boxShadow: {
        brandCard: '0 6px 20px rgba(0,0,0,0.08)',
      },
      borderRadius: {
        btn: '12px',
        card: '16px',
        input: '12px',
      }
    },
  },
  plugins: [],
}
