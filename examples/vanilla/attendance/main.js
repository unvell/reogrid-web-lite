import { createReogrid } from '@reogrid/lite'

// Convert 0-based column index to spreadsheet letter (A–Z only, max 25)
function col(i) { return String.fromCharCode(65 + i) }

// ── Calendar setup (March 2026, first 3 weeks: days 1–21) ────────────────────
const YEAR  = 2026
const MONTH = 3
const DAYS  = 21  // 3 full weeks (Sun 1 … Sat 21) — fits within the 26-column limit

const DOW_NAMES = ['日', '月', '火', '水', '木', '金', '土']

// Day of week (0=Sun … 6=Sat) for each date 1–DAYS
const dow = Array.from({ length: DAYS }, (_, i) => new Date(YEAR, MONTH - 1, i + 1).getDay())

// Japanese public holidays in this range (March 20 = 春分の日)
const HOLIDAYS = new Set([20])

const isDayOff = (d) => dow[d - 1] === 0 || dow[d - 1] === 6 || HOLIDAYS.has(d)

// ── Employee data ────────────────────────────────────────────────────────────
// absences = Set of dates marked × (欠勤) within days 1–21
// leaves   = Set of dates marked 有 (有給) within days 1–21
const employees = [
  { name: '田中　太郎', absences: new Set([11]),    leaves: new Set([])   },
  { name: '鈴木　花子', absences: new Set([]),       leaves: new Set([5])  },
  { name: '佐藤　一郎', absences: new Set([]),       leaves: new Set([])   },
  { name: '高橋　美咲', absences: new Set([10, 17]), leaves: new Set([])   },
  { name: '山田　健太', absences: new Set([]),       leaves: new Set([19]) },
]

// ── Column / row layout (max 26 cols: A–Z) ────────────────────────────────────
// A=name, B–V=days 1–21, W=出勤, X=欠勤, Y=有休  (total 25 cols)
const COL_NAME      = 0          // A
const COL_DAY_START = 1          // B = day 1 … V = day 21
const COL_ATTENDED  = DAYS + 1   // W  (index 22)
const COL_ABSENT    = DAYS + 2   // X  (index 23)
const COL_LEAVE     = DAYS + 3   // Y  (index 24)

const LAST_COL = col(COL_LEAVE)  // 'Y'

const ROW_TITLE = 1
const ROW_DATE  = 2
const ROW_DOW   = 3
const ROW_DATA  = 4

// ── Create grid ───────────────────────────────────────────────────────────────
const { worksheet } = createReogrid({ workspace: '#grid' })

worksheet.showGridLines = false

// ── Column widths ─────────────────────────────────────────────────────────────
worksheet.column(COL_NAME).width = 90
for (let d = 1; d <= DAYS; d++) worksheet.column(COL_DAY_START + d - 1).width = 24
worksheet.column(COL_ATTENDED).width = 46
worksheet.column(COL_ABSENT).width   = 46
worksheet.column(COL_LEAVE).width    = 46

// ── Row heights ───────────────────────────────────────────────────────────────
worksheet.row(ROW_TITLE - 1).height = 36
worksheet.row(ROW_DATE  - 1).height = 22
worksheet.row(ROW_DOW   - 1).height = 20
for (let i = 0; i < employees.length; i++) worksheet.row(ROW_DATA - 1 + i).height = 26

// ── Title ─────────────────────────────────────────────────────────────────────
worksheet.range(`A${ROW_TITLE}:${LAST_COL}${ROW_TITLE}`).merge()
worksheet.cell(`A${ROW_TITLE}`)
  .setValue('勤怠管理表　2026年3月（第1〜3週）')
  .setStyle({
    bold: true, fontSize: 14,
    textAlign: 'center', verticalAlign: 'middle',
    backgroundColor: '#1e3a5f', color: '#ffffff',
  })

// ── Header: 氏名 (spans date + dow rows) ─────────────────────────────────────
worksheet.range(`A${ROW_DATE}:A${ROW_DOW}`).merge()
worksheet.cell(`A${ROW_DATE}`).setValue('氏名').setStyle({
  bold: true, textAlign: 'center', verticalAlign: 'middle',
  backgroundColor: '#334155', color: '#ffffff',
})

// ── Header: summary columns (spans date + dow rows) ──────────────────────────
const summaryLabels = ['出勤', '欠勤', '有休']
;[COL_ATTENDED, COL_ABSENT, COL_LEAVE].forEach((c, i) => {
  const top = `${col(c)}${ROW_DATE}`
  const bot = `${col(c)}${ROW_DOW}`
  worksheet.range(`${top}:${bot}`).merge()
  worksheet.cell(top).setValue(summaryLabels[i]).setStyle({
    bold: true, textAlign: 'center', verticalAlign: 'middle',
    backgroundColor: '#334155', color: '#ffffff',
  })
})

