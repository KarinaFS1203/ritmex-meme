import React, { useState, useEffect, useCallback } from 'react';
import { Box, Text, useInput } from 'ink';
import { Header } from './Header';
import { Controls } from './Controls';
import { TokenTable } from './TokenTable';
import { FourMemeAPI } from '../core/api/fourmeme';
import type { TokenData, NewTokenEvent } from '../types';
import { appConfig } from '../config/config';
import { loadSeenAddresses, saveSeenAddresses, loadNewTokenLog, appendNewTokenEvents, clearNewTokenLog } from '../utils/storage';
import { formatTimestamp } from '../utils/formatter';

export const App: React.FC = () => {
  // State management
  const [tokens, setTokens] = useState<TokenData[]>([]);
  const [sortMode, setSortMode] = useState<string>(appConfig.defaultSort);
  const [filterMode, setFilterMode] = useState<string>(appConfig.defaultFilter);
  const [selectedSort, setSelectedSort] = useState<string>(appConfig.defaultSort);
  const [selectedFilter, setSelectedFilter] = useState<string>(appConfig.defaultFilter);
  const [lastUpdate, setLastUpdate] = useState<number>(Date.now());
  const [isLoading, setIsLoading] = useState(false);
  const [hasLoadedOnce, setHasLoadedOnce] = useState(false);
  const [seen, setSeen] = useState<Set<string>>(new Set());
  const [newEvents, setNewEvents] = useState<NewTokenEvent[]>([]);
  const [eventLog, setEventLog] = useState<NewTokenEvent[]>([]);

  // API instance
  const api = new FourMemeAPI();

  // Load seen addresses once
  useEffect(() => {
    (async () => {
      // Clear previous run's new token log on startup
      await clearNewTokenLog();

      const loaded = await loadSeenAddresses();
      setSeen(loaded);
      const existingLog = await loadNewTokenLog();
      setEventLog(existingLog);
    })();
  }, []);

  // Fetch tokens function
  const fetchTokens = useCallback(async () => {
    try {
      setIsLoading(true);
      const freshAll = await api.fetchTokensByFilter(sortMode, filterMode, appConfig.pageSize);

      // Fixed rule: Only keep BSC network tokens for display and detection
      const fresh = freshAll.filter(t => (t.networkCode || '').toUpperCase() === 'BSC');

      // Lowercase seen set
      const lowerSeen = new Set(Array.from(seen).map(a => a.toLowerCase()));
      const updatedSeen = new Set(lowerSeen);

      // Special handling: initial load should NOT mark tokens as new
      if (!hasLoadedOnce) {
        const markedInitial = fresh.map(t => {
          const addr = (t.address || '').toLowerCase();
          if (addr) updatedSeen.add(addr);
          return { ...t, isNew: false } as TokenData;
        });

        // Persist baseline seen addresses and update state
        await saveSeenAddresses(updatedSeen);
        setSeen(updatedSeen);

        setTokens(markedInitial);
        setNewEvents([]);
        setLastUpdate(Date.now());
        setHasLoadedOnce(true);
        return;
      }

      // Regular detection after initial load
      const newlyFound: NewTokenEvent[] = [];
      const marked = fresh.map(t => {
        const addr = (t.address || '').toLowerCase();
        const isNew = addr && !lowerSeen.has(addr);
        if (isNew) {
          newlyFound.push({ token: t, timestamp: Date.now() });
          updatedSeen.add(addr);
        }
        return { ...t, isNew } as TokenData;
      });

      // Persist seen addresses and append to persistent event log if any new were found
      if (newlyFound.length > 0) {
        setNewEvents(newlyFound);
        await saveSeenAddresses(updatedSeen);
        setSeen(updatedSeen);
        const updatedLog = await appendNewTokenEvents(newlyFound);
        setEventLog(updatedLog);
      } else {
        setNewEvents([]);
      }

      setTokens(marked);
      setLastUpdate(Date.now());
      setHasLoadedOnce(true);
    } catch (error) {
      // Keep previous screen stable on error
    } finally {
      setIsLoading(false);
    }
  }, [sortMode, filterMode, seen]);

  // Keyboard navigation
  const handleKeyPress = useCallback((input: string, key: any) => {
    if (key.ctrl && input === 'c') {
      process.exit(0);
    }

    if (key.leftArrow) {
      const sortModes = ['Hot', 'TimeDesc', 'OrderDesc', 'ProgressDesc'];
      const currentIndex = sortModes.indexOf(selectedSort);
      const newIndex = currentIndex > 0 ? currentIndex - 1 : sortModes.length - 1;
      setSelectedSort(sortModes[newIndex]!);
      return;
    }

    if (key.rightArrow) {
      const sortModes = ['Hot', 'TimeDesc', 'OrderDesc', 'ProgressDesc'];
      const currentIndex = sortModes.indexOf(selectedSort);
      const newIndex = currentIndex < sortModes.length - 1 ? currentIndex + 1 : 0;
      setSelectedSort(sortModes[newIndex]!);
      return;
    }

    if (key.upArrow) {
      const filterModes = ['all', 'chinese', 'bsc'];
      const currentIndex = filterModes.indexOf(selectedFilter);
      const newIndex = currentIndex > 0 ? currentIndex - 1 : filterModes.length - 1;
      setSelectedFilter(filterModes[newIndex]!);
      return;
    }

    if (key.downArrow) {
      const filterModes = ['all', 'chinese', 'bsc'];
      const currentIndex = filterModes.indexOf(selectedFilter);
      const newIndex = currentIndex < filterModes.length - 1 ? currentIndex + 1 : 0;
      setSelectedFilter(filterModes[newIndex]!);
      return;
    }

    if (key.return) {
      if (selectedSort !== sortMode) {
        setSortMode(selectedSort);
      }
      if (selectedFilter !== filterMode) {
        setFilterMode(selectedFilter);
      }
      return;
    }

    if (input === 'q') {
      process.exit(0);
    }
  }, [selectedSort, selectedFilter, sortMode, filterMode]);

  // Use Ink's input handling
  useInput((input, key) => handleKeyPress(input, key));

  // Auto-refresh effect
  useEffect(() => {
    fetchTokens();
    const interval = setInterval(() => {
      fetchTokens();
    }, appConfig.refreshInterval);
    return () => clearInterval(interval);
  }, [fetchTokens]);

  const tradeUrl = (address: string) => `https://web3.binance.com/zh-CN/token/bsc/${address}?ref=SRI9ROW0`;

  return (
    <Box flexDirection="column">
      <Header lastUpdate={lastUpdate} />
      <Controls
        sortMode={sortMode}
        filterMode={filterMode}
        selectedSort={selectedSort}
        selectedFilter={selectedFilter}
        onSortSelect={setSelectedSort}
        onFilterSelect={setSelectedFilter}
        onSortActivate={() => setSortMode(selectedSort)}
        onFilterActivate={() => setFilterMode(selectedFilter)}
      />
      {!hasLoadedOnce && isLoading && <Text color="yellow">Loading...</Text>}
      <TokenTable tokens={tokens} />
      {eventLog.length > 0 && (
        <Box flexDirection="column" marginTop={1}>
          <Text bold color="green">New token log (newest first, total {eventLog.length}):</Text>
          {[...eventLog].slice().reverse().map((e, idx) => (
            <Text key={`${e.token.address}-${e.timestamp}-${idx}`} color="green">[{formatTimestamp(e.timestamp)}] {e.token.name} ({e.token.symbol}) {e.token.address} → Trade: {tradeUrl(e.token.address)}</Text>
          ))}
        </Box>
      )}
    </Box>
  );
};
