import { useState, useMemo } from 'react'
import { useParams, Link, useNavigate } from 'react-router-dom'
import { PIPELINE_STATUSES, CHANNELS, MESSAGE_TYPES } from '../data/sampleData'
import { getTouchCount, daysSinceLastTouch, getNextCadenceStep, isOverdue, getOverdueLabel, CADENCE_STEPS } from '../utils/cadence'
import EmailComposer from './EmailComposer'

export default function ProspectDetail({ prospects, onUpdate, onDelete, onLogOutreach }) {
  const { id } = useParams()
  const navigate = useNavigate()
  const [showOutreachForm, setShowOutreachForm] = useState(false)
  const [showEmailComposer, setShowEmailComposer] = useState(false)
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false)
  const [outreach, setOutreach] = useState({
    date: new Date().toISOString().slice(0, 10),
    channel: 'Email',
    messageType: 'Cold email',
    notes: '',
  })

  const prospect = useMemo(() => prospects.find(p => p.id === id), [prospects, id])

  if (!prospect) {
    return <div className="not-found">Prospect not found. <Link to="/prospects">Back to list</Link></div>
  }

  const touches = getTouchCount(prospect)
  const days = daysSinceLastTouch(prospect)
  const nextStep = getNextCadenceStep(prospect)
  const overdue = isOverdue(prospect)
  const overdueLabel = getOverdueLabel(prospect)

  function handleStatusChange(newStatus) {
    onUpdate(id, { status: newStatus })
  }

  function handleTogglePriority() {
    onUpdate(id, { priority: !prospect.priority })
  }

  function handleLogOutreach(e) {
    e.preventDefault()
    onLogOutreach(id, outreach)

    // Auto-advance status
    if (prospect.status === 'Identified' || prospect.status === 'Researched') {
      onUpdate(id, { status: 'Outreach Sent' })
    } else if (prospect.status === 'Outreach Sent' && touches >= 1) {
      onUpdate(id, { status: 'Followed Up' })
    }

    setOutreach({ date: new Date().toISOString().slice(0, 10), channel: 'Email', messageType: 'Cold email', notes: '' })
    setShowOutreachForm(false)
  }

  function handleDelete() {
    onDelete(id)
  }

  return (
    <div className="prospect-detail">
      <div className="detail-header">
        <div className="detail-title-row">
          <div>
            <div className="detail-title">
              {prospect.priority && <span className="priority-flag lg">★</span>}
              <h2>{prospect.companyName}</h2>
            </div>
            {prospect.industry && <span className="detail-industry">{prospect.industry} · {prospect.companySize}</span>}
          </div>
          <div className="detail-actions">
            <button className="btn btn-sm" onClick={handleTogglePriority}>
              {prospect.priority ? '★ Priority' : '☆ Set Priority'}
            </button>
            <Link to={`/prospect/${id}/edit`} className="btn btn-sm btn-secondary">Edit</Link>
            <button className="btn btn-sm btn-danger" onClick={() => setShowDeleteConfirm(true)}>Delete</button>
          </div>
        </div>

        {overdue && (
          <div className="overdue-banner">
            {overdueLabel}
          </div>
        )}
      </div>

      <div className="detail-grid">
        <div className="detail-main">
          {/* Status Pipeline */}
          <section className="detail-section">
            <h3>Pipeline Status</h3>
            <div className="status-pipeline">
              {PIPELINE_STATUSES.map(s => (
                <button
                  key={s}
                  className={`pipeline-step ${prospect.status === s ? 'active' : ''} ${PIPELINE_STATUSES.indexOf(s) < PIPELINE_STATUSES.indexOf(prospect.status) ? 'done' : ''}`}
                  onClick={() => handleStatusChange(s)}
                >
                  {s}
                </button>
              ))}
            </div>
          </section>

          {/* Outreach Cadence */}
          <section className="detail-section">
            <h3>Outreach Cadence</h3>
            <div className="cadence-track">
              {CADENCE_STEPS.map((step, i) => {
                const done = touches > i
                const current = touches === i
                return (
                  <div key={i} className={`cadence-step ${done ? 'done' : ''} ${current ? 'current' : ''}`}>
                    <div className="cadence-dot" />
                    <div className="cadence-info">
                      <strong>Step {step.step}: {step.label}</strong>
                      <span>Day {step.dayMin}{step.dayMax > step.dayMin ? `–${step.dayMax}` : ''} · {step.channel}</span>
                    </div>
                    {done && prospect.outreachLog[i] && (
                      <span className="cadence-date">{prospect.outreachLog[i].date}</span>
                    )}
                  </div>
                )
              })}
            </div>
          </section>

          {/* Outreach Log */}
          <section className="detail-section">
            <div className="section-header">
              <h3>Outreach Log ({touches})</h3>
              <div className="section-actions">
                <button className="btn btn-sm btn-primary" onClick={() => setShowEmailComposer(!showEmailComposer)}>
                  Compose Email
                </button>
                <button className="btn btn-sm btn-secondary" onClick={() => setShowOutreachForm(!showOutreachForm)}>
                  + Log Touch
                </button>
              </div>
            </div>

            {showEmailComposer && (
              <EmailComposer prospect={prospect} onClose={() => setShowEmailComposer(false)} />
            )}

            {showOutreachForm && (
              <form onSubmit={handleLogOutreach} className="outreach-form">
                <div className="form-grid">
                  <div className="form-group">
                    <label>Date</label>
                    <input type="date" value={outreach.date}
                      onChange={e => setOutreach(prev => ({ ...prev, date: e.target.value }))} />
                  </div>
                  <div className="form-group">
                    <label>Channel</label>
                    <select value={outreach.channel}
                      onChange={e => setOutreach(prev => ({ ...prev, channel: e.target.value }))}>
                      {CHANNELS.map(c => <option key={c} value={c}>{c}</option>)}
                    </select>
                  </div>
                  <div className="form-group">
                    <label>Type</label>
                    <select value={outreach.messageType}
                      onChange={e => setOutreach(prev => ({ ...prev, messageType: e.target.value }))}>
                      {MESSAGE_TYPES.map(t => <option key={t} value={t}>{t}</option>)}
                    </select>
                  </div>
                </div>
                <div className="form-group">
                  <label>Notes</label>
                  <textarea value={outreach.notes}
                    onChange={e => setOutreach(prev => ({ ...prev, notes: e.target.value }))}
                    rows={2} placeholder="What was sent, key points, response..." />
                </div>
                <div className="form-actions">
                  <button type="button" className="btn btn-secondary" onClick={() => setShowOutreachForm(false)}>Cancel</button>
                  <button type="submit" className="btn btn-primary">Log Outreach</button>
                </div>
              </form>
            )}

            {prospect.outreachLog.length > 0 ? (
              <div className="outreach-timeline">
                {[...prospect.outreachLog].reverse().map((entry, i) => (
                  <div key={entry.id || i} className="timeline-entry">
                    <div className="timeline-dot" />
                    <div className="timeline-content">
                      <div className="timeline-header">
                        <strong>{entry.date}</strong>
                        <span className="timeline-channel">{entry.channel}</span>
                        <span className="timeline-type">{entry.messageType}</span>
                      </div>
                      {entry.notes && <p>{entry.notes}</p>}
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <p className="muted">No outreach logged yet.</p>
            )}
          </section>

          {/* Fit Notes */}
          <section className="detail-section">
            <h3>Why Rooster?</h3>
            <p className="fit-notes">{prospect.fitNotes || <em className="muted">No fit notes yet.</em>}</p>
          </section>
        </div>

        {/* Sidebar */}
        <aside className="detail-sidebar">
          <div className="sidebar-card">
            <h4>Contact</h4>
            <div className="sidebar-field">
              <label>Name</label>
              <span>{prospect.contactName || '—'}</span>
            </div>
            <div className="sidebar-field">
              <label>Title</label>
              <span>{prospect.contactTitle || '—'}</span>
            </div>
            {prospect.contactLinkedIn && (
              <div className="sidebar-field">
                <a href={prospect.contactLinkedIn} target="_blank" rel="noopener noreferrer" className="btn btn-sm btn-secondary full-width">
                  View LinkedIn
                </a>
              </div>
            )}
            {prospect.companyWebsite && (
              <div className="sidebar-field">
                <a href={prospect.companyWebsite} target="_blank" rel="noopener noreferrer" className="btn btn-sm btn-secondary full-width">
                  Visit Website
                </a>
              </div>
            )}
          </div>

          <div className="sidebar-card">
            <h4>Details</h4>
            <div className="sidebar-field">
              <label>Snapshot Tier</label>
              <span className={`tier-badge tier-${(prospect.snapshotTier || 'unknown').toLowerCase().replace('-', '')}`}>
                {prospect.snapshotTier}
              </span>
            </div>
            <div className="sidebar-field">
              <label>Source</label>
              <span>{prospect.source}</span>
            </div>
            <div className="sidebar-field">
              <label>Touches</label>
              <span>{touches}</span>
            </div>
            <div className="sidebar-field">
              <label>Last Touch</label>
              <span>{days !== null ? `${days} days ago` : 'Never'}</span>
            </div>
          </div>

          <div className="sidebar-card">
            <h4>Next Step</h4>
            <div className="sidebar-field">
              <label>Action</label>
              <span>{prospect.nextAction || (nextStep ? nextStep.label : '—')}</span>
            </div>
            {prospect.nextActionDate && (
              <div className="sidebar-field">
                <label>Date</label>
                <span>{prospect.nextActionDate}</span>
              </div>
            )}
          </div>
        </aside>
      </div>

      {showDeleteConfirm && (
        <div className="modal-overlay" onClick={() => setShowDeleteConfirm(false)}>
          <div className="modal" onClick={e => e.stopPropagation()}>
            <h3>Delete {prospect.companyName}?</h3>
            <p>This will permanently remove this prospect and all outreach history.</p>
            <div className="form-actions">
              <button className="btn btn-secondary" onClick={() => setShowDeleteConfirm(false)}>Cancel</button>
              <button className="btn btn-danger" onClick={handleDelete}>Delete</button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
