import { createReogrid } from '@reogrid/lite'

const fmt = (n) => `¥${n.toLocaleString('ja-JP')}`

// ── Data ─────────────────────────────────────────────────────────────────────
const incomeItems = [
  ['売上高（製品A）', 1200000, 1350000, 1480000],
  ['売上高（製品B）',  480000,  520000,  610000],
  ['サービス収入',    380000,  420000,  450000],
  ['その他収入',       50000,   30000,   80000],
]

const expenseItems = [
  ['人件費',          900000,  900000,  950000],
  ['家賃・光熱費',    180000,  175000,  185000],
  ['広告宣伝費',      120000,  150000,  200000],
  ['外注費',          250000,  300000,  320000],
  ['消耗品費',         45000,   38000,   52000],
  ['その他支出',       30000,   25000,   40000],
]

const sum3 = (items) =>
  items.reduce((acc, [, a, b, c]) => [acc[0] + a, acc[1] + b, acc[2] + c], [0, 0, 0])

const incTotals = sum3(incomeItems)
const expTotals = sum3(expenseItems)

// ── Create grid ──────────────────────────────────────────────────────────────
const { worksheet } = createReogrid({ workspace: '#grid' })

worksheet.showGridLines = false

// ── Column widths ────────────────────────────────────────────────────────────
worksheet.column(0).width = 165  // A: カテゴリ
worksheet.column(1).width = 115  // B: 1月
worksheet.column(2).width = 115  // C: 2月
worksheet.column(3).width = 115  // D: 3月
worksheet.column(4).width = 115  // E: 四半期合計

// ── Row heights ──────────────────────────────────────────────────────────────
worksheet.row(0).height  = 36   // row 1: title
worksheet.row(1).height  = 26   // row 2: column header
worksheet.row(2).height  = 24   // row 3: 収入 section header
for (let i = 3; i <= 6; i++) worksheet.row(i).height = 24  // rows 4–7: income items
worksheet.row(7).height  = 26   // row 8: 収入合計
worksheet.row(8).height  = 8    // row 9: spacer
worksheet.row(9).height  = 24   // row 10: 支出 section header
for (let i = 10; i <= 15; i++) worksheet.row(i).height = 24  // rows 11–16: expense items
worksheet.row(16).height = 26   // row 17: 支出合計
worksheet.row(17).height = 8    // row 18: spacer
worksheet.row(18).height = 32   // row 19: 収支差額

// ── Helper: write one data row ────────────────────────────────────────────────
function dataRow(row, label, jan, feb, mar, labelStyle, numStyle) {
  const total = jan + feb + mar
  worksheet.cell(`A${row}`).setValue(label).setStyle(labelStyle)
  worksheet.cell(`B${row}`).setValue(fmt(jan)).setStyle({ ...numStyle, textAlign: 'right' })
  worksheet.cell(`C${row}`).setValue(fmt(feb)).setStyle({ ...numStyle, textAlign: 'right' })
  worksheet.cell(`D${row}`).setValue(fmt(mar)).setStyle({ ...numStyle, textAlign: 'right' })
  worksheet.cell(`E${row}`).setValue(fmt(total)).setStyle({ ...numStyle, textAlign: 'right', bold: true })
}

// ── Title ─────────────────────────────────────────────────────────────────────
worksheet.range('A1:E1').merge()
worksheet.cell('A1')
  .setValue('収支管理表　2026年 Q1（1月〜3月）')
  .setStyle({
    bold: true, fontSize: 14,
    textAlign: 'center', verticalAlign: 'middle',
    backgroundColor: '#1e3a5f', color: '#ffffff',
  })

// ── Column headers ────────────────────────────────────────────────────────────
const colHeaderStyle = { bold: true, textAlign: 'center', verticalAlign: 'middle', backgroundColor: '#334155', color: '#ffffff' }
worksheet.cell('A2').setValue('カテゴリ').setStyle({ ...colHeaderStyle, textAlign: 'left' })
worksheet.cell('B2').setValue('1月').setStyle(colHeaderStyle)
worksheet.cell('C2').setValue('2月').setStyle(colHeaderStyle)
worksheet.cell('D2').setValue('3月').setStyle(colHeaderStyle)
worksheet.cell('E2').setValue('四半期合計').setStyle(colHeaderStyle)

