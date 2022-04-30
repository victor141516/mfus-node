const spacing = Object.fromEntries(new Array(400).fill(null).map((_, i) => [(i + 1) / 2, `${(i + 1) / 8}rem`]))
const rosa = {
  50: '#F8BEE9',
  100: '#F6ABE3',
  200: '#F287D6',
  300: '#EE62C9',
  400: '#EA3DBD',
  500: '#E519B0',
  600: '#B21389',
  700: '#800E62',
  800: '#4D083B',
  900: '#1B0315',
}

const victoria = {
  50: '#C0B6DD',
  100: '#B4A8D6',
  200: '#9C8CC9',
  300: '#8571BC',
  400: '#6D55AF',
  500: '#5B4695',
  600: '#44346F',
  700: '#2C2249',
  800: '#151022',
  900: '#000000',
}

// Not needed for now
const colorsAsCssVariables = ({ addBase, theme }) => {
  function extractColorVars(colorObj, colorGroup = '') {
    return Object.keys(colorObj).reduce((vars, colorKey) => {
      const value = colorObj[colorKey]
      const newVars =
        typeof value === 'string'
          ? { [`--color${colorGroup}-${colorKey}`]: value }
          : extractColorVars(value, `-${colorKey}`)

      return { ...vars, ...newVars }
    }, {})
  }

  addBase({
    ':root': extractColorVars(theme('colors')),
  })
}

module.exports = {
  content: ['./src/**/*.{js,jsx,ts,tsx}'],
  theme: {
    extend: { spacing, colors: { rosa, victoria, primary: rosa, secondary: victoria } },
  },
  plugins: [require('@tailwindcss/forms')],
}
