import { useState, useCallback } from 'react'
import { hasApiKey, generateBio, generateEmail, generateLeads, refineEmail } from '../utils/ai'
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
  const [tab, setTab] = useState('discover')
  const [form, setForm] = useState({ ...EMPTY_LEAD })
  const [bulkText, setBulkText] = useState('')
  const [showBulk, setShowBulk] = useState(false)

  // AI Discovery state
  const [discoverFocus, setDiscoverFocus] = useState('')
  const [discoverLoading, setDiscoverLoading] = useState(false)
  const [discoverResults, setDiscoverResults] = useState([])
  const [discoverError, setDiscoverError] = useState(null)

  // Track AI state per prospect id
  const [aiState, setAiState] = useState({})
  // aiState[id] = { loading, bio, email, error, phase }

  // Track refine (Edit with AI) state per prospect id
  const [refineState, setRefineState] = useState({})
  // refineState[id] = { open, feedback, loading, error }

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

  async function handleDiscover() {
    if (!hasApiKey()) {
      setDiscoverError('No API key. Go to Settings to add your Anthropic API key.')
      return
    }
    setDiscoverLoading(true)
    setDiscoverError(null)
    setDiscoverResults([])
    try {
      const leads = await generateLeads(discoverFocus)
      setDiscoverResults(leads)
    } catch (err) {
      setDiscoverError(err.message)
    } finally {
      setDiscoverLoading(false)
    }
  }

  function handleAddDiscoveredLead(lead, index) {
    onAdd({
      ...EMPTY_LEAD,
      ...lead,
      status: 'Identified',
      priority: false,
      snapshotTier: 'Unknown',
      outreachLog: [],
      nextAction: 'AI Research',
      nextActionDate: '',
    })
    setDiscoverResults(prev => prev.filter((_, i) => i !== index))
  }

  function handleAddAllDiscovered() {
    for (const lead of discoverResults) {
      onAdd({
        ...EMPTY_LEAD,
        ...lead,
        status: 'Identified',
        priority: false,
        snapshotTier: 'Unknown',
        outreachLog: [],
        nextAction: 'AI Research',
        nextActionDate: '',
      })
    }
    setDiscoverResults([])
  }

  const handleApprove = useCallback(async (prospect) => {
    if (!hasApiKey()) {
      setAiState(s => ({ ...s, [prospect.id]: { error: 'No API key. Go to Settings to add your Anthropic API key.', loading: false } }))
      return
    }

    setAiState(s => ({ ...s, [prospect.id]: { loading: true, phase: 'bio', bio: null, email: null, error: null } }))

    try {
      // Step 1: Generate bio (also identifies contact if missing)
      const bio = await generateBio(prospect)
      setAiState(s => ({ ...s, [prospect.id]: { ...s[prospect.id], bio, phase: 'email' } }))

      // Step 1.5: Parse contact info from bio if we're missing it
      const contactUpdates = {}
      if (!prospect.contactName || prospect.contactName === 'Unknown') {
        const nameMatch = bio.match(/RECOMMENDED CONTACT:\s*([^,\n]+),\s*([^\n]+)/)
        if (nameMatch) {
          contactUpdates.contactName = nameMatch[1].trim()
          contactUpdates.contactTitle = nameMatch[2].trim()
        }
      }
      if (!prospect.contactEmail) {
        const emailMatch = bio.match(/EMAIL:\s*([^\s\n]+@[^\s\n]+)/)
        if (emailMatch) {
          contactUpdates.contactEmail = emailMatch[1].trim()
        }
      }
      if (!prospect.contactLinkedIn) {
        const linkedInMatch = bio.match(/LINKEDIN:\s*(https?:\/\/[^\s\n]+)/)
        if (linkedInMatch) {
          contactUpdates.contactLinkedIn = linkedInMatch[1].trim()
        }
      }

      // Apply contact updates immediately so the email step uses them
      if (Object.keys(contactUpdates).length > 0) {
        onUpdate(prospect.id, contactUpdates)
      }
      const enrichedProspect = { ...prospect, ...contactUpdates }

      // Step 2: Generate email using enriched prospect
      const emailText = await generateEmail(enrichedProspect, bio)
      setAiState(s => ({ ...s, [prospect.id]: { ...s[prospect.id], email: emailText, loading: false, phase: 'done' } }))

      // Step 3: Update prospect in storage
      onUpdate(prospect.id, {
        ...contactUpdates,
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
        // Parse contact info from bio if missing
        const contactUpdates = {}
        if (!prospect.contactName || prospect.contactName === 'Unknown') {
          const nameMatch = bio.match(/RECOMMENDED CONTACT:\s*([^,\n]+),\s*([^\n]+)/)
          if (nameMatch) {
            contactUpdates.contactName = nameMatch[1].trim()
            contactUpdates.contactTitle = nameMatch[2].trim()
          }
        }
        if (!prospect.contactEmail) {
          const emailMatch = bio.match(/EMAIL:\s*([^\s\n]+@[^\s\n]+)/)
          if (emailMatch) contactUpdates.contactEmail = emailMatch[1].trim()
        }
        if (!prospect.contactLinkedIn) {
          const linkedInMatch = bio.match(/LINKEDIN:\s*(https?:\/\/[^\s\n]+)/)
          if (linkedInMatch) contactUpdates.contactLinkedIn = linkedInMatch[1].trim()
        }
        if (Object.keys(contactUpdates).length > 0) {
          onUpdate(prospect.id, contactUpdates)
        }
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
  const rf = (id) => refineState[id] || {}

  function toggleRefine(id) {
    setRefineState(s => ({
      ...s,
      [id]: { open: !s[id]?.open, feedback: s[id]?.feedback || '', loading: false, error: null }
    }))
  }

  async function handleRefineEmail(prospect) {
    const rs = refineState[prospect.id]
    if (!rs?.feedback?.trim()) return

    setRefineState(s => ({
      ...s,
      [prospect.id]: { ...s[prospect.id], loading: true, error: null }
    }))

    try {
      const currentEmail = prospect.generatedEmail || ai(prospect.id).email
      const revised = await refineEmail(currentEmail, rs.feedback.trim(), prospect)

      setAiState(s => ({
        ...s,
        [prospect.id]: { ...s[prospect.id], email: revised }
      }))
      onUpdate(prospect.id, { generatedEmail: revised })

      setRefineState(s => ({
        ...s,
        [prospect.id]: { open: false, feedback: '', loading: false, error: null }
      }))
    } catch (err) {
      setRefineState(s => ({
        ...s,
        [prospect.id]: { ...s[prospect.id], loading: false, error: err.message }
      }))
    }
  }

  return (
    <div className="lead-finder">
      <div className="lf-header">
        <h2>Lead Discovery</h2>
        <div className="lf-tabs">
          <button className={`lf-tab ${tab === 'discover' ? 'active' : ''}`} onClick={() => setTab('discover')}>
            AI Search
          </button>
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

      {/* ===== AI DISCOVER TAB ===== */}
      {tab === 'discover' && (
        <div className="lf-discover">
          <div className="lf-discover-header">
            <h3>AI Lead Discovery</h3>
            <p className="settings-desc">
              Generate 10 leads matching Rooster's ideal customer profile — mid-size companies showing early social impact interest without a mature CSR program.
            </p>
          </div>

          <div className="lf-discover-controls">
            <input
              type="text"
              placeholder="Optional focus — e.g. 'fintech in NYC', 'healthcare companies hiring CPO', 'retail brands post-rebrand'"
              value={discoverFocus}
              onChange={e => setDiscoverFocus(e.target.value)}
              className="lf-discover-input"
            />
            <button
              className="btn btn-primary"
              onClick={handleDiscover}
              disabled={discoverLoading || !hasApiKey()}
            >
              {discoverLoading ? 'Searching...' : 'Find 10 Leads'}
            </button>
          </div>

          {!hasApiKey() && (
            <div className="lf-warning">
              AI features require an API key. Go to <strong>Settings</strong> to add your Anthropic API key.
            </div>
          )}

          {discoverLoading && (
            <div className="lf-loading">
              <div className="lf-spinner" />
              Searching for prospects matching Rooster's ICP...
            </div>
          )}

          {discoverError && (
            <div className="lf-error">{discoverError}</div>
          )}

          {discoverResults.length > 0 && (
            <div className="lf-discover-results">
              <div className="lf-discover-results-header">
                <span>{discoverResults.length} lead{discoverResults.length !== 1 ? 's' : ''} found</span>
                <button className="btn btn-primary btn-sm" onClick={handleAddAllDiscovered}>
                  Add All to Queue
                </button>
              </div>
              <div className="lf-cards">
                {discoverResults.map((lead, i) => (
                  <div key={i} className="lf-card">
                    <div className="lf-card-header">
                      <div className="lf-card-info">
                        <h4>{lead.contactName}</h4>
                        <span className="lf-company">{lead.contactTitle} at {lead.companyName}</span>
                        <div className="lf-card-meta">
                          {lead.industry && <span className="lf-meta-tag">{lead.industry}</span>}
                          {lead.companySize && <span className="lf-meta-tag">{lead.companySize}</span>}
                          <span className="lf-meta-tag">AI Discovery</span>
                        </div>
                      </div>
                      <div className="lf-card-links">
                        {lead.companyWebsite && (
                          <a href={lead.companyWebsite} target="_blank" rel="noopener noreferrer" className="lf-link website">
                            Website
                          </a>
                        )}
                      </div>
                    </div>
                    {lead.fitNotes && (
                      <div className="lf-notes">{lead.fitNotes}</div>
                    )}
                    <div className="lf-card-actions">
                      <button className="btn btn-primary btn-sm" onClick={() => handleAddDiscoveredLead(lead, i)}>
                        Add to Queue
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      )}

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
                        <div className="lf-email-actions">
                          <button className="btn btn-sm btn-primary" onClick={() => copyToClipboard(state.email)}>
                            Copy Email
                          </button>
                          <button className="btn btn-sm btn-secondary" onClick={() => toggleRefine(prospect.id)}>
                            {rf(prospect.id).open ? 'Cancel' : 'Edit with AI'}
                          </button>
                        </div>
                        {rf(prospect.id).open && (
                          <div className="lf-refine">
                            <div className="lf-refine-input-row">
                              <input
                                type="text"
                                className="lf-refine-input"
                                placeholder="e.g. make the opener shorter, mention their recent acquisition..."
                                value={rf(prospect.id).feedback || ''}
                                onChange={e => setRefineState(s => ({
                                  ...s,
                                  [prospect.id]: { ...s[prospect.id], feedback: e.target.value }
                                }))}
                                disabled={rf(prospect.id).loading}
                                onKeyDown={e => { if (e.key === 'Enter') handleRefineEmail(prospect) }}
                              />
                              <button
                                className="btn btn-sm btn-primary"
                                onClick={() => handleRefineEmail(prospect)}
                                disabled={rf(prospect.id).loading || !rf(prospect.id).feedback?.trim()}
                              >
                                {rf(prospect.id).loading ? 'Refining...' : 'Refine'}
                              </button>
                            </div>
                            {rf(prospect.id).loading && (
                              <div className="lf-loading" style={{ marginTop: '8px' }}>
                                <div className="lf-spinner" />
                                Thinking and revising email...
                              </div>
                            )}
                            {rf(prospect.id).error && (
                              <div className="lf-error">{rf(prospect.id).error}</div>
                            )}
                          </div>
                        )}
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
                  <div className="lf-email-actions" style={{ marginBottom: '10px' }}>
                    <button className="btn btn-sm btn-secondary" onClick={() => toggleRefine(prospect.id)}>
                      {rf(prospect.id).open ? 'Cancel' : 'Edit with AI'}
                    </button>
                  </div>
                  {rf(prospect.id).open && (
                    <div className="lf-refine" style={{ marginBottom: '10px' }}>
                      <div className="lf-refine-input-row">
                        <input
                          type="text"
                          className="lf-refine-input"
                          placeholder="e.g. make the opener shorter, mention their recent acquisition..."
                          value={rf(prospect.id).feedback || ''}
                          onChange={e => setRefineState(s => ({
                            ...s,
                            [prospect.id]: { ...s[prospect.id], feedback: e.target.value }
                          }))}
                          disabled={rf(prospect.id).loading}
                          onKeyDown={e => { if (e.key === 'Enter') handleRefineEmail(prospect) }}
                        />
                        <button
                          className="btn btn-sm btn-primary"
                          onClick={() => handleRefineEmail(prospect)}
                          disabled={rf(prospect.id).loading || !rf(prospect.id).feedback?.trim()}
                        >
                          {rf(prospect.id).loading ? 'Refining...' : 'Refine'}
                        </button>
                      </div>
                      {rf(prospect.id).loading && (
                        <div className="lf-loading" style={{ marginTop: '8px' }}>
                          <div className="lf-spinner" />
                          Thinking and revising email...
                        </div>
                      )}
                      {rf(prospect.id).error && (
                        <div className="lf-error">{rf(prospect.id).error}</div>
                      )}
                    </div>
                  )}
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
