const colorGenerator = (num: number) => {
  const hexColors = [
    '#ef4444', // red-500
    '#3b82f6', // blue-500
    '#facc15', // yellow-500
    '#a855f7', // purple-500
    '#ec4899', // pink-500
    '#6366f1', // indigo-500
    '#14b8a6', // teal-500
    '#06b6d4', // cyan-500
    '#f59e0b', // amber-500
    '#84cc16', // lime-500
    '#f43f5e', // rose-500
    '#d946ef', // fuchsia-500
    '#8b5cf6', // violet-500
    '#f97316', // orange-500
  ];

  return hexColors[num];
};

export default colorGenerator;
