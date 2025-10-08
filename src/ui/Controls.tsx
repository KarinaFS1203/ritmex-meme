import React from 'react';
import { Text } from 'ink';

interface ControlsProps {
  sortMode: string;
  filterMode: string;
  selectedSort: string;
  selectedFilter: string;
  onSortSelect: (mode: string) => void;
  onFilterSelect: (mode: string) => void;
  onSortActivate: () => void;
  onFilterActivate: () => void;
}

export const Controls: React.FC<ControlsProps> = ({
  sortMode,
  filterMode,
  selectedSort,
  selectedFilter,
  onSortSelect,
  onFilterSelect,
  onSortActivate,
  onFilterActivate
}) => {
  const sortModes = ['Hot', 'TimeDesc', 'OrderDesc', 'ProgressDesc'];
  const filterModes = ['all', 'chinese', 'bsc'];

  const getSortStyle = (mode: string) => {
    const isSelected = selectedSort === mode;
    const isActive = sortMode === mode;
    
    if (isSelected && isActive) {
      return { color: 'green', bold: true };
    } else if (isSelected) {
      return { color: 'green' };
    } else if (isActive) {
      return { bold: true };
    }
    return {};
  };

  const getFilterStyle = (mode: string) => {
    const isSelected = selectedFilter === mode;
    const isActive = filterMode === mode;
    
    if (isSelected && isActive) {
      return { color: 'green', bold: true };
    } else if (isSelected) {
      return { color: 'green' };
    } else if (isActive) {
      return { bold: true };
    }
    return {};
  };

  return (
    <Text>
      <Text bold>排序： </Text>
      {sortModes.map((mode, index) => (
        <React.Fragment key={mode}>
          <Text 
            {...getSortStyle(mode)}
          >
            {mode === 'Hot' ? '热门' : mode === 'TimeDesc' ? '最新' : mode === 'OrderDesc' ? '订单数' : mode === 'ProgressDesc' ? '募资进度' : mode}
          </Text>
          {index < sortModes.length - 1 && <Text> | </Text>}
        </React.Fragment>
      ))}
      {'\n'}
      <Text bold>筛选： </Text>
      {filterModes.map((mode, index) => (
        <React.Fragment key={mode}>
          <Text 
            {...getFilterStyle(mode)}
          >
            {mode === 'all' ? '全部' : mode === 'chinese' ? '中文' : mode === 'bsc' ? '币安链(BSC)' : mode.toUpperCase()}
          </Text>
          {index < filterModes.length - 1 && <Text> | </Text>}
        </React.Fragment>
      ))}
      {'\n'}
      <Text color="gray">← → 切换，回车确认，q 退出</Text>
      {'\n'}
    </Text>
  );
};
