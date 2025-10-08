# RitMEX MEME CLI Dashboard

A command-line dashboard for monitoring four.meme tokens with real-time updates, interactive navigation, and new token detection.

## Features

- **Real-time Token Monitoring**: Auto-refreshes every second
- **Multiple Sort Modes**: Hot, TimeDesc (Latest), OrderDesc (Volume), ProgressDesc
- **Keyword Filters**: All, Chinese, BSC tokens
- **Interactive Navigation**: Arrow keys to navigate, Enter to activate
- **New Token Detection**: Automatically detects and marks new tokens
- **Relative Time Display**: Shows "X days ago" format using date-fns
- **Visual Indicators**: Green highlighting for selection, bold for active mode

## Installation

```bash
# Install dependencies
bun install

# Copy environment configuration
cp env.example .env
```

## Usage

```bash
# Run the dashboard
bun run index.ts
```

## Controls

- **← →**: Navigate between sort modes
- **↑ ↓**: Navigate between filters  
- **Enter**: Activate selected sort/filter
- **q**: Quit application

## Configuration

Edit `.env` file to customize:

```env
DEFAULT_SORT=Hot
DEFAULT_FILTER=all
REFRESH_INTERVAL=1000
PAGE_SIZE=30
```

## New Token Detection

The dashboard automatically detects new tokens and:
- Marks them with "🆕 NEW" status
- Logs detection events to console
- Provides foundation for auto-trading functionality

## Architecture

- **Modular Design**: Separated concerns across config, API, UI, and utilities
- **TypeScript**: Strict typing with proper interfaces
- **Error Handling**: Graceful failure handling
- **Performance**: Efficient data fetching and state management

## Author

X: https://x.com/discountifu  
币安钱包手续费优惠: https://web3.binance.com/referral?ref=SRI9ROW0


