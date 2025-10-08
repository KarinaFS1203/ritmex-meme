import React from 'react';
import { Text } from 'ink';

interface HeaderProps {
  lastUpdate?: number;
}

export const Header: React.FC<HeaderProps> = ({ lastUpdate }) => {
  const formatTime = (timestamp?: number): string => {
    if (!timestamp) return '无';
    return new Date(timestamp).toLocaleTimeString('zh-CN', { 
      hour12: false,
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit'
    });
  };

  return (
    <Text>
      <Text bold color="cyan">RitMEX MEME</Text>
      {'\n'}
      <Text color="gray">作者 X： </Text>
      <Text color="blue">https://x.com/discountifu</Text>
      {' | '}
      <Text color="gray">币安钱包手续费优惠： </Text>
      <Text color="blue">https://web3.binance.com/referral?ref=SRI9ROW0</Text>
      {'\n'}
      <Text color="yellow">最近更新：{formatTime(lastUpdate)}</Text>
      {'\n'}
    </Text>
  );
};
