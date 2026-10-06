# ReoGrid Web Lite

**Canvas-based spreadsheet library for the web — use it from plain JavaScript / TypeScript or any framework, with React and Vue components included.**
Opens Excel files and faithfully reproduces Excel-style cell layouts, styles, borders and merged cells in the browser.

> **Lite version** — free, commercial use included, with these limits:
> max 100 rows × 26 columns, formulas are arithmetic and cell references only, no xlsx export.
> → [Compare with ReoGrid Web Pro](https://web.reogrid.net/pricing) for the full feature set.

[Website](https://web.reogrid.net) · [Documentation](https://web.reogrid.net/docs) · [Live demos](https://web.reogrid.net/demos) · 日本語の説明は後半にあります

---

## Features

- Fast Canvas rendering
- Framework-agnostic core (`createReogrid()`), plus React 17+ and Vue 3+ components
- xlsx import — every sheet of the workbook, with a sheet tab bar
- Excel-compatible cell styles, borders, merged cells and number formats
- Multiple sheets, undo / redo, copy & paste, auto-fill, find & replace
- Zoom (Ctrl/Cmd + mouse wheel or pinch)
- Formulas with arithmetic and cell references (`=A1*B1`)
- TypeScript support (full type definitions included)
- Zero external runtime dependencies

## Install

```bash
npm install @reogrid/lite
# or
yarn add @reogrid/lite
```

---

## Quick Start — JavaScript / TypeScript

```html
<div id="grid" style="width: 100%; height: 400px"></div>
```

```ts
import { createReogrid } from '@reogrid/lite'

const grid = createReogrid('#grid')
const { worksheet } = grid   // the active sheet

worksheet.cell('A1').setValue('Product').setStyle({ bold: true, backgroundColor: '#dbeafe' })
worksheet.cell('B1').setValue('Price').setStyle({ bold: true, backgroundColor: '#dbeafe' })
worksheet.cell('A2').value = 'Widget'
worksheet.cell('B2').value = 9.99
worksheet.cell('B3').value = '=B2*3'
worksheet.column(0).width = 120
```

`createReogrid()` accepts a CSS selector or an `HTMLElement`. Call `grid.destroy()` when you remove the grid from the page.

## Quick Start — React

```tsx
import { Reogrid } from '@reogrid/lite/react'
import type { ReogridInstance } from '@reogrid/lite/react'

export default function App() {
  function onReady({ worksheet }: ReogridInstance) {
    worksheet.cell('A1').setValue('Product').setStyle({ bold: true, backgroundColor: '#dbeafe' })
    worksheet.cell('B1').setValue('Price').setStyle({ bold: true, backgroundColor: '#dbeafe' })
    worksheet.cell('A2').value = 'Widget'
    worksheet.cell('B2').value = 9.99
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
  worksheet.cell('B2').value = 9.99
  worksheet.column(0).width = 120
}
</script>

<template>
  <Reogrid @ready="onReady" style="width: 100%; height: 400px" />
</template>
```

---

## Opening an xlsx File

```ts
// From a URL — loads every sheet in the workbook
await grid.loadFromUrl('/data/report.xlsx')

// From a file input
const input = document.querySelector<HTMLInputElement>('input[type="file"]')!
input.addEventListener('change', async () => {
  const file = input.files?.[0]
  if (file) await grid.loadFromFile(file)
})
```

In React and Vue, `grid` is the instance passed to `onReady` / `@ready`. Load through the grid (`grid.loadFromUrl`), not `grid.worksheet` — the worksheet-level loaders read a single sheet only.

## Events

```ts
const off = grid.onSelectionChange((range) => {
  console.log(range?.row, range?.col)   // top-left of the selection, or null
})
grid.onCellValueChange(({ row, column, value }) => {
  console.log(row, column, value)
})

off()   // every subscription returns its own unsubscribe function
```

Subscribe on the grid rather than on `grid.worksheet`: grid-level events follow whichever sheet is active.

---

## API Overview

### Component props (React)

| Prop | Type | Description |
|---|---|---|
| `onReady` | `(instance: ReogridInstance) => void` | Called once after the grid is mounted |
| `onSelectionChange` | `(range: RangePosition \| null) => void` | Selection changed — `{ row, col, rows, columns }` or `null` |
| `onCellValueChange` | `({ row, column, value }) => void` | A cell's value changed |
| `onBulkCellsChange` | `(cells) => void` | Many cells changed at once (load, paste, fill) |
| `onActiveSheetChange` | `(index: number) => void` | The user switched sheets |
| `onSheetsChange` | `() => void` | A sheet was added, removed, renamed or moved |
| `onZoomChange` | `(zoom: number) => void` | The active sheet's zoom changed |
| `ref` | `React.Ref<ReogridInstance>` | Access the grid instance imperatively |
| `style` / `className` | | Applied to the host `<div>` |
| `options` | `ReogridOptions` | Advanced options passed to `createReogrid()` |

### Component events (Vue)

`@ready`, `@selection-change`, `@cell-value-change`, `@bulk-cells-change`, `@active-sheet-change`, `@sheets-change`, `@zoom-change` — same payloads as the React props above. `style`, `class` and `options` are props, and a template ref exposes `{ instance }`.

### `worksheet.cell(a1)` — CellHandle

```ts
worksheet.cell('B3').value = 'Hello'
worksheet.cell('B3').style = { bold: true, color: '#1e3a5f' }

// Fluent chaining
worksheet.cell('A1').setValue('Title').setStyle({ fontSize: 18, bold: true })
```

| Member | Type | Description |
|---|---|---|
| `value` | `string` (get) / `string \| number` (set) | Cell input — a value, or a formula such as `'=A1*2'` |
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
| `merge()` / `unmerge()` | Merge or unmerge the cells in the range |
| `setStyle(style)` | Apply a style to every cell in the range |
| `setBold()` / `setBackgroundColor(color)` | Style shortcuts |
| `border(options, sides?)` | Set borders; `sides` from `'top'`, `'bottom'`, `'left'`, `'right'`, `'outside'`, `'inside'`, `'all'` |

### Rows, columns and the sheet

```ts
worksheet.column(0).width = 120   // column A
worksheet.row(0).height = 48      // row 1
worksheet.showGridLines = false
```

See the [documentation](https://web.reogrid.net/docs) for everything else — multiple sheets, number formats, protection, JSON save / load and more.

---

## Lite vs Pro

| | Lite | Pro |
|---|---|---|
| Rows × columns | 100 × 26 (A–Z) | Unlimited |
| Formulas | Arithmetic & cell references | 109 functions (`SUM`, `VLOOKUP`, …), named ranges |
| xlsx import | ✓ | ✓ |
| xlsx export | — | ✓ |
| PDF export & printing | — | ✓ |
| Freeze panes, sort & filter, grouping | — | ✓ |
| Conditional formatting, cell types (checkbox, dropdown, progress …) | — | ✓ |
| Images, 1,000,000-row delay loading | — | ✓ |
| Commercial use | ✓ | ✓ |
| Domains | Unlimited | Up to 3 |
| License key | Not required | Required |
| Support | Community | 1 year included |

Pro-only methods exist in Lite but only print a console warning. Moving up is a change of package name — `@reogrid/lite` → `@reogrid/pro` — plus a license key.

→ [Pricing and full comparison](https://web.reogrid.net/pricing)

---

## Examples

Each example is a self-contained Vite project (`npm install && npm run dev`).

| Example | Source | Live Demo |
|---|---|---|
| Product list — React | [`examples/react/`](./examples/react) | [StackBlitz ↗](https://stackblitz.com/github/unvell/reogrid-web-lite/tree/main/examples/react) |
| Product list — Vue | [`examples/vue/`](./examples/vue) | [StackBlitz ↗](https://stackblitz.com/github/unvell/reogrid-web-lite/tree/main/examples/vue) |
| Invoice (請求書) — React | [`examples/react/invoice/`](./examples/react/invoice) | [StackBlitz ↗](https://stackblitz.com/github/unvell/reogrid-web-lite/tree/main/examples/react/invoice) |
| Invoice (請求書) — Vue | [`examples/vue/invoice/`](./examples/vue/invoice) | [StackBlitz ↗](https://stackblitz.com/github/unvell/reogrid-web-lite/tree/main/examples/vue/invoice) |
| Invoice — JavaScript | [`examples/vanilla/invoice/`](./examples/vanilla/invoice) | [StackBlitz ↗](https://stackblitz.com/github/unvell/reogrid-web-lite/tree/main/examples/vanilla/invoice) |
| Income & expenses — JavaScript | [`examples/vanilla/budget/`](./examples/vanilla/budget) | [StackBlitz ↗](https://stackblitz.com/github/unvell/reogrid-web-lite/tree/main/examples/vanilla/budget) |
| Attendance sheet — JavaScript | [`examples/vanilla/attendance/`](./examples/vanilla/attendance) | [StackBlitz ↗](https://stackblitz.com/github/unvell/reogrid-web-lite/tree/main/examples/vanilla/attendance) |
| Product list — JavaScript | [`examples/vanilla/data-table/`](./examples/vanilla/data-table) | [StackBlitz ↗](https://stackblitz.com/github/unvell/reogrid-web-lite/tree/main/examples/vanilla/data-table) |

More on the website: [live demos](https://web.reogrid.net/demos) and [recipes](https://web.reogrid.net/recipes).

---

## Links

- [Website](https://web.reogrid.net) · [日本語サイト](https://web.reogrid.net/jp)
- [Documentation](https://web.reogrid.net/docs)
- [Release notes](https://web.reogrid.net/release-notes)
- [Pricing / ReoGrid Web Pro](https://web.reogrid.net/pricing)
- [Issues](https://github.com/unvell/reogrid-web-lite/issues)
- [UNVELL Inc.](https://unvell.com)

---

## License

Free License · commercial use OK. ReoGrid Web Lite is proprietary software
© UNVELL Inc. — not open source — and free to use, including in commercial
products. See [pricing](https://web.reogrid.net/pricing) for the terms of each edition.

---

---

# ReoGrid Web Lite（日本語）

**Web 向けの Canvas ベース スプレッドシートライブラリ。素の JavaScript / TypeScript やどのフレームワークからでも使え、React・Vue 用コンポーネントも同梱しています。**
Excel ファイルを開き、Excel のセルレイアウト・書式・罫線・セル結合をブラウザで忠実に再現します。

> **Lite 版** — 無償・商用利用可。次の制限があります:
> 最大 100 行 × 26 列、数式は四則演算とセル参照のみ、xlsx 出力なし。
> → フル機能は [ReoGrid Web Pro との比較](https://web.reogrid.net/jp/pricing) をご覧ください。

[公式サイト](https://web.reogrid.net/jp) · [ドキュメント](https://web.reogrid.net/jp/docs) · [デモ](https://web.reogrid.net/jp/demos)

---

## 特徴

- Canvas による高速描画
- フレームワークに依存しないコア（`createReogrid()`）と、React 17+ / Vue 3+ 用コンポーネント
- xlsx インポート — ブック内のすべてのシートをシートタブ付きで読み込み
- Excel 互換のセル書式・罫線・セル結合・表示形式
- 複数シート、元に戻す / やり直し、コピー & ペースト、オートフィル、検索・置換
- 表示倍率（Ctrl/Cmd + ホイール、ピンチ）
- 四則演算とセル参照の数式（`=A1*B1`）
- TypeScript 対応（型定義付き）
- 外部ランタイム依存なし

## インストール

```bash
npm install @reogrid/lite
# または
yarn add @reogrid/lite
```

---

## クイックスタート — JavaScript / TypeScript

```html
<div id="grid" style="width: 100%; height: 400px"></div>
```

```ts
import { createReogrid } from '@reogrid/lite'

const grid = createReogrid('#grid')
const { worksheet } = grid   // アクティブなシート

worksheet.cell('A1').setValue('商品名').setStyle({ bold: true, backgroundColor: '#dbeafe' })
worksheet.cell('B1').setValue('価格').setStyle({ bold: true, backgroundColor: '#dbeafe' })
worksheet.cell('A2').value = 'ウィジェット'
worksheet.cell('B2').value = 1000
worksheet.cell('B3').value = '=B2*3'
worksheet.column(0).width = 120
```

`createReogrid()` には CSS セレクターか `HTMLElement` を渡します。ページから取り除くときは `grid.destroy()` を呼んでください。

## クイックスタート — React

```tsx
import { Reogrid } from '@reogrid/lite/react'
import type { ReogridInstance } from '@reogrid/lite/react'

export default function App() {
  function onReady({ worksheet }: ReogridInstance) {
    worksheet.cell('A1').setValue('商品名').setStyle({ bold: true, backgroundColor: '#dbeafe' })
    worksheet.cell('B1').setValue('価格').setStyle({ bold: true, backgroundColor: '#dbeafe' })
    worksheet.cell('A2').value = 'ウィジェット'
    worksheet.cell('B2').value = 1000
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
  worksheet.cell('B2').value = 1000
  worksheet.column(0).width = 120
}
</script>

<template>
  <Reogrid @ready="onReady" style="width: 100%; height: 400px" />
</template>
```

---

## xlsx ファイルを開く

```ts
// URL から — ブック内のすべてのシートを読み込みます
await grid.loadFromUrl('/data/report.xlsx')

// ファイル選択から
const input = document.querySelector<HTMLInputElement>('input[type="file"]')!
input.addEventListener('change', async () => {
  const file = input.files?.[0]
  if (file) await grid.loadFromFile(file)
})
```

React / Vue では `onReady` / `@ready` に渡されるインスタンスが `grid` です。読み込みは `grid.worksheet` ではなく `grid` から行ってください（ワークシート側のローダーは 1 シートだけを読み込みます）。

## イベント

```ts
const off = grid.onSelectionChange((range) => {
  console.log(range?.row, range?.col)   // 選択範囲の左上、または null
})
grid.onCellValueChange(({ row, column, value }) => {
  console.log(row, column, value)
})

off()   // 購読はそれぞれ解除用の関数を返します
```

`grid.worksheet` ではなく `grid` で購読してください。`grid` のイベントはアクティブなシートに追従します。React の props（`onSelectionChange`・`onActiveSheetChange`・`onZoomChange` など）と Vue のイベント（`@selection-change` など）も同じで、一覧は英語版の API Overview にあります。

---

## Lite 版と Pro 版

| | Lite | Pro |
|---|---|---|
| 行 × 列 | 100 × 26（A〜Z） | 無制限 |
| 数式 | 四則演算とセル参照 | 109 関数（`SUM`・`VLOOKUP` など）、名前付き範囲 |
| xlsx インポート | ✓ | ✓ |
| xlsx エクスポート | — | ✓ |
| PDF 出力・印刷 | — | ✓ |
| ウィンドウ枠の固定・並べ替えとフィルター・グループ化 | — | ✓ |
| 条件付き書式・セルタイプ（チェックボックス、ドロップダウン、プログレスなど） | — | ✓ |
| 画像、100 万行の遅延読み込み | — | ✓ |
| 商用利用 | ✓ | ✓ |
| ドメイン数 | 無制限 | 3 まで |
| ライセンスキー | 不要 | 必要 |
| サポート | コミュニティ | 1 年間付属 |

Pro 専用のメソッドは Lite にも存在しますが、コンソールに警告を出すだけです。Pro への移行は、パッケージ名を `@reogrid/lite` → `@reogrid/pro` に替えてライセンスキーを渡すだけです。

→ [価格と機能の詳細比較](https://web.reogrid.net/jp/pricing)

---

## サンプル一覧

各サンプルは単体で動く Vite プロジェクトです（`npm install && npm run dev`）。

| サンプル | ソース | Live Demo |
|---|---|---|
| 商品一覧 — React | [`examples/react/`](./examples/react) | [StackBlitz ↗](https://stackblitz.com/github/unvell/reogrid-web-lite/tree/main/examples/react) |
| 商品一覧 — Vue | [`examples/vue/`](./examples/vue) | [StackBlitz ↗](https://stackblitz.com/github/unvell/reogrid-web-lite/tree/main/examples/vue) |
| 請求書 — React | [`examples/react/invoice/`](./examples/react/invoice) | [StackBlitz ↗](https://stackblitz.com/github/unvell/reogrid-web-lite/tree/main/examples/react/invoice) |
| 請求書 — Vue | [`examples/vue/invoice/`](./examples/vue/invoice) | [StackBlitz ↗](https://stackblitz.com/github/unvell/reogrid-web-lite/tree/main/examples/vue/invoice) |
| 請求書 — JavaScript | [`examples/vanilla/invoice/`](./examples/vanilla/invoice) | [StackBlitz ↗](https://stackblitz.com/github/unvell/reogrid-web-lite/tree/main/examples/vanilla/invoice) |
| 収支管理表 — JavaScript | [`examples/vanilla/budget/`](./examples/vanilla/budget) | [StackBlitz ↗](https://stackblitz.com/github/unvell/reogrid-web-lite/tree/main/examples/vanilla/budget) |
| 勤怠管理表 — JavaScript | [`examples/vanilla/attendance/`](./examples/vanilla/attendance) | [StackBlitz ↗](https://stackblitz.com/github/unvell/reogrid-web-lite/tree/main/examples/vanilla/attendance) |
| 商品一覧 — JavaScript | [`examples/vanilla/data-table/`](./examples/vanilla/data-table) | [StackBlitz ↗](https://stackblitz.com/github/unvell/reogrid-web-lite/tree/main/examples/vanilla/data-table) |

その他のサンプルは公式サイトの [デモ](https://web.reogrid.net/jp/demos) にあります。

## リンク

- [公式サイト（日本語）](https://web.reogrid.net/jp) · [English](https://web.reogrid.net)
- [ドキュメント](https://web.reogrid.net/jp/docs)
- [リリースノート](https://web.reogrid.net/jp/release-notes)
- [価格・ReoGrid Web Pro](https://web.reogrid.net/jp/pricing)
- [不具合の報告（GitHub Issues）](https://github.com/unvell/reogrid-web-lite/issues)
- [UNVELL 株式会社](https://unvell.com)

## ライセンス

Free License・商用利用可。ReoGrid Web Lite は UNVELL 株式会社のソフトウェアで、オープンソースではありません。
商用製品への組み込みを含め、無償でご利用いただけます。各エディションの条件は
[価格ページ](https://web.reogrid.net/jp/pricing) をご覧ください。
