/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ['./src/**/*.{js,jsx,ts,tsx}'],
  theme: {
    extend: {
      colors:{
        'btn_red':'#e60022', 
        'btn_gray':'#e2e2e2',
        'btn_h_red':'#b60000',
        'btn_h_gray':'#e9e9e9', 
        'pinit_yellow':'#fffd92',
        'pinit_mint':'#d9fff6',
        'pinit_pink':'#ffe2eb',
        't2_red':'#c31852',
        't3_green':'#016a6c',
      },
     
    },
  },
  plugins: [],
};
