import { useState, useMemo, useRef } from 'react'
import { Link } from 'react-router-dom'
import { PIPELINE_STATUSES, SNAPSHOT_TIERS } from '../data/sampleData'
import { getTouchCount, daysSinceLastTouch, isOverdue } from '../utils/cadence'
import { downloadCSV, parseCSVImport } from '../utils/csv'

export default function ProspectList({ prospects, onImport, onLoadSample }) {
  const [search, setSearch] = useState('')
  const [statusFilter, setStatusFilter] = useState('All')
  const [tierFilter, setTierFilter] = useState('All')
  const [priorityOnly, setPriorityOnly] = useState(false)
  const [sortBy, setSortBy] = useState('company')
  const fileRef = useRef()

  const filtered = useMemo(() => {
    let list = [...prospects]

    if (search) {
      const q = search.toLowerCase()
      list = list.filter(p =>
        p.companyName.toLowerCase().includes(q) ||
        p.contactName.toLowerCase().includes(q) ||
        p.industry.toLowerCase().includes(q) ||
        p.fitNotes.toLowerCase().includes(q)
      )
    }
    if (statusFilter !== 'All') list = list.filter(p => p.status === statusFilter)
    if (tierFilter !== 'All') list = list.filter(p => p.snapshotTier === tierFilter)
    if (priorityOnly) list = list.filter(p => p.priority)

    list.sort((a, b) => {
      switch (sortBy) {
        case 'company': return a.companyName.localeCompare(b.companyName)
        case 'status': return PIPELINE_STATUSES.indexOf(a.status) - PIPELINE_STATUSES.indexOf(b.status)
        case 'lastTouch': return (daysSinceLastTouch(b) ?? 999) - (daysSinceLastTouch(a) ?? 999)
        case 'priority': return (b.priority ? 1 : 0) - (a.priority ? 1 : 0)
        default: return 0
      }
    })
    return list
  }, [prospects, search, statusFilter, tierFilter, priorityOnly, sortBy])

  function handleCSVImport(e) {
    const file = e.target.files[0]
    if (!file) return
    const reader = new FileReader()
    reader.onload = (ev) => {
      const data = parseCSVImport(ev.target.result)
      if (data.length > 0) onImport(data)
    }
    reader.readAsText(file)
    e.target.value = ''
  }

  return (
    <div className="prospect-list-page">
      <div className="list-header">
        <h2>All Prospects ({filtered.length})</h2>
        <div className="list-actions">
          <button className="btn btn-secondary" onClick={() => downloadCSV(filtered)}>
            Export CSV
          </button>
          <button className="btn btn-secondary" onClick={() => fileRef.current?.click()}>
            Import CSV
          </button>
          <input ref={fileRef} type="file" accept=".csv" onChange={handleCSVImport} hidden />
          <Link to="/add" className="btn btn-primary">+ Add Prospect</Link>
        </div>
      </div>

      <div className="list-filters">
        <input
          type="text"
          placeholder="Search company, contact, industry..."
          value={search}
          onChange={e => setSearch(e.target.value)}
          className="search-input"
        />
        <select value={statusFilter} onChange={e => setStatusFilter(e.target.value)}>
          <option value="All">All Statuses</option>
          {PIPELINE_STATUSES.map(s => <option key={s} value={s}>{s}</option>)}
        </select>
        <select value={tierFilter} onChange={e => setTierFilter(e.target.value)}>
          <option value="All">All Tiers</option>
          {SNAPSHOT_TIERS.map(t => <option key={t} value={t}>{t}</option>)}
        </select>
        <select value={sortBy} onChange={e => setSortBy(e.target.value)}>
          <option value="company">Sort: Company</option>
          <option value="status">Sort: Status</option>
          <option value="lastTouch">Sort: Last Touch</option>
          <option value="priority">Sort: Priority</option>
        </select>
        <label className="priority-toggle">
          <input type="checkbox" checked={priorityOnly} onChange={e => setPriorityOnly(e.target.checked)} />
          Priority only
        </label>
      </div>

      <div className="prospect-table">
        <div className="table-header">
          <span>Company</span>
          <span>Contact</span>
          <span>Status</span>
          <span>Tier</span>
          <span>Touches</span>
          <span>Last Touch</span>
        </div>
        {filtered.map(p => {
          const overdue = isOverdue(p)
          const days = daysSinceLastTouch(p)
          return (
            <Link to={`/prospect/${p.id}`} key={p.id} className={`table-row ${overdue ? 'row-overdue' : ''}`}>
              <span className="cell-company">
                {p.priority && <span className="priority-flag">★</span>}
                {p.companyName}
              </span>
              <span className="cell-contact">
                {p.contactName || <em className="muted">No contact</em>}
                {p.contactTitle && <small> · {p.contactTitle}</small>}
              </span>
              <span>
                <span className={`status-badge status-${p.status.toLowerCase().replace(/\s+/g, '-')}`}>
                  {p.status}
                </span>
              </span>
              <span>
                <span className={`tier-badge tier-${(p.snapshotTier || 'unknown').toLowerCase().replace('-', '')}`}>
                  {p.snapshotTier}
                </span>
              </span>
              <span>{getTouchCount(p)}</span>
              <span>{days !== null ? `${days}d ago` : '—'}</span>
            </Link>
          )
        })}
        {filtered.length === 0 && (
          <div className="table-empty">
            No prospects match your filters.
            {prospects.length === 0 && (
              <button className="btn btn-secondary" onClick={onLoadSample} style={{ marginTop: 12 }}>
                Load sample data
              </button>
            )}
          </div>
        )}
      </div>
    </div>
  )
}
