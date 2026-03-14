import { createReogrid } from '@reogrid/lite'

const fmt = (n) => `¥${n.toLocaleString('ja-JP')}`

// ── Product data ──────────────────────────────────────────────────────────────
const products = [
  { name: 'ワイヤレスイヤホン',     category: '電子機器',   price:  8900, stock: 142, rating: 4.5 },
  { name: 'メカニカルキーボード',   category: '電子機器',   price: 15800, stock:  38, rating: 4.7 },
  { name: 'プログラミング入門',     category: '書籍',       price:  2800, stock: 210, rating: 4.3 },
  { name: 'ステンレス水筒',         category: 'キッチン',   price:  3200, stock:  95, rating: 4.6 },
  { name: 'USB-Cハブ 7ポート',      category: '電子機器',   price:  4500, stock:  67, rating: 4.2 },
  { name: 'ノイズキャンセリング',   category: '電子機器',   price: 24800, stock:  23, rating: 4.8 },
  { name: 'デザイン思考の教科書',   category: '書籍',       price:  1980, stock: 155, rating: 4.1 },
  { name: 'セラミックフライパン',   category: 'キッチン',   price:  6800, stock:  44, rating: 4.4 },
  { name: 'ポータブルSSD 1TB',      category: '電子機器',   price: 12800, stock:  89, rating: 4.6 },
  { name: 'コーヒーミル 手動',      category: 'キッチン',   price:  4200, stock:  31, rating: 4.7 },
  { name: 'JavaScript完全ガイド',   category: '書籍',       price:  3800, stock:  78, rating: 4.5 },
  { name: 'スマートフォンスタンド', category: 'アクセサリ', price:  1200, stock: 320, rating: 4.0 },
  { name: 'ワイヤレス充電器',       category: '電子機器',   price:  3600, stock: 112, rating: 4.3 },
  { name: 'エコバッグ 大容量',      category: 'アクセサリ', price:   980, stock: 445, rating: 3.9 },
  { name: 'アロマディフューザー',   category: 'インテリア', price:  5400, stock:  56, rating: 4.5 },
]

const CATEGORY_STYLE = {
  '電子機器':   { bg: '#dbeafe', color: '#1d4ed8' },
  '書籍':       { bg: '#dcfce7', color: '#16a34a' },
  'キッチン':   { bg: '#ffedd5', color: '#c2410c' },
  'アクセサリ': { bg: '#f3e8ff', color: '#7c3aed' },
  'インテリア': { bg: '#ccfbf1', color: '#0d9488' },
}

function stockStyle(stock) {
  if (stock < 40)  return { bg: '#fef2f2', color: '#dc2626', bold: true }
  if (stock < 100) return { bg: '#fef9c3', color: '#ca8a04', bold: false }
  return { bg: '#f0fdf4', color: '#16a34a', bold: false }
}

// ── Create grid ───────────────────────────────────────────────────────────────
const { worksheet } = createReogrid({ workspace: '#grid' })

worksheet.showGridLines = false

// ── Column widths ─────────────────────────────────────────────────────────────
worksheet.column(0).width = 44   // A: No.
worksheet.column(1).width = 185  // B: 商品名
worksheet.column(2).width = 90   // C: カテゴリ
worksheet.column(3).width = 95   // D: 単価
worksheet.column(4).width = 74   // E: 在庫
worksheet.column(5).width = 74   // F: 評価

// ── Row heights ───────────────────────────────────────────────────────────────
worksheet.row(0).height = 36  // row 1: title
worksheet.row(1).height = 26  // row 2: column header
for (let i = 0; i < products.length; i++) worksheet.row(2 + i).height = 26

// ── Title ─────────────────────────────────────────────────────────────────────
worksheet.range('A1:F1').merge()
worksheet.cell('A1')
  .setValue('商品一覧')
  .setStyle({
    bold: true, fontSize: 14,
    textAlign: 'center', verticalAlign: 'middle',
    backgroundColor: '#1e3a5f', color: '#ffffff',
  })

