import { useMemo } from 'react'
import { Link } from 'react-router-dom'
import { isOverdue, getOverdueLabel, daysSinceLastTouch, getTouchCount, getNextCadenceStep } from '../utils/cadence'
import { PIPELINE_STATUSES } from '../data/sampleData'

export default function Dashboard({ prospects, onUpdate }) {
  const stats = useMemo(() => {
    const byStatus = {}
    for (const s of PIPELINE_STATUSES) byStatus[s] = 0
    for (const p of prospects) byStatus[p.status] = (byStatus[p.status] || 0) + 1
    return byStatus
  }, [prospects])

  const overdueProspects = useMemo(() => {
    return prospects
      .filter(p => isOverdue(p))
      .sort((a, b) => {
        if (a.priority && !b.priority) return -1
        if (!a.priority && b.priority) return 1
        const daysA = daysSinceLastTouch(a) ?? 999
        const daysB = daysSinceLastTouch(b) ?? 999
        return daysB - daysA
      })
  }, [prospects])

  const priorityProspects = useMemo(() => {
    return prospects.filter(p =>
      p.priority && !['Meeting Booked', 'Not a Fit'].includes(p.status)
    )
  }, [prospects])

  const recentActivity = useMemo(() => {
    const entries = []
    for (const p of prospects) {
      for (const log of (p.outreachLog || [])) {
        entries.push({ ...log, companyName: p.companyName, prospectId: p.id })
      }
    }
    return entries.sort((a, b) => b.date.localeCompare(a.date)).slice(0, 8)
  }, [prospects])

  const activeCount = prospects.filter(p => !['Meeting Booked', 'Not a Fit'].includes(p.status)).length
  const totalTouches = prospects.reduce((sum, p) => sum + getTouchCount(p), 0)

  return (
    <div className="dashboard">
      <div className="dash-greeting">
        <h2>Good {getTimeOfDay()}, Zane</h2>
        <p className="dash-subtitle">{overdueProspects.length > 0
          ? `${overdueProspects.length} prospect${overdueProspects.length > 1 ? 's' : ''} need attention today`
          : 'Pipeline is up to date — nice work'
        }</p>
      </div>

      <div className="stats-row">
        <div className="stat-card">
          <div className="stat-number">{prospects.length}</div>
          <div className="stat-label">Total Prospects</div>
        </div>
        <div className="stat-card">
          <div className="stat-number">{activeCount}</div>
          <div className="stat-label">Active</div>
        </div>
        <div className="stat-card">
          <div className="stat-number">{totalTouches}</div>
          <div className="stat-label">Total Touches</div>
        </div>
        <div className="stat-card">
          <div className="stat-number">{stats['Meeting Booked'] || 0}</div>
          <div className="stat-label">Meetings Booked</div>
        </div>
      </div>

      {overdueProspects.length > 0 && (
        <section className="dash-section">
          <h3>Action Required</h3>
          <div className="action-list">
            {overdueProspects.map(p => (
              <Link to={`/prospect/${p.id}`} key={p.id} className="action-item">
                <div className="action-left">
                  {p.priority && <span className="priority-flag">★</span>}
                  <div>
                    <strong>{p.companyName}</strong>
                    <div className="action-detail">{getOverdueLabel(p)}</div>
                  </div>
                </div>
                <span className={`status-badge status-${p.status.toLowerCase().replace(/\s+/g, '-')}`}>
                  {p.status}
                </span>
              </Link>
            ))}
          </div>
        </section>
      )}

      {priorityProspects.length > 0 && (
        <section className="dash-section">
          <h3>Priority Prospects</h3>
          <div className="action-list">
            {priorityProspects.map(p => {
              const next = getNextCadenceStep(p)
              return (
                <Link to={`/prospect/${p.id}`} key={p.id} className="action-item">
                  <div className="action-left">
                    <span className="priority-flag">★</span>
                    <div>
                      <strong>{p.companyName}</strong>
                      <div className="action-detail">
                        {p.nextAction || (next ? `Next: ${next.label}` : p.status)}
                      </div>
                    </div>
                  </div>
                  <span className={`status-badge status-${p.status.toLowerCase().replace(/\s+/g, '-')}`}>
                    {p.status}
                  </span>
                </Link>
              )
            })}
          </div>
        </section>
      )}

      {recentActivity.length > 0 && (
        <section className="dash-section">
          <h3>Recent Activity</h3>
          <div className="activity-list">
            {recentActivity.map((entry, i) => (
              <Link to={`/prospect/${entry.prospectId}`} key={i} className="activity-item">
                <span className="activity-date">{entry.date}</span>
                <span className="activity-channel">{entry.channel}</span>
                <strong>{entry.companyName}</strong>
                <span className="activity-type">{entry.messageType}</span>
              </Link>
            ))}
          </div>
        </section>
      )}

      <section className="dash-section">
        <h3>Pipeline Summary</h3>
        <div className="pipeline-summary">
          {PIPELINE_STATUSES.map(status => (
            <div key={status} className="pipeline-bar-item">
              <div className="pipeline-bar-label">
                <span>{status}</span>
                <span>{stats[status] || 0}</span>
              </div>
              <div className="pipeline-bar-track">
                <div
                  className={`pipeline-bar-fill status-bg-${status.toLowerCase().replace(/\s+/g, '-')}`}
                  style={{ width: `${prospects.length ? ((stats[status] || 0) / prospects.length) * 100 : 0}%` }}
                />
              </div>
            </div>
          ))}
        </div>
      </section>
    </div>
  )
}

function getTimeOfDay() {
  const h = new Date().getHours()
  if (h < 12) return 'morning'
  if (h < 17) return 'afternoon'
  return 'evening'
}
