<script setup lang="ts">
import { Reogrid } from '@reogrid/lite/vue'
import type { ReogridInstance } from '@reogrid/lite/vue'

const fmt = (n: number) => n.toLocaleString('ja-JP')

function onReady(instance: ReogridInstance) {
  const { api } = instance

  // ── Column widths (0-indexed) ──────────────────────
  api.setColumnWidth(0, 40)   // A: No.
  api.setColumnWidth(1, 200)  // B: 品目
  api.setColumnWidth(2, 60)   // C: 数量
  api.setColumnWidth(3, 90)   // D: 単価
  api.setColumnWidth(4, 110)  // E: 金額

  // ── Row heights (0-indexed) ────────────────────────
  api.setRowHeight(0, 48)  // row 1: title
  api.setRowHeight(1, 8)   // row 2: spacer
  api.setRowHeight(5, 10)  // row 6: spacer
  api.setRowHeight(6, 40)  // row 7: total amount
  api.setRowHeight(7, 10)  // row 8: spacer
  api.setRowHeight(8, 24)  // row 9: table header

  // グリッド線を非表示にしてインボイスらしく見せる
  api.setShowGridLines(false)

  // ── タイトル ───────────────────────────────────────
  api.mergeCells('A1:E1')
  api.setCellValue('A1', '請　求　書')
  api.setCellStyle('A1', {
    fontSize: 18,
    bold: true,
    textAlign: 'center',
    verticalAlign: 'middle',
    backgroundColor: '#1e3a5f',
    color: '#ffffff',
  })

  // ── 請求先（左） ───────────────────────────────────
  api.mergeCells('A3:C3')
  api.setCellValue('A3', '〇〇株式会社　御中')
  api.setCellStyle('A3', { bold: true, fontSize: 13 })

  api.mergeCells('A4:C4')
  api.setCellValue('A4', 'システム開発部　山田 様')
  api.setCellStyle('A4', { fontSize: 11 })

  // ── 発行元情報（右） ───────────────────────────────
  api.setCellStyle('D3', { textAlign: 'right', color: '#64748b' })
  api.setCellValue('D3', '発行日：')
  api.setCellValue('E3', '2026年3月12日')

  api.setCellStyle('D4', { textAlign: 'right', color: '#64748b' })
  api.setCellValue('D4', '請求書No.：')
  api.setCellValue('E4', 'INV-2026-001')

  api.setCellStyle('D5', { textAlign: 'right', color: '#64748b' })
  api.setCellValue('D5', '発行元：')
  api.setCellValue('E5', 'UNVELL株式会社')

  // ── ご請求金額ブロック ─────────────────────────────
  api.mergeCells('A7:C7')
  api.setCellValue('A7', 'ご請求金額（税込）')
  api.setCellStyle('A7', {
    bold: true,
    fontSize: 12,
    verticalAlign: 'middle',
    backgroundColor: '#f0f4f8',
  })

  api.mergeCells('D7:E7')
  api.setCellValue('D7', '¥330,000')
  api.setCellStyle('D7', {
    bold: true,
    fontSize: 16,
    textAlign: 'right',
    verticalAlign: 'middle',
    backgroundColor: '#f0f4f8',
    color: '#1e3a5f',
  })

  // ご請求金額の外枠
  api.setRangeBorderA1('A7:E7', { style: 'solid', color: '#1e3a5f', width: 2 }, ['top', 'bottom'])
  api.setRangeBorderA1('A7:A7', { style: 'solid', color: '#1e3a5f', width: 2 }, ['left'])
  api.setRangeBorderA1('E7:E7', { style: 'solid', color: '#1e3a5f', width: 2 }, ['right'])

  // ── 明細テーブルヘッダー ───────────────────────────
  const headerStyle = {
    bold: true,
    backgroundColor: '#1e3a5f',
    color: '#ffffff',
    verticalAlign: 'middle' as const,
  }
  api.setCellValue('A9', 'No.')
  api.setCellStyle('A9', { ...headerStyle, textAlign: 'center' })
  api.setCellValue('B9', '品目')
  api.setCellStyle('B9', headerStyle)
  api.setCellValue('C9', '数量')
  api.setCellStyle('C9', { ...headerStyle, textAlign: 'center' })
  api.setCellValue('D9', '単価（円）')
  api.setCellStyle('D9', { ...headerStyle, textAlign: 'right' })
  api.setCellValue('E9', '金額（円）')
  api.setCellStyle('E9', { ...headerStyle, textAlign: 'right' })

  // ── 明細行 ─────────────────────────────────────────
  const items: [string, number, number][] = [
    ['Webシステム開発（基本機能）', 1, 200000],
    ['追加機能実装（API連携）',     2,  30000],
    ['テスト・品質保証作業',         1,  20000],
    ['ドキュメント作成',             1,  10000],
    ['プロジェクト管理費',           1,  10000],
  ]

  items.forEach(([name, qty, unitPrice], i) => {
    const row = i + 10   // rows 10–14
    const amount = qty * unitPrice
    const bg = i % 2 === 0 ? '#ffffff' : '#f8fafc'

    api.setCellValue(`A${row}`, String(i + 1))
    api.setCellStyle(`A${row}`, { textAlign: 'center', backgroundColor: bg })

    api.setCellValue(`B${row}`, name)
    api.setCellStyle(`B${row}`, { backgroundColor: bg })

    api.setCellValue(`C${row}`, String(qty))
    api.setCellStyle(`C${row}`, { textAlign: 'center', backgroundColor: bg })

    api.setCellValue(`D${row}`, fmt(unitPrice))
    api.setCellStyle(`D${row}`, { textAlign: 'right', backgroundColor: bg })

    api.setCellValue(`E${row}`, fmt(amount))
    api.setCellStyle(`E${row}`, { textAlign: 'right', backgroundColor: bg })
  })

  // ── 小計・消費税・合計 ─────────────────────────────
  api.mergeCells('A15:D15')
  api.setCellValue('A15', '小計')
  api.setCellStyle('A15', { textAlign: 'right', backgroundColor: '#f0f4f8' })
  api.setCellValue('E15', fmt(300000))
  api.setCellStyle('E15', { textAlign: 'right', backgroundColor: '#f0f4f8' })

  api.mergeCells('A16:D16')
  api.setCellValue('A16', '消費税（10%）')
  api.setCellStyle('A16', { textAlign: 'right', backgroundColor: '#f0f4f8' })
  api.setCellValue('E16', fmt(30000))
  api.setCellStyle('E16', { textAlign: 'right', backgroundColor: '#f0f4f8' })

  api.mergeCells('A17:D17')
  api.setCellValue('A17', '合計（税込）')
  api.setCellStyle('A17', {
    bold: true,
    textAlign: 'right',
    backgroundColor: '#dbeafe',
  })
  api.setCellValue('E17', `¥${fmt(330000)}`)
  api.setCellStyle('E17', {
    bold: true,
    textAlign: 'right',
    backgroundColor: '#dbeafe',
    color: '#1e3a5f',
  })

  // ── テーブル罫線 ───────────────────────────────────
  // 水平線（各行の上下）
  for (let row = 9; row <= 17; row++) {
    api.setRangeBorderA1(`A${row}:E${row}`, { style: 'solid', color: '#cbd5e1' }, ['top', 'bottom'])
  }
  // 垂直線（各列の左右）
  for (const col of ['A', 'B', 'C', 'D', 'E']) {
    api.setRangeBorderA1(`${col}9:${col}17`, { style: 'solid', color: '#cbd5e1' }, ['left', 'right'])
  }
  // 外枠を上書き（やや濃く）
  api.setRangeBorderA1('A9:E17', { style: 'solid', color: '#475569', width: 1.5 }, ['top', 'bottom'])
  api.setRangeBorderA1('A9:A17', { style: 'solid', color: '#475569', width: 1.5 }, ['left'])
  api.setRangeBorderA1('E9:E17', { style: 'solid', color: '#475569', width: 1.5 }, ['right'])

  // ── フッター ───────────────────────────────────────
  api.mergeCells('A19:E19')
  api.setCellValue('A19', 'お支払い期限：2026年4月30日')
  api.setCellStyle('A19', { bold: true, color: '#dc2626' })

  api.mergeCells('A20:E20')
  api.setCellValue('A20', '振込先：〇〇銀行 △△支店　普通預金　1234567　UNVELL株式会社')
  api.setCellStyle('A20', { fontSize: 9, color: '#475569' })
}
</script>

<template>
  <div style="display: flex; flex-direction: column; height: 100vh">
    <header style="padding: 0.5rem 1rem; background: #1e3a5f; color: #fff">
      <h1 style="margin: 0; font-size: 1rem">請求書サンプル — ReoGrid Lite / Vue</h1>
    </header>
    <Reogrid @ready="onReady" style="flex: 1" />
  </div>
</template>
