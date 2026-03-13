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
  function onReady({ worksheet }: ReogridInstance) {
    worksheet.cell('A1').setValue('Product').setStyle({ bold: true, backgroundColor: '#dbeafe' })
    worksheet.cell('B1').setValue('Price').setStyle({ bold: true, backgroundColor: '#dbeafe' })
    worksheet.cell('A2').value = 'Widget'
    worksheet.cell('B2').value = '9.99'
    worksheet.column(0).width = 120
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

function onReady({ worksheet }: ReogridInstance) {
  worksheet.cell('A1').setValue('Product').setStyle({ bold: true, backgroundColor: '#dbeafe' })
  worksheet.cell('B1').setValue('Price').setStyle({ bold: true, backgroundColor: '#dbeafe' })
  worksheet.cell('A2').value = 'Widget'
  worksheet.cell('B2').value = '9.99'
  worksheet.column(0).width = 120
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
function onReady({ worksheet }: ReogridInstance) {
  worksheet.loadFromUrl('/data/report.xlsx')
}
```

```vue
<!-- Vue -->
<script setup lang="ts">
async function onReady({ worksheet }: ReogridInstance) {
  await worksheet.loadFromUrl('/data/report.xlsx')
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

### `worksheet.cell(a1)` — CellHandle

```ts
worksheet.cell('B3').value = 'Hello'
worksheet.cell('B3').style = { bold: true, color: '#1e3a5f' }

// Fluent chaining
worksheet.cell('A1').setValue('Title').setStyle({ fontSize: 18, bold: true })
```

| Member | Type | Description |
|---|---|---|
| `value` | `string` (get/set) | Cell value |
| `style` | `Partial<CellStyle>` (get/set) | Cell style |
| `setValue(value)` | `CellHandle` | Set value, returns `this` for chaining |
| `setStyle(style)` | `CellHandle` | Set style, returns `this` for chaining |
| `getValue()` | `string` | Get value |
| `getStyle()` | `CellStyle` | Get computed style |

### `worksheet.range(a1Range)` — RangeHandle

```ts
worksheet.range('A1:E1').merge()
worksheet.range('A9:E9').setStyle({ bold: true, backgroundColor: '#1e3a5f', color: '#fff' })
worksheet.range('A1:E17').border({ style: 'solid', color: '#cbd5e1' })
worksheet.range('A1:E17').border({ style: 'solid', color: '#475569', width: 1.5 }, ['top', 'bottom'])
```

| Method | Description |
|---|---|
| `merge()` | Merge cells in range |
| `unmerge()` | Unmerge cells in range |
| `setStyle(style)` | Apply style to all cells in range |
| `setBackgroundColor(color)` | Set background color for range |
| `border(options, sides?)` | Set border; `sides` = `['top','bottom','left','right','outside','inside']` |

### `worksheet.column(index)` — ColumnHandle

```ts
worksheet.column(0).width = 120  // A column
worksheet.column(1).width = 200  // B column
```

### `worksheet.row(index)` — RowHandle

```ts
worksheet.row(0).height = 48   // row 1
worksheet.row(8).height = 24   // row 9
```

### `worksheet` direct properties

```ts
worksheet.showGridLines = false
```

### Event subscriptions

```ts
worksheet.onSelectionChange((cell) => {
  console.log(cell?.row, cell?.column)
})
worksheet.onCellValueChange(({ row, column, value }) => {
  console.log(row, column, value)
})
```

### xlsx import

```ts
await worksheet.loadFromUrl('/data/report.xlsx')
await worksheet.loadFromFile(file)  // File object from <input type="file">
```

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

Each example is a self-contained Vite project (`npm install && npm run dev`).

| Example | React | Vue | Live Demo |
|---|---|---|---|
| Basic product list | [`examples/react/`](./examples/react) | [`examples/vue/`](./examples/vue) | [React ↗](https://stackblitz.com/github/unvell/reogrid-web-lite/tree/main/examples/react) · [Vue ↗](https://stackblitz.com/github/unvell/reogrid-web-lite/tree/main/examples/vue) |
| **Invoice** (請求書) | [`examples/react/invoice/`](./examples/react/invoice) | [`examples/vue/invoice/`](./examples/vue/invoice) | [React ↗](https://stackblitz.com/github/unvell/reogrid-web-lite/tree/main/examples/react/invoice) · [Vue ↗](https://stackblitz.com/github/unvell/reogrid-web-lite/tree/main/examples/vue/invoice) |

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
  function onReady({ worksheet }: ReogridInstance) {
    worksheet.cell('A1').setValue('商品名').setStyle({ bold: true, backgroundColor: '#dbeafe' })
    worksheet.cell('B1').setValue('価格').setStyle({ bold: true, backgroundColor: '#dbeafe' })
    worksheet.cell('A2').value = 'ウィジェット'
    worksheet.cell('B2').value = '1,000'
    worksheet.column(0).width = 120
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

function onReady({ worksheet }: ReogridInstance) {
  worksheet.cell('A1').setValue('商品名').setStyle({ bold: true, backgroundColor: '#dbeafe' })
  worksheet.cell('B1').setValue('価格').setStyle({ bold: true, backgroundColor: '#dbeafe' })
  worksheet.cell('A2').value = 'ウィジェット'
  worksheet.cell('B2').value = '1,000'
  worksheet.column(0).width = 120
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

各サンプルは単体で動く Vite プロジェクトです（`npm install && npm run dev`）。

| サンプル | React | Vue | Live Demo |
|---|---|---|---|
| 商品一覧（基本） | [`examples/react/`](./examples/react) | [`examples/vue/`](./examples/vue) | [React ↗](https://stackblitz.com/github/unvell/reogrid-web-lite/tree/main/examples/react) · [Vue ↗](https://stackblitz.com/github/unvell/reogrid-web-lite/tree/main/examples/vue) |
| **請求書** | [`examples/react/invoice/`](./examples/react/invoice) | [`examples/vue/invoice/`](./examples/vue/invoice) | [React ↗](https://stackblitz.com/github/unvell/reogrid-web-lite/tree/main/examples/react/invoice) · [Vue ↗](https://stackblitz.com/github/unvell/reogrid-web-lite/tree/main/examples/vue/invoice) |

## リンク

- [公式サイト（日本語）](https://reogrid.net/jp)
- [価格・購入](https://reogrid.net/jp/prices)
- [UNVELL株式会社](https://unvell.com)
