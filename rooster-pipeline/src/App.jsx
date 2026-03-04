import { useState, useEffect, useCallback } from 'react'
import { Routes, Route, NavLink, useNavigate } from 'react-router-dom'
import Dashboard from './components/Dashboard'
import PipelineBoard from './components/PipelineBoard'
import ProspectList from './components/ProspectList'
import ProspectDetail from './components/ProspectDetail'
import ProspectForm from './components/ProspectForm'
import { getProspects, addProspect, updateProspect, deleteProspect, addOutreachEntry, importProspects as importAll } from './utils/storage'
import { SAMPLE_PROSPECTS } from './data/sampleData'

export default function App() {
  const [prospects, setProspects] = useState([])
  const navigate = useNavigate()

  const reload = useCallback(() => {
    setProspects(getProspects())
  }, [])

  useEffect(() => {
    let data = getProspects()
    if (data.length === 0) {
      // Load sample data on first run
      for (const p of SAMPLE_PROSPECTS) {
        addProspect(p)
      }
      data = getProspects()
    }
    setProspects(data)
  }, [])

  const handleAdd = (data) => {
    const p = addProspect(data)
    reload()
    navigate(`/prospect/${p.id}`)
  }

  const handleUpdate = (id, updates) => {
    updateProspect(id, updates)
    reload()
  }

  const handleDelete = (id) => {
    deleteProspect(id)
    reload()
    navigate('/prospects')
  }

  const handleLogOutreach = (id, entry) => {
    addOutreachEntry(id, entry)
    reload()
  }

  const handleImport = (data) => {
    for (const p of data) {
      addProspect(p)
    }
    reload()
  }

  const handleLoadSampleData = () => {
    for (const p of SAMPLE_PROSPECTS) {
      addProspect(p)
    }
    reload()
  }

  return (
    <div className="app">
      <header className="app-header">
        <div className="header-left">
          <h1 className="logo">
            <span className="logo-icon">🐓</span> Rooster Pipeline
          </h1>
        </div>
        <nav className="main-nav">
          <NavLink to="/" end>Dashboard</NavLink>
          <NavLink to="/pipeline">Pipeline</NavLink>
          <NavLink to="/prospects">All Prospects</NavLink>
          <NavLink to="/add" className="nav-add">+ Add</NavLink>
        </nav>
      </header>

      <main className="app-main">
        <Routes>
          <Route path="/" element={
            <Dashboard prospects={prospects} onUpdate={handleUpdate} />
          } />
          <Route path="/pipeline" element={
            <PipelineBoard prospects={prospects} onUpdate={handleUpdate} />
          } />
          <Route path="/prospects" element={
            <ProspectList
              prospects={prospects}
              onImport={handleImport}
              onLoadSample={handleLoadSampleData}
            />
          } />
          <Route path="/add" element={
            <ProspectForm onSubmit={handleAdd} />
          } />
          <Route path="/prospect/:id" element={
            <ProspectDetail
              prospects={prospects}
              onUpdate={handleUpdate}
              onDelete={handleDelete}
              onLogOutreach={handleLogOutreach}
            />
          } />
          <Route path="/prospect/:id/edit" element={
            <ProspectForm prospects={prospects} onSubmit={handleUpdate} isEdit />
          } />
        </Routes>
      </main>
    </div>
  )
}
