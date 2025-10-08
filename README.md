# RitMEX MEME 命令行看板

X: https://x.com/discountifu  
币安钱包手续费优惠: https://web3.binance.com/referral?ref=SRI9ROW0

一个用于监控 four.meme 代币的命令行仪表盘，支持实时更新、交互导航与新代币检测。

## 功能特性

- **实时监控**：每秒自动刷新数据
- **多种排序模式**：Hot、TimeDesc（最新）、OrderDesc（成交量）、ProgressDesc
- **关键词过滤**：全部、中文、BSC 代币
- **交互式操作**：方向键导航，Enter 确认
- **新代币检测**：自动识别并标注“🆕 NEW”
- **相对时间显示**：使用 date-fns 显示“X 天前”等格式
- **视觉提示**：当前选中行高亮绿色，激活模式加粗

## 安装

```bash
# 安装依赖
bun install

# 复制环境配置
cp env.example .env
```

## 使用方式

```bash
# 运行仪表盘
bun start
```

## 键位操作

- **← →**：切换排序模式
- **↑ ↓**：切换过滤器
- **Enter**：应用当前选项
- **q**：退出程序

## 配置项

编辑 `.env` 可自定义默认行为：

```env
DEFAULT_SORT=Hot
DEFAULT_FILTER=all
REFRESH_INTERVAL=2000
PAGE_SIZE=30
```

## 新代币监测

程序会自动检测新代币，并：
- 标注“🆕 NEW”状态
- 在控制台记录检测事件
- 为后续自动交易功能提供基础

## 架构说明

- **模块化设计**：将配置、API、UI、工具函数等解耦
- **TypeScript**：严格类型与完善接口定义
- **错误处理**：健壮的异常与失败兜底
- **性能优化**：高效的数据获取与状态管理