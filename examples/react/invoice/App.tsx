import { Reogrid } from '@reogrid/lite/react'
import type { ReogridInstance } from '@reogrid/lite/react'

const fmt = (n: number) => n.toLocaleString('ja-JP')

export default function App() {
  function onReady({ worksheet }: ReogridInstance) {
    // ── Column widths (0-indexed) ──────────────────────
    worksheet.column(0).width = 40   // A: No.
    worksheet.column(1).width = 200  // B: 品目
    worksheet.column(2).width = 60   // C: 数量
    worksheet.column(3).width = 90   // D: 単価
    worksheet.column(4).width = 110  // E: 金額

    // ── Row heights (0-indexed) ────────────────────────
    worksheet.row(0).height = 48  // row 1: title
    worksheet.row(1).height = 8   // row 2: spacer
    worksheet.row(5).height = 10  // row 6: spacer
    worksheet.row(6).height = 40  // row 7: total amount
    worksheet.row(7).height = 10  // row 8: spacer
    worksheet.row(8).height = 24  // row 9: table header

    worksheet.showGridLines = false

    // ── タイトル ───────────────────────────────────────
    worksheet.range('A1:E1').merge()
    worksheet.cell('A1')
      .setValue('請　求　書')
      .setStyle({
        fontSize: 18,
        bold: true,
        textAlign: 'center',
        verticalAlign: 'middle',
        backgroundColor: '#1e3a5f',
        color: '#ffffff',
      })

    // ── 請求先（左） ───────────────────────────────────
    worksheet.range('A3:C3').merge()
    worksheet.cell('A3').setValue('〇〇株式会社　御中').setStyle({ bold: true, fontSize: 13 })

    worksheet.range('A4:C4').merge()
    worksheet.cell('A4').setValue('システム開発部　山田 様').setStyle({ fontSize: 11 })

    // ── 発行元情報（右） ───────────────────────────────
    worksheet.cell('D3').setStyle({ textAlign: 'right', color: '#64748b' }).setValue('発行日：')
    worksheet.cell('E3').value = '2026年3月12日'

    worksheet.cell('D4').setStyle({ textAlign: 'right', color: '#64748b' }).setValue('請求書No.：')
    worksheet.cell('E4').value = 'INV-2026-001'

    worksheet.cell('D5').setStyle({ textAlign: 'right', color: '#64748b' }).setValue('発行元：')
    worksheet.cell('E5').value = 'UNVELL株式会社'

    // ── ご請求金額ブロック ─────────────────────────────
    worksheet.range('A7:C7').merge()
    worksheet.cell('A7').setValue('ご請求金額（税込）').setStyle({
      bold: true,
      fontSize: 12,
      verticalAlign: 'middle',
      backgroundColor: '#f0f4f8',
    })

    worksheet.range('D7:E7').merge()
    worksheet.cell('D7').setValue('¥330,000').setStyle({
      bold: true,
      fontSize: 16,
      textAlign: 'right',
      verticalAlign: 'middle',
      backgroundColor: '#f0f4f8',
      color: '#1e3a5f',
    })

    worksheet.range('A7:E7').border({ style: 'solid', color: '#1e3a5f', width: 2 }, ['top', 'bottom'])
    worksheet.range('A7:A7').border({ style: 'solid', color: '#1e3a5f', width: 2 }, ['left'])
    worksheet.range('E7:E7').border({ style: 'solid', color: '#1e3a5f', width: 2 }, ['right'])

    // ── 明細テーブルヘッダー ───────────────────────────
    const headerStyle = {
      bold: true,
      backgroundColor: '#1e3a5f',
      color: '#ffffff',
      verticalAlign: 'middle' as const,
    }
    worksheet.cell('A9').setValue('No.').setStyle({ ...headerStyle, textAlign: 'center' })
    worksheet.cell('B9').setValue('品目').setStyle(headerStyle)
    worksheet.cell('C9').setValue('数量').setStyle({ ...headerStyle, textAlign: 'center' })
    worksheet.cell('D9').setValue('単価（円）').setStyle({ ...headerStyle, textAlign: 'right' })
    worksheet.cell('E9').setValue('金額（円）').setStyle({ ...headerStyle, textAlign: 'right' })

    // ── 明細行 ─────────────────────────────────────────
    const items: [string, number, number][] = [
      ['Webシステム開発（基本機能）', 1, 200000],
      ['追加機能実装（API連携）',     2,  30000],
      ['テスト・品質保証作業',         1,  20000],
      ['ドキュメント作成',             1,  10000],
      ['プロジェクト管理費',           1,  10000],
    ]

    items.forEach(([name, qty, unitPrice], i) => {
      const row = i + 10
      const amount = qty * unitPrice
      const bg = i % 2 === 0 ? '#ffffff' : '#f8fafc'

      worksheet.cell(`A${row}`).setValue(String(i + 1)).setStyle({ textAlign: 'center', backgroundColor: bg })
      worksheet.cell(`B${row}`).setValue(name).setStyle({ backgroundColor: bg })
      worksheet.cell(`C${row}`).setValue(String(qty)).setStyle({ textAlign: 'center', backgroundColor: bg })
      worksheet.cell(`D${row}`).setValue(fmt(unitPrice)).setStyle({ textAlign: 'right', backgroundColor: bg })
      worksheet.cell(`E${row}`).setValue(fmt(amount)).setStyle({ textAlign: 'right', backgroundColor: bg })
    })

    // ── 小計・消費税・合計 ─────────────────────────────
    worksheet.range('A15:D15').merge()
    worksheet.cell('A15').setValue('小計').setStyle({ textAlign: 'right', backgroundColor: '#f0f4f8' })
    worksheet.cell('E15').setValue(fmt(300000)).setStyle({ textAlign: 'right', backgroundColor: '#f0f4f8' })

    worksheet.range('A16:D16').merge()
    worksheet.cell('A16').setValue('消費税（10%）').setStyle({ textAlign: 'right', backgroundColor: '#f0f4f8' })
    worksheet.cell('E16').setValue(fmt(30000)).setStyle({ textAlign: 'right', backgroundColor: '#f0f4f8' })

    worksheet.range('A17:D17').merge()
    worksheet.cell('A17').setValue('合計（税込）').setStyle({
      bold: true,
      textAlign: 'right',
      backgroundColor: '#dbeafe',
    })
    worksheet.cell('E17').setValue(`¥${fmt(330000)}`).setStyle({
      bold: true,
      textAlign: 'right',
      backgroundColor: '#dbeafe',
      color: '#1e3a5f',
    })

    // ── テーブル罫線 ───────────────────────────────────
    for (let row = 9; row <= 17; row++) {
      worksheet.range(`A${row}:E${row}`).border({ style: 'solid', color: '#cbd5e1' }, ['top', 'bottom'])
    }
    for (const col of ['A', 'B', 'C', 'D', 'E']) {
      worksheet.range(`${col}9:${col}17`).border({ style: 'solid', color: '#cbd5e1' }, ['left', 'right'])
    }
    worksheet.range('A9:E17').border({ style: 'solid', color: '#475569', width: 1.5 }, ['top', 'bottom'])
    worksheet.range('A9:A17').border({ style: 'solid', color: '#475569', width: 1.5 }, ['left'])
    worksheet.range('E9:E17').border({ style: 'solid', color: '#475569', width: 1.5 }, ['right'])

    // ── フッター ───────────────────────────────────────
    worksheet.range('A19:E19').merge()
    worksheet.cell('A19').setValue('お支払い期限：2026年4月30日').setStyle({ bold: true, color: '#dc2626' })

    worksheet.range('A20:E20').merge()
    worksheet.cell('A20').setValue('振込先：〇〇銀行 △△支店　普通預金　1234567　UNVELL株式会社').setStyle({ fontSize: 9, color: '#475569' })
  }

  return (
    <div style={{ display: 'flex', flexDirection: 'column', height: '100vh' }}>
      <header style={{ padding: '0.5rem 1rem', background: '#1e3a5f', color: '#fff' }}>
        <h1 style={{ margin: 0, fontSize: '1rem' }}>請求書サンプル — ReoGrid Lite / React</h1>
      </header>
      <Reogrid onReady={onReady} style={{ flex: 1 }} />
    </div>
  )
}
