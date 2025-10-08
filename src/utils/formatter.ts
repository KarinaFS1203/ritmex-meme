import { formatDistance } from 'date-fns';

export function formatNumber(value: string | number): string {
  const num = typeof value === 'string' ? parseFloat(value) : value;
  
  if (isNaN(num)) return '0';
  
  if (num >= 1e9) {
    return (num / 1e9).toFixed(2) + 'B';
  } else if (num >= 1e6) {
    return (num / 1e6).toFixed(2) + 'M';
  } else if (num >= 1e3) {
    return (num / 1e3).toFixed(2) + 'K';
  } else if (num < 0.01 && num > 0) {
    // Delegate tiny formatting to price formatter logic
    return formatPrice(num.toString());
  } else {
    return num.toFixed(2);
  }
}

function toPlainString(input: string | number): string {
  const s = String(input).trim();
  if (!/e/i.test(s)) return s;

  const lower = s.toLowerCase();
  const parts = lower.split('e');
  const mantissaRaw = parts[0] ?? '0';
  const expRaw = parts[1] ?? '0';
  const exp = parseInt(expRaw, 10) || 0;

  const sign = mantissaRaw.startsWith('-') ? '-' : '';
  const mantissa = (sign ? mantissaRaw.slice(1) : mantissaRaw) ?? '0';
  const dotIdx = mantissa.indexOf('.');
  const digits = mantissa.replace('.', '');
  const decPos = dotIdx === -1 ? digits.length : dotIdx;
  const newIndex = decPos + exp;

  if (newIndex <= 0) {
    const zeros = -newIndex;
    return sign + '0.' + '0'.repeat(zeros) + digits;
  }
  if (newIndex >= digits.length) {
    return sign + digits + '0'.repeat(newIndex - digits.length);
  }
  return sign + digits.slice(0, newIndex) + '.' + digits.slice(newIndex);
}

export function formatPrice(value: string | number): string {
  const sPlain = toPlainString(value);
  const num = Number(sPlain);
  if (!isFinite(num) || isNaN(num)) return '0';
  if (num === 0) return '0';

  // For larger prices, use conventional fixed decimals
  if (num >= 1) return num.toFixed(4);
  if (num >= 0.01) return num.toFixed(6);

  // Tiny decimals: render as 0.0{N}#### (N = number of leading zeros after decimal)
  // Normalize string
  let str = sPlain;
  if (!str.includes('.')) str = num < 1 ? '0.' + str : str + '.0';

  const match = /^0\.(0+)(\d+)$/.exec(str);
  if (!match) {
    // Fallback if string isn't in expected tiny format
    return num.toPrecision(6).replace(/e[-+]?\d+/i, (m) => toPlainString(num.toPrecision(18)).slice(0, 12));
  }

  const zeros = (match[1] ?? '').length;
  const digits = match[2] ?? '';
  // Take first 4 significant digits after zeros (configurable)
  const sigLen = 4;
  const rest = digits.slice(0, sigLen).padEnd(sigLen, '0');
  return `0.0{${zeros}}${rest}`;
}

export function formatPercentage(value: string | number): string {
  const num = typeof value === 'string' ? parseFloat(value) : value;
  if (isNaN(num)) return '0%';
  
  const sign = num >= 0 ? '+' : '';
  return `${sign}${num.toFixed(2)}%`;
}

export function formatProgress(value: string | number): string {
  const num = typeof value === 'string' ? parseFloat(value) : value;
  if (isNaN(num)) return '0%';
  
  return `${(num * 100).toFixed(1)}%`;
}

export function formatRelativeTime(timestamp: string | number): string {
  const date = new Date(typeof timestamp === 'string' ? parseInt(timestamp) : timestamp);
  const now = new Date();
  
  return formatDistance(date, now, { addSuffix: true });
}

export function formatTimestamp(timestamp: number): string {
  const date = new Date(timestamp);
  return date.toLocaleTimeString('en-US', { 
    hour12: false,
    hour: '2-digit',
    minute: '2-digit',
    second: '2-digit'
  });
}
