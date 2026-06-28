export const fmtCurrency = (val) => {
  if (val === null || val === undefined || isNaN(Number(val))) {
    return '$0';
  }
  const num = Number(val);
  return `$${Math.max(0, Math.floor(num)).toLocaleString('en-US')}`;
};

export const fmtPercent = (val) => {
  if (val === null || val === undefined || isNaN(parseFloat(val))) {
    return '0.00%';
  }
  const num = parseFloat(val);
  return `${num.toFixed(2)}%`;
};

export const fmtNumber = (val) => {
  if (val === null || val === undefined || isNaN(Number(val))) {
    return '0';
  }
  const num = Number(val);
  return Math.max(0, Math.floor(num)).toLocaleString('en-US');
};
