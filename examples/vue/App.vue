<script setup lang="ts">
import { shallowRef } from 'vue'
import { Reogrid } from '@reogrid/lite/vue'
import type { ReogridInstance } from '@reogrid/lite/vue'

const grid = shallowRef<ReogridInstance | null>(null)

function onReady(instance: ReogridInstance) {
  grid.value = instance
  const { api } = instance

  // Header row
  api.setCellValue('A1', '商品コード')
  api.setCellValue('B1', '商品名')
  api.setCellValue('C1', '単価')
  api.setCellValue('D1', '数量')
  api.setCellValue('E1', '金額')

  // Header styles
  for (const col of ['A', 'B', 'C', 'D', 'E']) {
    api.setCellStyle(`${col}1`, {
      fontBold: true,
      backgroundColor: '#1e3a5f',
      foregroundColor: '#ffffff',
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
    api.setCellValue(`C${r}`, row[2])
    api.setCellValue(`D${r}`, row[3])
    api.setCellValue(`E${r}`, row[4])
  })

  // Column widths
  api.setColWidth(0, 100)
  api.setColWidth(1, 160)
  api.setColWidth(2, 80)
  api.setColWidth(3, 60)
  api.setColWidth(4, 80)
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
