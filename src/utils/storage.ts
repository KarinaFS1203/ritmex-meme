const STORAGE_PATH = './.seen_tokens.json';
const LOG_PATH = './.new_token_events.json';
const DEFAULT_MAX_LOG_ITEMS = 500;

export type SeenStore = {
  addresses: Record<string, true>;
};

export type EventLogStore<T> = {
  events: T[];
};

async function readFileText(path: string): Promise<string | null> {
  try {
    const file = Bun.file(path);
    if (!(await file.exists())) return null;
    return await file.text();
  } catch {
    return null;
  }
}

export async function loadSeenAddresses(): Promise<Set<string>> {
  const text = await readFileText(STORAGE_PATH);
  if (!text) return new Set();
  try {
    const data = JSON.parse(text) as SeenStore;
    return new Set(Object.keys(data.addresses || {}));
  } catch {
    return new Set();
  }
}

export async function saveSeenAddresses(addresses: Set<string>): Promise<void> {
  const record: Record<string, true> = {};
  for (const addr of addresses) record[addr.toLowerCase()] = true;
  const body: SeenStore = { addresses: record };
  await Bun.write(STORAGE_PATH, JSON.stringify(body, null, 2));
}

// Persistent log for new token events
import type { NewTokenEvent } from '../types';

export async function loadNewTokenLog(): Promise<NewTokenEvent[]> {
  const text = await readFileText(LOG_PATH);
  if (!text) return [];
  try {
    const data = JSON.parse(text) as EventLogStore<NewTokenEvent>;
    return Array.isArray(data.events) ? data.events : [];
  } catch {
    return [];
  }
}

export async function saveNewTokenLog(events: NewTokenEvent[]): Promise<void> {
  const body: EventLogStore<NewTokenEvent> = { events };
  await Bun.write(LOG_PATH, JSON.stringify(body, null, 2));
}

export async function appendNewTokenEvents(
  newEvents: NewTokenEvent[],
  maxItems: number = DEFAULT_MAX_LOG_ITEMS
): Promise<NewTokenEvent[]> {
  if (!newEvents || newEvents.length === 0) return loadNewTokenLog();
  const existing = await loadNewTokenLog();
  const merged = existing.concat(newEvents);
  const trimmed = merged.length > maxItems ? merged.slice(merged.length - maxItems) : merged;
  await saveNewTokenLog(trimmed);
  return trimmed;
}

export async function clearNewTokenLog(): Promise<void> {
  await saveNewTokenLog([]);
}
