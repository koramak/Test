import { Link } from 'react-router-dom'
import { PIPELINE_STATUSES } from '../data/sampleData'
import { getTouchCount, daysSinceLastTouch, isOverdue } from '../utils/cadence'

export default function PipelineBoard({ prospects, onUpdate }) {
  const columns = PIPELINE_STATUSES.map(status => ({
    status,
    prospects: prospects
      .filter(p => p.status === status)
      .sort((a, b) => {
        if (a.priority && !b.priority) return -1
        if (!a.priority && b.priority) return 1
        return (a.companyName || '').localeCompare(b.companyName || '')
      }),
  }))

  function handleDrop(e, newStatus) {
    e.preventDefault()
    const id = e.dataTransfer.getData('text/plain')
    if (id) onUpdate(id, { status: newStatus })
  }

  function handleDragOver(e) {
    e.preventDefault()
  }

  function handleDragStart(e, id) {
    e.dataTransfer.setData('text/plain', id)
  }

  return (
    <div className="pipeline-board">
      <h2>Pipeline Board</h2>
      <div className="board-columns">
        {columns.map(col => (
          <div
            key={col.status}
            className="board-column"
            onDrop={e => handleDrop(e, col.status)}
            onDragOver={handleDragOver}
          >
            <div className={`column-header status-bg-${col.status.toLowerCase().replace(/\s+/g, '-')}`}>
              <span>{col.status}</span>
              <span className="column-count">{col.prospects.length}</span>
            </div>
            <div className="column-body">
              {col.prospects.map(p => {
                const overdue = isOverdue(p)
                const days = daysSinceLastTouch(p)
                return (
                  <Link
                    to={`/prospect/${p.id}`}
                    key={p.id}
                    className={`board-card ${overdue ? 'card-overdue' : ''} ${p.priority ? 'card-priority' : ''}`}
                    draggable
                    onDragStart={e => handleDragStart(e, p.id)}
                  >
                    <div className="card-top">
                      {p.priority && <span className="priority-flag">★</span>}
                      <strong>{p.companyName}</strong>
                    </div>
                    <div className="card-meta">
                      <span>{p.industry || 'No industry'}</span>
                      <span>{p.companySize}</span>
                    </div>
                    <div className="card-bottom">
                      <span className={`tier-badge tier-${(p.snapshotTier || 'unknown').toLowerCase().replace('-', '')}`}>
                        {p.snapshotTier || 'Unknown'}
                      </span>
                      <span className="touch-count">
                        {getTouchCount(p)} touch{getTouchCount(p) !== 1 ? 'es' : ''}
                        {days !== null && ` · ${days}d ago`}
                      </span>
                    </div>
                    {overdue && <div className="overdue-indicator" />}
                  </Link>
                )
              })}
              {col.prospects.length === 0 && (
                <div className="column-empty">No prospects</div>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