// ── Header: day numbers + day-of-week ────────────────────────────────────────
for (let d = 1; d <= DAYS; d++) {
  const c   = col(COL_DAY_START + d - 1)
  const day = dow[d - 1]
  const sat = day === 6
  const sun = day === 0 || HOLIDAYS.has(d)

  const bg = sat ? '#1d4ed8' : sun ? '#dc2626' : '#334155'

  worksheet.cell(`${c}${ROW_DATE}`).setValue(String(d)).setStyle({
    bold: true, textAlign: 'center', verticalAlign: 'middle',
    backgroundColor: bg, color: '#ffffff',
  })
  worksheet.cell(`${c}${ROW_DOW}`).setValue(DOW_NAMES[day]).setStyle({
    bold: true, textAlign: 'center', verticalAlign: 'middle',
    backgroundColor: bg, color: '#ffffff',
  })
}

// ── Employee rows ─────────────────────────────────────────────────────────────
employees.forEach((emp, i) => {
  const row   = ROW_DATA + i
  const rowBg = i % 2 === 0 ? '#f8fafc' : '#ffffff'

  worksheet.cell(`A${row}`).setValue(emp.name).setStyle({
    bold: true, verticalAlign: 'middle', backgroundColor: rowBg,
  })

  let attendedCount = 0

  for (let d = 1; d <= DAYS; d++) {
    const c   = col(COL_DAY_START + d - 1)
    const sat = dow[d - 1] === 6
    const sun = dow[d - 1] === 0 || HOLIDAYS.has(d)

    let value, bg, color, bold = false

    if (isDayOff(d)) {
      value = '休'
      bg    = sat ? '#eff6ff' : '#fff1f2'
      color = sat ? '#3b82f6' : '#ef4444'
    } else if (emp.absences.has(d)) {
      value = '×'
      bg    = '#fef9c3'
      color = '#b45309'
    } else if (emp.leaves.has(d)) {
      value = '有'
      bg    = '#dcfce7'
      color = '#16a34a'
      bold  = true
    } else {
      value = '〇'
      bg    = rowBg
      color = '#1e293b'
      attendedCount++
    }

    worksheet.cell(`${c}${row}`).setValue(value).setStyle({
      textAlign: 'center', verticalAlign: 'middle',
      backgroundColor: bg, color, bold,
    })
  }

  const absentCount = emp.absences.size
  const leaveCount  = emp.leaves.size

  worksheet.cell(`${col(COL_ATTENDED)}${row}`)
    .setValue(String(attendedCount))
    .setStyle({ textAlign: 'center', verticalAlign: 'middle', bold: true, backgroundColor: rowBg })

  worksheet.cell(`${col(COL_ABSENT)}${row}`)
    .setValue(absentCount > 0 ? String(absentCount) : '—')
    .setStyle({
      textAlign: 'center', verticalAlign: 'middle', backgroundColor: rowBg,
      color: absentCount > 0 ? '#ef4444' : '#94a3b8',
    })

  worksheet.cell(`${col(COL_LEAVE)}${row}`)
    .setValue(leaveCount > 0 ? String(leaveCount) : '—')
    .setStyle({
      textAlign: 'center', verticalAlign: 'middle', backgroundColor: rowBg,
      color: leaveCount > 0 ? '#16a34a' : '#94a3b8',
    })
})

// ── Borders ───────────────────────────────────────────────────────────────────
const lastDataRow = ROW_DATA + employees.length - 1

for (let r = ROW_DATE; r <= lastDataRow; r++) {
  worksheet.range(`A${r}:${LAST_COL}${r}`).border({ style: 'solid', color: '#cbd5e1' }, ['top', 'bottom'])
}
worksheet.range(`A${ROW_DATE}:${LAST_COL}${lastDataRow}`)
  .border({ style: 'solid', color: '#475569', width: 1.5 }, ['top', 'bottom'])
worksheet.range(`A${ROW_DATE}:A${lastDataRow}`)
  .border({ style: 'solid', color: '#475569', width: 1.5 }, ['left'])
worksheet.range(`${LAST_COL}${ROW_DATE}:${LAST_COL}${lastDataRow}`)
  .border({ style: 'solid', color: '#475569', width: 1.5 }, ['right'])
