<script setup lang="ts">
import { shallowRef } from 'vue'
import { Reogrid } from '@reogrid/lite/vue'
import type { ReogridInstance } from '@reogrid/lite/vue'

const grid = shallowRef<ReogridInstance | null>(null)

function onReady(instance: ReogridInstance) {
  grid.value = instance
  const { worksheet } = instance

  // Column widths
  worksheet.column(0).width = 100
  worksheet.column(1).width = 160
  worksheet.column(2).width = 80
  worksheet.column(3).width = 60
  worksheet.column(4).width = 80

  // Header row
  worksheet.range('A1:E1').setStyle({
    bold: true,
    backgroundColor: '#1e3a5f',
    color: '#ffffff',
  })
  worksheet.cell('A1').value = '商品コード'
  worksheet.cell('B1').value = '商品名'
  worksheet.cell('C1').value = '単価'
  worksheet.cell('D1').value = '数量'
  worksheet.cell('E1').value = '金額'

  // Sample data
  const rows: [string, string, number, number, number][] = [
    ['P-001', 'ウィジェットA', 1000, 5, 5000],
    ['P-002', 'ウィジェットB', 2500, 3, 7500],
    ['P-003', 'ウィジェットC', 500, 10, 5000],
  ]

  rows.forEach((row, i) => {
    const r = i + 2
    worksheet.cell(`A${r}`).value = row[0]
    worksheet.cell(`B${r}`).value = row[1]
    worksheet.cell(`C${r}`).value = String(row[2])
    worksheet.cell(`D${r}`).value = String(row[3])
    worksheet.cell(`E${r}`).value = String(row[4])
  })
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
