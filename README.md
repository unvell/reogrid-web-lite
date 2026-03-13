# ReoGrid Web Lite

**Canvas-based spreadsheet component for React and Vue.**
Faithfully reproduces Excel-style cell layouts, borders, and merged cells on the web.

> **Lite version** — free to use with the following limits:
> max 100 rows × 26 columns, xlsx export not available.
> → [Upgrade to ReoGrid Web Pro](https://reogrid.net/jp/prices) for full features.

---

## Features

- High-performance Canvas rendering
- React 17+ and Vue 3+ support
- Excel-compatible cell styles, borders, and merged cells
- Column / row resize, freeze panes
- xlsx import (load existing Excel files)
- TypeScript support (full type definitions included)
- Zero external runtime dependencies

## Install

```bash
npm install @reogrid/lite
# or
yarn add @reogrid/lite
```

---

## Quick Start — React

```tsx
import { Reogrid } from '@reogrid/lite/react'
import type { ReogridInstance } from '@reogrid/lite/react'

export default function App() {
  function onReady({ api }: ReogridInstance) {
    api.setCellValue('A1', 'Product')
    api.setCellValue('B1', 'Price')
    api.setCellStyle('A1', { fontBold: true, backgroundColor: '#dbeafe' })
    api.setCellStyle('B1', { fontBold: true, backgroundColor: '#dbeafe' })
    api.setCellValue('A2', 'Widget')
    api.setCellValue('B2', '9.99')
  }

  return (
    <Reogrid
      onReady={onReady}
      style={{ width: '100%', height: '400px' }}
    />
  )
}
```

## Quick Start — Vue

```vue
<script setup lang="ts">
import { Reogrid } from '@reogrid/lite/vue'
import type { ReogridInstance } from '@reogrid/lite/vue'

function onReady({ api }: ReogridInstance) {
  api.setCellValue('A1', 'Product')
  api.setCellValue('B1', 'Price')
  api.setCellStyle('A1', { fontBold: true, backgroundColor: '#dbeafe' })
  api.setCellStyle('B1', { fontBold: true, backgroundColor: '#dbeafe' })
  api.setCellValue('A2', 'Widget')
  api.setCellValue('B2', '9.99')
}
</script>

<template>
  <Reogrid @ready="onReady" style="width: 100%; height: 400px" />
</template>
```

---

## Loading an xlsx File

```tsx
// React
function onReady({ api }: ReogridInstance) {
  api.loadFromUrl('/data/report.xlsx')
}
```

```vue
<!-- Vue -->
<script setup lang="ts">
async function onReady({ api }: ReogridInstance) {
  await api.loadFromUrl('/data/report.xlsx')
}
</script>
```

---

## API Reference

### Props (React)

| Prop | Type | Description |
|---|---|---|
| `onReady` | `(instance: ReogridInstance) => void` | Called once after the grid is initialized |
| `ref` | `React.Ref<ReogridInstance>` | Exposes the grid instance after mount |
| `style` | `React.CSSProperties` | Styles applied to the host `<div>` |
| `className` | `string` | CSS class applied to the host `<div>` |
| `options` | `ReogridOptions` | Advanced options passed to `createReogrid()` |

### Props (Vue)

| Prop | Type | Description |
|---|---|---|
| `@ready` | `(instance: ReogridInstance) => void` | Emitted once after the grid is initialized |
| `style` | `StyleValue` | Styles applied to the host `<div>` |
| `class` | `string` | CSS class applied to the host `<div>` |
| `options` | `ReogridOptions` | Advanced options passed to `createReogrid()` |

### WorksheetAPI Methods

| Method | Description |
|---|---|
| `api.setCellValue(a1, value)` | Write a value to a cell (e.g. `'B3'`) |
| `api.getCellValue(a1)` | Read a cell's value |
| `api.setCellStyle(a1, style)` | Apply style to a cell |
| `api.setCellBorder(a1, border)` | Set border on a cell or range |
| `api.mergeCells(range)` | Merge a range (e.g. `'A1:C3'`) |
| `api.setRowHeight(row, height)` | Set height of a row (px) |
| `api.setColWidth(col, width)` | Set width of a column (px) |
| `api.loadFromUrl(url)` | Load an xlsx file from a URL |
| `api.loadFromFile(file)` | Load an xlsx `File` object |
| `api.onSelectionChange(fn)` | Subscribe to selection changes |
| `api.onCellValueChange(fn)` | Subscribe to cell value changes |

---

## Lite Version Limits

| Feature | Lite | Pro |
|---|---|---|
| Max rows | 100 | Unlimited |
| Max columns | 26 (A–Z) | Unlimited |
| xlsx import | ✓ | ✓ |
| xlsx export | — | ✓ |
| Commercial use | ✓ | ✓ |
| Priority support | — | ✓ |

→ [View pricing and upgrade to Pro](https://reogrid.net/jp/prices)

---

## Examples

See the [`examples/`](./examples) directory for ready-to-run samples:

| Example | React | Vue | Description |
|---|---|---|---|
| Basic product list | [`examples/react/App.tsx`](./examples/react/App.tsx) | [`examples/vue/App.vue`](./examples/vue/App.vue) | Simple product table with headers and data rows |
| **Invoice** | [`examples/react/invoice/App.tsx`](./examples/react/invoice/App.tsx) | [`examples/vue/invoice/App.vue`](./examples/vue/invoice/App.vue) | Japanese business invoice with merged cells, borders, and styled subtotals |

---

## Links

- [Official site (JP)](https://reogrid.net/jp)
- [Official site (EN)](https://reogrid.net)
- [Pricing / Pro upgrade](https://reogrid.net/jp/prices)
- [UNVELL Inc.](https://unvell.com)

---

## License

MIT — free for personal and commercial use.
See [LICENSE](./LICENSE) for details.

---

---

# ReoGrid Web Lite（日本語）

**React・Vue向けCanvasベーススプレッドシートコンポーネント。**
Excelのセルスタイル・罫線・セル結合をWebで忠実に再現します。

> **Lite版** — 無償でご利用いただけます（最大100行×26列、xlsx出力なし）。
> → フル機能は [ReoGrid Web Pro](https://reogrid.net/jp/prices) をご検討ください。

---

## 特徴

- Canvasによる高速描画
- React 17+ / Vue 3+ 対応
- Excelと互換性のあるセルスタイル・罫線・セル結合
- 列幅・行高さのリサイズ、列・行の固定
- xlsxインポート（既存のExcelファイルを読み込み可能）
- TypeScript対応（型定義付き）
- 外部ランタイム依存なし

## インストール

```bash
npm install @reogrid/lite
# または
yarn add @reogrid/lite
```

---

## クイックスタート — React

```tsx
import { Reogrid } from '@reogrid/lite/react'
import type { ReogridInstance } from '@reogrid/lite/react'

export default function App() {
  function onReady({ api }: ReogridInstance) {
    api.setCellValue('A1', '商品名')
    api.setCellValue('B1', '価格')
    api.setCellStyle('A1', { fontBold: true, backgroundColor: '#dbeafe' })
    api.setCellStyle('B1', { fontBold: true, backgroundColor: '#dbeafe' })
    api.setCellValue('A2', 'ウィジェット')
    api.setCellValue('B2', '1,000')
  }

  return (
    <Reogrid
      onReady={onReady}
      style={{ width: '100%', height: '400px' }}
    />
  )
}
```

## クイックスタート — Vue

```vue
<script setup lang="ts">
import { Reogrid } from '@reogrid/lite/vue'
import type { ReogridInstance } from '@reogrid/lite/vue'

function onReady({ api }: ReogridInstance) {
  api.setCellValue('A1', '商品名')
  api.setCellValue('B1', '価格')
  api.setCellStyle('A1', { fontBold: true, backgroundColor: '#dbeafe' })
  api.setCellStyle('B1', { fontBold: true, backgroundColor: '#dbeafe' })
  api.setCellValue('A2', 'ウィジェット')
  api.setCellValue('B2', '1,000')
}
</script>

<template>
  <Reogrid @ready="onReady" style="width: 100%; height: 400px" />
</template>
```

---

## Lite版の制限

| 機能 | Lite | Pro |
|---|---|---|
| 最大行数 | 100行 | 無制限 |
| 最大列数 | 26列（A〜Z） | 無制限 |
| xlsxインポート | ✓ | ✓ |
| xlsxエクスポート | — | ✓ |
| 商用利用 | ✓ | ✓ |
| 優先サポート | — | ✓ |

→ [価格・Pro版へのアップグレード](https://reogrid.net/jp/prices)

---

## サンプル一覧

| サンプル | React | Vue | 説明 |
|---|---|---|---|
| 商品一覧（基本） | [`examples/react/App.tsx`](./examples/react/App.tsx) | [`examples/vue/App.vue`](./examples/vue/App.vue) | ヘッダーとデータ行のシンプルな商品テーブル |
| **請求書** | [`examples/react/invoice/App.tsx`](./examples/react/invoice/App.tsx) | [`examples/vue/invoice/App.vue`](./examples/vue/invoice/App.vue) | セル結合・罫線・小計行を使った日本式請求書帳票 |

## リンク

- [公式サイト（日本語）](https://reogrid.net/jp)
- [価格・購入](https://reogrid.net/jp/prices)
- [UNVELL株式会社](https://unvell.com)
