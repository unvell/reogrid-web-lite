<script setup lang="ts">
import { shallowRef } from 'vue'
import { Reogrid } from '@reogrid/lite/vue'
import type { ReogridInstance } from '@reogrid/lite/vue'

const grid = shallowRef<ReogridInstance | null>(null)

function onReady(instance: ReogridInstance) {
  grid.value = instance
  const { api, worksheet } = instance

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
  const rows: [string, string, number, number, number][] = [
    ['P-001', 'ウィジェットA', 1000, 5, 5000],
    ['P-002', 'ウィジェットB', 2500, 3, 7500],
    ['P-003', 'ウィジェットC', 500, 10, 5000],
  ]

  rows.forEach((row, i) => {
    const r = i + 2
    api.setCellValue(`A${r}`, row[0])
    api.setCellValue(`B${r}`, row[1])
    api.setCellValue(`C${r}`, String(row[2]))
    api.setCellValue(`D${r}`, String(row[3]))
    api.setCellValue(`E${r}`, String(row[4]))
  })

  // Column widths
  worksheet.setColumnWidth(0, 100)
  worksheet.setColumnWidth(1, 160)
  worksheet.setColumnWidth(2, 80)
  worksheet.setColumnWidth(3, 60)
  worksheet.setColumnWidth(4, 80)
}
</script>

<template>
  <div style="display: flex; flex-direction: column; height: 100vh">
    <header style="padding: 0.5rem 1rem; background: #1e3a5f; color: #fff">
      <h1 style="margin: 0; font-size: 1rem">ReoGrid Lite — Vue Example</h1>
    </header>
    <Reogrid @ready="onReady" style="flex: 1" />
  </div>
</template>
