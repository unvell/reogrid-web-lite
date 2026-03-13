import { useRef } from 'react'
import { Reogrid } from '@reogrid/lite/react'
import type { ReogridInstance } from '@reogrid/lite/react'

export default function App() {
  const gridRef = useRef<ReogridInstance>(null)

  function onReady({ api, worksheet }: ReogridInstance) {
    // Header row
    api.setCellValue('A1', '商品コード')
    api.setCellValue('B1', '商品名')
    api.setCellValue('C1', '単価')
    api.setCellValue('D1', '数量')
    api.setCellValue('E1', '金額')

    // Header styles
    for (const col of ['A', 'B', 'C', 'D', 'E']) {
      api.setCellStyle(`${col}1`, {
        bold: true,
        backgroundColor: '#1e3a5f',
        color: '#ffffff',
      })
    }

    // Sample data
    const rows = [
      ['P-001', 'ウィジェットA', 1000, 5, 5000],
      ['P-002', 'ウィジェットB', 2500, 3, 7500],
      ['P-003', 'ウィジェットC', 500, 10, 5000],
    ]

    rows.forEach((row, i) => {
      const r = i + 2
      api.setCellValue(`A${r}`, String(row[0]))
      api.setCellValue(`B${r}`, String(row[1]))
      api.setCellValue(`C${r}`, String(row[2]))
      api.setCellValue(`D${r}`, String(row[3]))
      api.setCellValue(`E${r}`, String(row[4]))
    })

    // Column widths
    worksheet.setColumnWidth(0, 100) // A
    worksheet.setColumnWidth(1, 160) // B
    worksheet.setColumnWidth(2, 80)  // C
    worksheet.setColumnWidth(3, 60)  // D
    worksheet.setColumnWidth(4, 80)  // E
  }

  return (
    <div style={{ display: 'flex', flexDirection: 'column', height: '100vh' }}>
      <header style={{ padding: '0.5rem 1rem', background: '#1e3a5f', color: '#fff' }}>
        <h1 style={{ margin: 0, fontSize: '1rem' }}>ReoGrid Lite — React Example</h1>
      </header>
      <Reogrid
        ref={gridRef}
        onReady={onReady}
        style={{ flex: 1 }}
      />
    </div>
  )
}
