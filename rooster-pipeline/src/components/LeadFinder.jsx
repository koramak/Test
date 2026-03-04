import { useState, useCallback } from 'react'
import { hasApiKey, generateBio, generateEmail } from '../utils/ai'
import { COMPANY_SIZES, SOURCES } from '../data/sampleData'

const EMPTY_LEAD = {
  contactName: '',
  contactTitle: '',
  contactEmail: '',
  contactLinkedIn: '',
  companyName: '',
  companyWebsite: '',
  industry: '',
  companySize: 'Unknown',
  source: 'LinkedIn search',
  fitNotes: '',
}

export default function LeadFinder({ prospects, onAdd, onUpdate }) {
  const [tab, setTab] = useState('queue')
  const [form, setForm] = useState({ ...EMPTY_LEAD })
  const [bulkText, setBulkText] = useState('')
  const [showBulk, setShowBulk] = useState(false)

  // Track AI state per prospect id
  const [aiState, setAiState] = useState({})
  // aiState[id] = { loading, bio, email, error, phase }

  const queue = prospects.filter(p => p.status === 'Identified')
  const reviewed = prospects.filter(p => p.status === 'Researched' && p.generatedEmail)

  function updateField(field, value) {
    setForm(f => ({ ...f, [field]: value }))
  }

  function handleQuickAdd(e) {
    e.preventDefault()
    if (!form.companyName.trim() && !form.contactName.trim()) return
    onAdd({
      ...form,
      status: 'Identified',
      priority: false,
      snapshotTier: 'Unknown',
      outreachLog: [],
      nextAction: 'AI Research',
      nextActionDate: '',
    })
    setForm({ ...EMPTY_LEAD })
  }

  function handleBulkAdd() {
    const lines = bulkText.split('\n').filter(l => l.trim())
    for (const line of lines) {
      // Try to parse "Name - Title - Company" or "Company - Name" or just "Company"
      const parts = line.split(/[,\t\-—|]/).map(s => s.trim()).filter(Boolean)
      const lead = { ...EMPTY_LEAD, status: 'Identified' }
      if (parts.length >= 3) {
        lead.contactName = parts[0]
        lead.contactTitle = parts[1]
        lead.companyName = parts[2]
        if (parts[3]) lead.contactLinkedIn = parts[3]
        if (parts[4]) lead.contactEmail = parts[4]
      } else if (parts.length === 2) {
        lead.contactName = parts[0]
        lead.companyName = parts[1]
      } else {
        lead.companyName = parts[0]
      }
      if (lead.companyName) {
        onAdd({
          ...lead,
          priority: false,
          snapshotTier: 'Unknown',
          outreachLog: [],
          nextAction: 'AI Research',
          nextActionDate: '',
        })
      }
    }
    setBulkText('')
    setShowBulk(false)
  }

  const handleApprove = useCallback(async (prospect) => {
    if (!hasApiKey()) {
      setAiState(s => ({ ...s, [prospect.id]: { error: 'No API key. Go to Settings to add your Anthropic API key.', loading: false } }))
      return
    }

    setAiState(s => ({ ...s, [prospect.id]: { loading: true, phase: 'bio', bio: null, email: null, error: null } }))

    try {
      // Step 1: Generate bio
      const bio = await generateBio(prospect)
      setAiState(s => ({ ...s, [prospect.id]: { ...s[prospect.id], bio, phase: 'email' } }))

      // Step 2: Generate email (no user interaction needed)
      const emailText = await generateEmail(prospect, bio)
      setAiState(s => ({ ...s, [prospect.id]: { ...s[prospect.id], email: emailText, loading: false, phase: 'done' } }))

      // Step 3: Update prospect in storage
      onUpdate(prospect.id, {
        status: 'Researched',
        aiBio: bio,
        generatedEmail: emailText,
        fitNotes: prospect.fitNotes ? `${prospect.fitNotes}\n\n--- AI Brief ---\n${bio}` : bio,
        nextAction: 'Review & send email',
        nextActionDate: new Date().toISOString().slice(0, 10),
      })
    } catch (err) {
      setAiState(s => ({ ...s, [prospect.id]: { ...s[prospect.id], loading: false, error: err.message } }))
    }
  }, [onUpdate])

  function handleSkip(prospect) {
    onUpdate(prospect.id, { status: 'Not a Fit', nextAction: '', nextActionDate: '' })
  }

  function handleGenerateBioOnly(prospect) {
    if (!hasApiKey()) {
      setAiState(s => ({ ...s, [prospect.id]: { error: 'No API key. Go to Settings to add your Anthropic API key.', loading: false } }))
      return
    }
    setAiState(s => ({ ...s, [prospect.id]: { loading: true, phase: 'bio', bio: null, email: null, error: null } }))
    generateBio(prospect)
      .then(bio => {
        setAiState(s => ({ ...s, [prospect.id]: { ...s[prospect.id], bio, loading: false, phase: 'preview' } }))
      })
      .catch(err => {
        setAiState(s => ({ ...s, [prospect.id]: { ...s[prospect.id], loading: false, error: err.message } }))
      })
  }

  function copyToClipboard(text) {
    navigator.clipboard.writeText(text)
  }

  const ai = (id) => aiState[id] || {}

  return (
    <div className="lead-finder">
      <div className="lf-header">
        <h2>Lead Discovery</h2>
        <div className="lf-tabs">
          <button className={`lf-tab ${tab === 'queue' ? 'active' : ''}`} onClick={() => setTab('queue')}>
            Review Queue {queue.length > 0 && <span className="lf-badge">{queue.length}</span>}
          </button>
          <button className={`lf-tab ${tab === 'add' ? 'active' : ''}`} onClick={() => setTab('add')}>
            Add Leads
          </button>
          <button className={`lf-tab ${tab === 'ready' ? 'active' : ''}`} onClick={() => setTab('ready')}>
            Ready to Send {reviewed.length > 0 && <span className="lf-badge">{reviewed.length}</span>}
          </button>
        </div>
      </div>

      {/* ===== ADD TAB ===== */}
      {tab === 'add' && (
        <div className="lf-add-section">
          <div className="lf-quick-add">
            <h3>Quick Add</h3>
            <form onSubmit={handleQuickAdd} className="qa-form">
              <div className="qa-row">
                <input placeholder="Contact name" value={form.contactName} onChange={e => updateField('contactName', e.target.value)} />
                <input placeholder="Title" value={form.contactTitle} onChange={e => updateField('contactTitle', e.target.value)} />
              </div>
              <div className="qa-row">
                <input placeholder="Company name *" value={form.companyName} onChange={e => updateField('companyName', e.target.value)} />
                <input placeholder="Industry" value={form.industry} onChange={e => updateField('industry', e.target.value)} />
              </div>
              <div className="qa-row">
                <input placeholder="LinkedIn URL" value={form.contactLinkedIn} onChange={e => updateField('contactLinkedIn', e.target.value)} />
                <input placeholder="Email" value={form.contactEmail} onChange={e => updateField('contactEmail', e.target.value)} />
              </div>
              <div className="qa-row">
                <input placeholder="Company website" value={form.companyWebsite} onChange={e => updateField('companyWebsite', e.target.value)} />
                <select value={form.companySize} onChange={e => updateField('companySize', e.target.value)}>
                  {COMPANY_SIZES.map(s => <option key={s} value={s}>{s}</option>)}
                </select>
                <select value={form.source} onChange={e => updateField('source', e.target.value)}>
                  {SOURCES.map(s => <option key={s} value={s}>{s}</option>)}
                </select>
              </div>
              <div className="qa-row">
                <textarea
                  placeholder="Quick notes — why might they be a fit?"
                  value={form.fitNotes}
                  onChange={e => updateField('fitNotes', e.target.value)}
                  rows={2}
                />
              </div>
              <div className="qa-actions">
                <button type="submit" className="btn btn-primary">Add to Queue</button>
                <button type="button" className="btn btn-secondary" onClick={() => setShowBulk(!showBulk)}>
                  {showBulk ? 'Hide Bulk Add' : 'Bulk Add'}
                </button>
              </div>
            </form>
          </div>

          {showBulk && (
            <div className="lf-bulk">
              <h3>Bulk Add</h3>
              <p className="settings-desc">Paste one lead per line. Format: Name, Title, Company, LinkedIn URL, Email (comma or tab separated). Minimum: just a company name.</p>
              <textarea
                value={bulkText}
                onChange={e => setBulkText(e.target.value)}
                rows={8}
                placeholder={`Sarah Chen, VP People, Acme Corp, https://linkedin.com/in/sarachen, sarah@acme.com\nJohn Doe, Director CSR, Beta Inc\nGamma LLC`}
              />
              <button className="btn btn-primary" onClick={handleBulkAdd} disabled={!bulkText.trim()}>
                Add {bulkText.split('\n').filter(l => l.trim()).length} Lead{bulkText.split('\n').filter(l => l.trim()).length !== 1 ? 's' : ''}
              </button>
            </div>
          )}
        </div>
      )}

      {/* ===== REVIEW QUEUE ===== */}
      {tab === 'queue' && (
        <div className="lf-queue">
          {!hasApiKey() && (
            <div className="lf-warning">
              AI features require an API key. Go to <strong>Settings</strong> to add your Anthropic API key.
            </div>
          )}

          {queue.length === 0 ? (
            <div className="lf-empty">
              <p>No leads in the review queue.</p>
              <p>Add leads from the <button className="link-btn" onClick={() => setTab('add')}>Add Leads</button> tab to get started.</p>
            </div>
          ) : (
            <div className="lf-cards">
              {queue.map(prospect => {
                const state = ai(prospect.id)
                return (
                  <div key={prospect.id} className="lf-card">
                    <div className="lf-card-header">
                      <div className="lf-card-info">
                        <h4>{prospect.contactName || prospect.companyName}</h4>
                        {prospect.contactName && <span className="lf-company">{prospect.contactTitle ? `${prospect.contactTitle} at ` : ''}{prospect.companyName}</span>}
                        <div className="lf-card-meta">
                          {prospect.industry && <span className="lf-meta-tag">{prospect.industry}</span>}
                          {prospect.companySize !== 'Unknown' && <span className="lf-meta-tag">{prospect.companySize}</span>}
                          {prospect.source && <span className="lf-meta-tag">{prospect.source}</span>}
                        </div>
                      </div>
                      <div className="lf-card-links">
                        {prospect.contactLinkedIn && (
                          <a href={prospect.contactLinkedIn} target="_blank" rel="noopener noreferrer" className="lf-link linkedin">
                            LinkedIn
                          </a>
                        )}
                        {prospect.contactEmail && (
                          <span className="lf-link email">{prospect.contactEmail}</span>
                        )}
                        {prospect.companyWebsite && (
                          <a href={prospect.companyWebsite} target="_blank" rel="noopener noreferrer" className="lf-link website">
                            Website
                          </a>
                        )}
                      </div>
                    </div>

                    {prospect.fitNotes && !state.bio && (
                      <div className="lf-notes">{prospect.fitNotes}</div>
                    )}

                    {/* AI Bio */}
                    {state.bio && (
                      <div className="lf-bio">
                        <div className="lf-bio-label">AI Research Brief</div>
                        <div className="lf-bio-text">{state.bio}</div>
                      </div>
                    )}

                    {/* AI Email */}
                    {state.email && (
                      <div className="lf-email-result">
                        <div className="lf-bio-label">Generated Email</div>
                        <pre className="lf-email-text">{state.email}</pre>
                        <button className="btn btn-sm btn-primary" onClick={() => copyToClipboard(state.email)}>
                          Copy Email
                        </button>
                      </div>
                    )}

                    {/* Error */}
                    {state.error && (
                      <div className="lf-error">{state.error}</div>
                    )}

                    {/* Loading */}
                    {state.loading && (
                      <div className="lf-loading">
                        <div className="lf-spinner" />
                        {state.phase === 'bio' ? 'Researching prospect...' : 'Crafting email copy...'}
                      </div>
                    )}

                    {/* Actions */}
                    {!state.loading && state.phase !== 'done' && (
                      <div className="lf-card-actions">
                        {!state.bio && (
                          <button className="btn btn-secondary btn-sm" onClick={() => handleGenerateBioOnly(prospect)} disabled={!hasApiKey()}>
                            Preview Brief
                          </button>
                        )}
                        <button className="btn btn-primary" onClick={() => handleApprove(prospect)} disabled={!hasApiKey()}>
                          {state.bio ? 'Approve & Generate Email' : 'Approve — Research & Draft Email'}
                        </button>
                        <button className="btn btn-sm" onClick={() => handleSkip(prospect)}>
                          Skip
                        </button>
                      </div>
                    )}

                    {state.phase === 'done' && (
                      <div className="lf-done-msg">Moved to pipeline as "Researched" — email ready to send</div>
                    )}
                  </div>
                )
              })}
            </div>
          )}
        </div>
      )}

      {/* ===== READY TO SEND ===== */}
      {tab === 'ready' && (
        <div className="lf-ready">
          {reviewed.length === 0 ? (
            <div className="lf-empty">
              <p>No emails ready yet. Approve leads from the Review Queue to generate emails.</p>
            </div>
          ) : (
            <div className="lf-ready-list">
              {reviewed.map(prospect => (
                <div key={prospect.id} className="lf-ready-card">
                  <div className="lf-ready-header">
                    <div>
                      <h4>{prospect.contactName || prospect.companyName}</h4>
                      {prospect.contactName && <span className="lf-company">{prospect.contactTitle ? `${prospect.contactTitle} at ` : ''}{prospect.companyName}</span>}
                    </div>
                    <div className="lf-card-links">
                      {prospect.contactLinkedIn && (
                        <a href={prospect.contactLinkedIn} target="_blank" rel="noopener noreferrer" className="lf-link linkedin">LinkedIn</a>
                      )}
                      {prospect.contactEmail && (
                        <span className="lf-link email">{prospect.contactEmail}</span>
                      )}
                    </div>
                  </div>
                  {prospect.aiBio && (
                    <details className="lf-brief-toggle">
                      <summary>View Research Brief</summary>
                      <div className="lf-bio-text">{prospect.aiBio}</div>
                    </details>
                  )}
                  <pre className="lf-email-text">{prospect.generatedEmail}</pre>
                  <div className="lf-ready-actions">
                    <button className="btn btn-primary btn-sm" onClick={() => copyToClipboard(prospect.generatedEmail)}>
                      Copy Email
                    </button>
                    <button className="btn btn-secondary btn-sm" onClick={() => {
                      const lines = (prospect.generatedEmail || '').split('\n')
                      const subjectLine = lines.find(l => l.startsWith('Subject:'))
                      const subject = subjectLine ? subjectLine.replace('Subject:', '').trim() : ''
                      const body = lines.filter(l => !l.startsWith('Subject:')).join('\n').trim()
                      window.open(`https://mail.google.com/mail/?view=cm&fs=1&su=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}${prospect.contactEmail ? `&to=${encodeURIComponent(prospect.contactEmail)}` : ''}`, '_blank')
                    }}>
                      Open in Gmail
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  )
}
