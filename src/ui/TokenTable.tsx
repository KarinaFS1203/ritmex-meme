import React from 'react';
import { Text, Box } from 'ink';
import type { TokenData } from '../types';
import { 
  formatNumber, 
  formatPrice, 
  formatPercentage, 
  formatProgress, 
  formatRelativeTime 
} from '../utils/formatter';

interface TokenTableProps {
  tokens: TokenData[];
}

const COLS = [
  { key: 'name', width: 18, align: 'left' as const },
  { key: 'symbol', width: 8, align: 'left' as const },
  { key: 'price', width: 12, align: 'right' as const },
  { key: 'mcap', width: 12, align: 'right' as const },
  { key: 'vol', width: 12, align: 'right' as const },
  { key: 'progress', width: 10, align: 'right' as const },
  { key: 'change', width: 10, align: 'right' as const },
  { key: 'created', width: 15, align: 'left' as const },
  { key: 'status', width: 8, align: 'left' as const }
];

const SEP = ' | ';
const ROW_WIDTH = COLS.map(c => c.width).reduce((a, b) => a + b, 0) + SEP.length * (COLS.length - 1);

// Zero-width & combining ranges
function isZeroWidth(cp: number): boolean {
  // Variation selectors
  if (cp >= 0xFE00 && cp <= 0xFE0F) return true;
  // Zero width joiner / non-joiner
  if (cp === 0x200D || cp === 0x200C) return true;
  // Combining Diacritical Marks blocks
  if ((cp >= 0x0300 && cp <= 0x036F) ||
      (cp >= 0x1AB0 && cp <= 0x1AFF) ||
      (cp >= 0x1DC0 && cp <= 0x1DFF) ||
      (cp >= 0x20D0 && cp <= 0x20FF) ||
      (cp >= 0xFE20 && cp <= 0xFE2F)) return true;
  return false;
}

// Heuristic: detect fullwidth code points (subset of Unicode ranges)
function isFullwidthCodePoint(codePoint: number): boolean {
  if (codePoint >= 0x1100 && (
    codePoint <= 0x115F || // Hangul Jamo
    codePoint === 0x2329 ||
    codePoint === 0x232A ||
    (0x2E80 <= codePoint && codePoint <= 0xA4CF && codePoint !== 0x303F) || // CJK Radicals, etc.
    (0xAC00 <= codePoint && codePoint <= 0xD7A3) || // Hangul Syllables
    (0xF900 <= codePoint && codePoint <= 0xFAFF) || // CJK Compatibility Ideographs
    (0xFE10 <= codePoint && codePoint <= 0xFE19) ||
    (0xFE30 <= codePoint && codePoint <= 0xFE6F) ||
    (0xFF00 <= codePoint && codePoint <= 0xFF60) ||
    (0xFFE0 <= codePoint && codePoint <= 0xFFE6)
  )) return true;
  // Emoji (general range) often two columns
  if (codePoint >= 0x1F300 && codePoint <= 0x1FAFF) return true;
  return false;
}

function normalizeText(input: string): string {
  try {
    return input.normalize('NFC');
  } catch {
    return input;
  }
}

function displayWidth(input: string): number {
  let width = 0;
  for (const ch of input) {
    const cp = ch.codePointAt(0)!;
    if (isZeroWidth(cp)) continue; // skip zero-width
    width += isFullwidthCodePoint(cp) ? 2 : 1;
  }
  return width;
}

function truncateDisplay(inputRaw: string, maxWidth: number): string {
  const input = normalizeText(inputRaw);
  if (displayWidth(input) <= maxWidth) return input + ' '.repeat(maxWidth - displayWidth(input));
  const ellipsis = '...';
  const target = Math.max(0, maxWidth - displayWidth(ellipsis));
  let out = '';
  let w = 0;
  for (const ch of input) {
    const cp = ch.codePointAt(0)!;
    if (isZeroWidth(cp)) continue;
    const add = isFullwidthCodePoint(cp) ? 2 : 1;
    if (w + add > target) break;
    out += ch;
    w += add;
  }
  const result = out + ellipsis;
  // Guarantee exact width by padding (in case of off-by-one)
  const diff = maxWidth - displayWidth(result);
  return diff > 0 ? result + ' '.repeat(diff) : result;
}

function padEndDisplay(inputRaw: string, width: number): string {
  const input = normalizeText(inputRaw);
  const w = displayWidth(input);
  if (w > width) return truncateDisplay(input, width);
  if (w === width) return input;
  return input + ' '.repeat(width - w);
}

function padStartDisplay(inputRaw: string, width: number): string {
  const input = normalizeText(inputRaw);
  const w = displayWidth(input);
  if (w > width) return truncateDisplay(input, width);
  if (w === width) return input;
  return ' '.repeat(width - w) + input;
}

function formatCell(value: string, width: number, align: 'left' | 'right'): string {
  return align === 'right' ? padStartDisplay(value, width) : padEndDisplay(value, width);
}

export const TokenTable: React.FC<TokenTableProps> = ({ tokens }) => {
  if (tokens.length === 0) {
    return (
      <Box>
        <Text>No tokens found</Text>
      </Box>
    );
  }

  const c0 = COLS[0]!;
  const c1 = COLS[1]!;
  const c2 = COLS[2]!;
  const c3 = COLS[3]!;
  const c4 = COLS[4]!;
  const c5 = COLS[5]!;
  const c6 = COLS[6]!;
  const c7 = COLS[7]!;
  const c8 = COLS[8]!;

  const headerRow = [
    formatCell('名称', c0.width, 'left'),
    formatCell('符号', c1.width, 'left'),
    formatCell('价格', c2.width, 'right'),
    formatCell('市值', c3.width, 'right'),
    formatCell('成交额', c4.width, 'right'),
    formatCell('进度', c5.width, 'right'),
    formatCell('涨幅', c6.width, 'right'),
    formatCell('创建时间', c7.width, 'left'),
    formatCell('状态', c8.width, 'left')
  ].join(SEP);

  return (
    <Box flexDirection="column">
      <Text bold color="cyan">{headerRow}</Text>
      <Text color="gray">{'─'.repeat(ROW_WIDTH)}</Text>
      {tokens.map((token, index) => {
        const statusValue = token.isNew ? 'NEW' : ((token.showStatus || token.status || '').toString().toUpperCase());
        const row = [
          formatCell(token.name, c0.width, c0.align),
          formatCell(token.symbol, c1.width, c1.align),
          formatCell(formatPrice(token.tokenPrice.price), c2.width, c2.align),
          formatCell(formatNumber(token.tokenPrice.marketCap), c3.width, c3.align),
          formatCell(formatNumber(token.tokenPrice.tradingUsd), c4.width, c4.align),
          formatCell(formatProgress(token.tokenPrice.progress), c5.width, c5.align),
          formatCell(formatPercentage(token.tokenPrice.dayIncrease), c6.width, c6.align),
          formatCell(formatRelativeTime(token.createDate), c7.width, c7.align),
          formatCell(statusValue, c8.width, c8.align)
        ].join(SEP);

        return (
          <Text key={`${token.id}-${index}`} color={token.isNew ? 'green' : undefined}>
            {row}
          </Text>
        );
      })}
    </Box>
  );
};
