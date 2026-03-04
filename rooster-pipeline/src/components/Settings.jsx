import { useState } from 'react'
import { getApiKey, setApiKey, hasApiKey } from '../utils/ai'

export default function Settings() {
  const [key, setKey] = useState(getApiKey())
  const [saved, setSaved] = useState(false)
  const [visible, setVisible] = useState(false)

  function handleSave() {
    setApiKey(key)
    setSaved(true)
    setTimeout(() => setSaved(false), 2000)
  }

  function handleClear() {
    setKey('')
    setApiKey('')
    setSaved(false)
  }

  return (
    <div className="settings-page">
      <h2>Settings</h2>

      <div className="settings-section">
        <h3>AI Configuration</h3>
        <p className="settings-desc">
          Add your Anthropic API key to enable AI-powered features: auto-generated research briefs,
          prospect bios, and personalized email copy. Your key is stored locally in your browser only.
        </p>

        <div className="form-group" style={{ maxWidth: 500 }}>
          <label>Anthropic API Key</label>
          <div className="api-key-input-row">
            <input
              type={visible ? 'text' : 'password'}
              value={key}
              onChange={e => setKey(e.target.value)}
              placeholder="sk-ant-..."
              style={{ flex: 1 }}
            />
            <button className="btn btn-sm" onClick={() => setVisible(!visible)}>
              {visible ? 'Hide' : 'Show'}
            </button>
          </div>
        </div>

        <div className="settings-actions">
          <button className="btn btn-primary" onClick={handleSave} disabled={!key.trim()}>
            {saved ? 'Saved!' : 'Save Key'}
          </button>
          {hasApiKey() && (
            <button className="btn btn-danger btn-sm" onClick={handleClear}>
              Remove Key
            </button>
          )}
        </div>

        <div className={`api-status ${hasApiKey() ? 'connected' : 'disconnected'}`}>
          <span className="status-dot" />
          {hasApiKey() ? 'API key configured — AI features enabled' : 'No API key — AI features disabled'}
        </div>
      </div>
    </div>
  )
}
