const STORAGE_KEY = 'rooster_prospects'

function generateId() {
  return Date.now().toString(36) + Math.random().toString(36).slice(2, 8)
}

function loadAll() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY)
    return raw ? JSON.parse(raw) : []
  } catch {
    return []
  }
}

function saveAll(prospects) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(prospects))
}

export function getProspects() {
  return loadAll()
}

export function getProspect(id) {
  return loadAll().find(p => p.id === id) || null
}

export function addProspect(data) {
  const prospects = loadAll()
  const prospect = {
    id: generateId(),
    companyName: data.companyName || '',
    contactName: data.contactName || '',
    contactTitle: data.contactTitle || '',
    contactLinkedIn: data.contactLinkedIn || '',
    contactEmail: data.contactEmail || '',
    companyWebsite: data.companyWebsite || '',
    industry: data.industry || '',
    companySize: data.companySize || 'Unknown',
    source: data.source || 'LinkedIn search',
    snapshotTier: data.snapshotTier || 'Unknown',
    fitNotes: data.fitNotes || '',
    priority: data.priority || false,
    status: data.status || 'Identified',
    outreachLog: data.outreachLog || [],
    aiBio: data.aiBio || '',
    generatedEmail: data.generatedEmail || '',
    nextAction: data.nextAction || '',
    nextActionDate: data.nextActionDate || '',
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  }
  prospects.push(prospect)
  saveAll(prospects)
  return prospect
}

export function updateProspect(id, updates) {
  const prospects = loadAll()
  const idx = prospects.findIndex(p => p.id === id)
  if (idx === -1) return null
  prospects[idx] = { ...prospects[idx], ...updates, updatedAt: new Date().toISOString() }
  saveAll(prospects)
  return prospects[idx]
}

export function deleteProspect(id) {
  const prospects = loadAll().filter(p => p.id !== id)
  saveAll(prospects)
}

export function addOutreachEntry(prospectId, entry) {
  const prospects = loadAll()
  const idx = prospects.findIndex(p => p.id === prospectId)
  if (idx === -1) return null
  const newEntry = {
    id: generateId(),
    date: entry.date || new Date().toISOString().slice(0, 10),
    channel: entry.channel || 'Email',
    messageType: entry.messageType || 'Cold email',
    notes: entry.notes || '',
  }
  prospects[idx].outreachLog.push(newEntry)
  prospects[idx].updatedAt = new Date().toISOString()
  saveAll(prospects)
  return prospects[idx]
}

export function importProspects(data) {
  saveAll(data)
}

export function exportData() {
  return loadAll()
}

export function clearAllData() {
  localStorage.removeItem(STORAGE_KEY)
}