// ── 収入 section ──────────────────────────────────────────────────────────────
worksheet.range('A3:E3').merge()
worksheet.cell('A3').setValue('▶ 収入').setStyle({
  bold: true, fontSize: 11, verticalAlign: 'middle',
  backgroundColor: '#166534', color: '#ffffff',
})

incomeItems.forEach(([label, jan, feb, mar], i) => {
  const bg = i % 2 === 0 ? '#f0fdf4' : '#dcfce7'
  dataRow(
    4 + i, label, jan, feb, mar,
    { verticalAlign: 'middle', backgroundColor: bg },
    { verticalAlign: 'middle', backgroundColor: bg, color: '#166534' },
  )
})

// 収入合計 (row 8)
dataRow(
  8, '収入合計', incTotals[0], incTotals[1], incTotals[2],
  { bold: true, verticalAlign: 'middle', backgroundColor: '#16a34a', color: '#ffffff' },
  { bold: true, verticalAlign: 'middle', backgroundColor: '#16a34a', color: '#ffffff' },
)

// ── 支出 section ──────────────────────────────────────────────────────────────
worksheet.range('A10:E10').merge()
worksheet.cell('A10').setValue('▶ 支出').setStyle({
  bold: true, fontSize: 11, verticalAlign: 'middle',
  backgroundColor: '#7f1d1d', color: '#ffffff',
})

expenseItems.forEach(([label, jan, feb, mar], i) => {
  const bg = i % 2 === 0 ? '#fff1f2' : '#ffe4e6'
  dataRow(
    11 + i, label, jan, feb, mar,
    { verticalAlign: 'middle', backgroundColor: bg },
    { verticalAlign: 'middle', backgroundColor: bg, color: '#991b1b' },
  )
})

// 支出合計 (row 17)
dataRow(
  17, '支出合計', expTotals[0], expTotals[1], expTotals[2],
  { bold: true, verticalAlign: 'middle', backgroundColor: '#dc2626', color: '#ffffff' },
  { bold: true, verticalAlign: 'middle', backgroundColor: '#dc2626', color: '#ffffff' },
)

// ── 収支差額 (row 19) ─────────────────────────────────────────────────────────
const diffJan = incTotals[0] - expTotals[0]
const diffFeb = incTotals[1] - expTotals[1]
const diffMar = incTotals[2] - expTotals[2]
const diffTot = diffJan + diffFeb + diffMar

const diffStyle = { bold: true, textAlign: 'right', verticalAlign: 'middle', backgroundColor: '#1e3a5f', color: '#fbbf24' }
worksheet.cell('A19').setValue('収支差額（利益）').setStyle({ ...diffStyle, textAlign: 'left', fontSize: 12 })
worksheet.cell('B19').setValue(fmt(diffJan)).setStyle(diffStyle)
worksheet.cell('C19').setValue(fmt(diffFeb)).setStyle(diffStyle)
worksheet.cell('D19').setValue(fmt(diffMar)).setStyle(diffStyle)
worksheet.cell('E19').setValue(fmt(diffTot)).setStyle({ ...diffStyle, fontSize: 13 })

// ── Borders ───────────────────────────────────────────────────────────────────
// Each visual block: [firstRow, lastRow]
const blocks = [[2, 8], [10, 17], [19, 19]]

blocks.forEach(([start, end]) => {
  for (let r = start; r <= end; r++) {
    worksheet.range(`A${r}:E${r}`).border({ style: 'solid', color: '#cbd5e1' }, ['top', 'bottom'])
  }
  worksheet.range(`A${start}:E${end}`).border({ style: 'solid', color: '#475569', width: 1.5 }, ['top', 'bottom'])
  worksheet.range(`A${start}:A${end}`).border({ style: 'solid', color: '#475569', width: 1.5 }, ['left'])
  worksheet.range(`E${start}:E${end}`).border({ style: 'solid', color: '#475569', width: 1.5 }, ['right'])
})