// ── Column headers (drawn once) ───────────────────────────────────────────────
const hdr = { bold: true, textAlign: 'center', verticalAlign: 'middle', backgroundColor: '#334155', color: '#ffffff' }
worksheet.cell('A2').setValue('No.').setStyle(hdr)
worksheet.cell('B2').setValue('商品名').setStyle({ ...hdr, textAlign: 'left' })
worksheet.cell('C2').setValue('カテゴリ').setStyle(hdr)
worksheet.cell('D2').setValue('単価').setStyle(hdr)
worksheet.cell('E2').setValue('在庫').setStyle(hdr)
worksheet.cell('F2').setValue('評価').setStyle(hdr)

// ── Render data rows ──────────────────────────────────────────────────────────
const LAST_ROW = 2 + products.length  // row 17 for 15 products

function renderData(data) {
  data.forEach((p, i) => {
    const row   = 3 + i
    const rowBg = i % 2 === 0 ? '#f8fafc' : '#ffffff'
    const cat   = CATEGORY_STYLE[p.category] ?? { bg: '#f1f5f9', color: '#475569' }
    const st    = stockStyle(p.stock)

    worksheet.cell(`A${row}`)
      .setValue(String(i + 1))
      .setStyle({ textAlign: 'center', verticalAlign: 'middle', backgroundColor: rowBg, color: '#94a3b8' })

    worksheet.cell(`B${row}`)
      .setValue(p.name)
      .setStyle({ verticalAlign: 'middle', backgroundColor: rowBg })

    worksheet.cell(`C${row}`)
      .setValue(p.category)
      .setStyle({ textAlign: 'center', verticalAlign: 'middle', backgroundColor: cat.bg, color: cat.color, bold: true })

    worksheet.cell(`D${row}`)
      .setValue(fmt(p.price))
      .setStyle({ textAlign: 'right', verticalAlign: 'middle', backgroundColor: rowBg })

    worksheet.cell(`E${row}`)
      .setValue(String(p.stock))
      .setStyle({ textAlign: 'center', verticalAlign: 'middle', backgroundColor: st.bg, color: st.color, bold: st.bold })

    worksheet.cell(`F${row}`)
      .setValue(`★ ${p.rating.toFixed(1)}`)
      .setStyle({ textAlign: 'center', verticalAlign: 'middle', backgroundColor: rowBg, color: '#f59e0b', bold: true })
  })

  // Re-draw borders after cell styles are applied
  for (let r = 2; r <= LAST_ROW; r++) {
    worksheet.range(`A${r}:F${r}`).border({ style: 'solid', color: '#e2e8f0' }, ['top', 'bottom'])
  }
  worksheet.range(`A2:F${LAST_ROW}`).border({ style: 'solid', color: '#475569', width: 1.5 }, ['top', 'bottom'])
  worksheet.range(`A2:A${LAST_ROW}`).border({ style: 'solid', color: '#475569', width: 1.5 }, ['left'])
  worksheet.range(`F2:F${LAST_ROW}`).border({ style: 'solid', color: '#475569', width: 1.5 }, ['right'])
}

// ── Initial render ────────────────────────────────────────────────────────────
renderData(products)

// ── Toolbar: sort buttons ─────────────────────────────────────────────────────
let activeBtn = null

function setActive(btn) {
  if (activeBtn) activeBtn.classList.remove('active')
  activeBtn = btn
  if (btn) btn.classList.add('active')
}

document.querySelectorAll('[data-key]').forEach(btn => {
  btn.addEventListener('click', () => {
    const key = btn.dataset.key
    const dir = btn.dataset.dir
    const sorted = [...products].sort((a, b) => dir === 'asc' ? a[key] - b[key] : b[key] - a[key])
    renderData(sorted)
    setActive(btn)
  })
})

document.getElementById('reset-btn').addEventListener('click', () => {
  renderData(products)
  setActive(null)
})
