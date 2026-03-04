import { useState, useEffect } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { PIPELINE_STATUSES, SNAPSHOT_TIERS, COMPANY_SIZES, SOURCES } from '../data/sampleData'

export default function ProspectForm({ prospects, onSubmit, isEdit }) {
  const { id } = useParams()
  const navigate = useNavigate()

  const [form, setForm] = useState({
    companyName: '',
    contactName: '',
    contactTitle: '',
    contactLinkedIn: '',
    companyWebsite: '',
    industry: '',
    companySize: 'Unknown',
    source: 'LinkedIn search',
    snapshotTier: 'Unknown',
    fitNotes: '',
    priority: false,
    status: 'Identified',
    nextAction: '',
    nextActionDate: '',
  })

  useEffect(() => {
    if (isEdit && id && prospects) {
      const p = prospects.find(p => p.id === id)
      if (p) {
        setForm({
          companyName: p.companyName || '',
          contactName: p.contactName || '',
          contactTitle: p.contactTitle || '',
          contactLinkedIn: p.contactLinkedIn || '',
          companyWebsite: p.companyWebsite || '',
          industry: p.industry || '',
          companySize: p.companySize || 'Unknown',
          source: p.source || 'LinkedIn search',
          snapshotTier: p.snapshotTier || 'Unknown',
          fitNotes: p.fitNotes || '',
          priority: p.priority || false,
          status: p.status || 'Identified',
          nextAction: p.nextAction || '',
          nextActionDate: p.nextActionDate || '',
        })
      }
    }
  }, [isEdit, id, prospects])

  function handleChange(e) {
    const { name, value, type, checked } = e.target
    setForm(prev => ({ ...prev, [name]: type === 'checkbox' ? checked : value }))
  }

  function handleSubmit(e) {
    e.preventDefault()
    if (!form.companyName.trim()) return
    if (isEdit && id) {
      onSubmit(id, form)
      navigate(`/prospect/${id}`)
    } else {
      onSubmit(form)
    }
  }

  return (
    <div className="prospect-form-page">
      <h2>{isEdit ? 'Edit Prospect' : 'Add Prospect'}</h2>
      <form onSubmit={handleSubmit} className="prospect-form">
        <div className="form-section">
          <h3>Company Info</h3>
          <div className="form-grid">
            <div className="form-group">
              <label>Company Name *</label>
              <input name="companyName" value={form.companyName} onChange={handleChange} required />
            </div>
            <div className="form-group">
              <label>Company Website</label>
              <input name="companyWebsite" value={form.companyWebsite} onChange={handleChange} placeholder="https://" />
            </div>
            <div className="form-group">
              <label>Industry</label>
              <input name="industry" value={form.industry} onChange={handleChange} placeholder="e.g. SaaS / Tech" />
            </div>
            <div className="form-group">
              <label>Company Size</label>
              <select name="companySize" value={form.companySize} onChange={handleChange}>
                {COMPANY_SIZES.map(s => <option key={s} value={s}>{s}</option>)}
              </select>
            </div>
          </div>
        </div>

        <div className="form-section">
          <h3>Contact Info</h3>
          <div className="form-grid">
            <div className="form-group">
              <label>Contact Name</label>
              <input name="contactName" value={form.contactName} onChange={handleChange} />
            </div>
            <div className="form-group">
              <label>Contact Title</label>
              <input name="contactTitle" value={form.contactTitle} onChange={handleChange} placeholder="e.g. VP People & Culture" />
            </div>
            <div className="form-group full-width">
              <label>Contact LinkedIn URL</label>
              <input name="contactLinkedIn" value={form.contactLinkedIn} onChange={handleChange} placeholder="https://linkedin.com/in/..." />
            </div>
          </div>
        </div>

        <div className="form-section">
          <h3>Pipeline Info</h3>
          <div className="form-grid">
            <div className="form-group">
              <label>Pipeline Status</label>
              <select name="status" value={form.status} onChange={handleChange}>
                {PIPELINE_STATUSES.map(s => <option key={s} value={s}>{s}</option>)}
              </select>
            </div>
            <div className="form-group">
              <label>Snapshot Tier</label>
              <select name="snapshotTier" value={form.snapshotTier} onChange={handleChange}>
                {SNAPSHOT_TIERS.map(t => <option key={t} value={t}>{t}</option>)}
              </select>
            </div>
            <div className="form-group">
              <label>Source</label>
              <select name="source" value={form.source} onChange={handleChange}>
                {SOURCES.map(s => <option key={s} value={s}>{s}</option>)}
              </select>
            </div>
            <div className="form-group">
              <label className="checkbox-label">
                <input type="checkbox" name="priority" checked={form.priority} onChange={handleChange} />
                Priority Prospect
              </label>
            </div>
          </div>
        </div>

        <div className="form-section">
          <h3>Notes & Next Steps</h3>
          <div className="form-group full-width">
            <label>Why Rooster? (fit notes, signals)</label>
            <textarea name="fitNotes" value={form.fitNotes} onChange={handleChange} rows={4}
              placeholder="What signals make this a good fit? Hiring CSR coordinator, values language without programs, competitor doing impact work..." />
          </div>
          <div className="form-grid">
            <div className="form-group">
              <label>Next Action</label>
              <input name="nextAction" value={form.nextAction} onChange={handleChange} placeholder="e.g. Send cold email" />
            </div>
            <div className="form-group">
              <label>Next Action Date</label>
              <input type="date" name="nextActionDate" value={form.nextActionDate} onChange={handleChange} />
            </div>
          </div>
        </div>

        <div className="form-actions">
          <button type="button" className="btn btn-secondary" onClick={() => navigate(-1)}>Cancel</button>
          <button type="submit" className="btn btn-primary">{isEdit ? 'Save Changes' : 'Add Prospect'}</button>
        </div>
      </form>
    </div>
  )
}
