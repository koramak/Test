import { getLastTouchDate, getTouchCount } from './cadence'

const CSV_HEADERS = [
  'Company Name',
  'Contact Name',
  'Contact Title',
  'Contact LinkedIn',
  'Company Website',
  'Industry',
  'Company Size',
  'Source',
  'Snapshot Tier',
  'Fit Notes',
  'Priority',
  'Pipeline Status',
  'Touch Count',
  'Last Touch Date',
  'Next Action',
  'Next Action Date',
  'Created At',
]

function escapeCSV(value) {
  const str = String(value ?? '')
  if (str.includes(',') || str.includes('"') || str.includes('\n')) {
    return `"${str.replace(/"/g, '""')}"`
  }
  return str
}

export function prospectsToCSV(prospects) {
  const rows = [CSV_HEADERS.join(',')]
  for (const p of prospects) {
    rows.push([
      escapeCSV(p.companyName),
      escapeCSV(p.contactName),
      escapeCSV(p.contactTitle),
      escapeCSV(p.contactLinkedIn),
      escapeCSV(p.companyWebsite),
      escapeCSV(p.industry),
      escapeCSV(p.companySize),
      escapeCSV(p.source),
      escapeCSV(p.snapshotTier),
      escapeCSV(p.fitNotes),
      escapeCSV(p.priority ? 'Yes' : 'No'),
      escapeCSV(p.status),
      getTouchCount(p),
      escapeCSV(getLastTouchDate(p) || ''),
      escapeCSV(p.nextAction),
      escapeCSV(p.nextActionDate),
      escapeCSV(p.createdAt?.slice(0, 10) || ''),
    ].join(','))
  }
  return rows.join('\n')
}

export function downloadCSV(prospects, filename = 'rooster-pipeline-export.csv') {
  const csv = prospectsToCSV(prospects)
  const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' })
  const url = URL.createObjectURL(blob)
  const a = document.createElement('a')
  a.href = url
  a.download = filename
  a.click()
  URL.revokeObjectURL(url)
}

export function parseCSVImport(csvText) {
  const lines = csvText.split('\n').filter(l => l.trim())
  if (lines.length < 2) return []

  const prospects = []
  for (let i = 1; i < lines.length; i++) {
    const values = parseCSVLine(lines[i])
    if (values.length < 5) continue
    prospects.push({
      companyName: values[0] || '',
      contactName: values[1] || '',
      contactTitle: values[2] || '',
      contactLinkedIn: values[3] || '',
      companyWebsite: values[4] || '',
      industry: values[5] || '',
      companySize: values[6] || 'Unknown',
      source: values[7] || 'CSV Import',
      snapshotTier: values[8] || 'Unknown',
      fitNotes: values[9] || '',
      priority: (values[10] || '').toLowerCase() === 'yes',
      status: values[11] || 'Identified',
      outreachLog: [],
      nextAction: values[14] || '',
      nextActionDate: values[15] || '',
    })
  }
  return prospects
}

function parseCSVLine(line) {
  const result = []
  let current = ''
  let inQuotes = false
  for (let i = 0; i < line.length; i++) {
    const char = line[i]
    if (inQuotes) {
      if (char === '"' && line[i + 1] === '"') {
        current += '"'
        i++
      } else if (char === '"') {
        inQuotes = false
      } else {
        current += char
      }
    } else {
      if (char === '"') {
        inQuotes = true
      } else if (char === ',') {
        result.push(current)
        current = ''
      } else {
        current += char
      }
    }
  }
  result.push(current)
  return result
}
