import { useState, useEffect } from 'react'
import './App.css'

function App() {
  const [tabs, setTabs] = useState([])
  const [inputUrl, setInputUrl] = useState('')

  useEffect(() => {
    fetch('http://localhost:3000/backpack')
      .then(res => res.json())
      .then(data => setTabs(data))
  }, [])

  const saveTabToBackend = async (tab) => {
    await fetch('http://localhost:3000/tabs', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(tab)
    })
  }

  const handleDrop = (e) => {
    e.preventDefault()
    const url = e.dataTransfer.getData('text/uri-list') || e.dataTransfer.getData('text/plain')
    const title = url
    if (url) {
      const newTab = { url, title }
      setTabs([...tabs, newTab])
      saveTabToBackend(newTab)
    }
  }

  const handleDragOver = (e) => {
    e.preventDefault()
  }

  const handleAddUrl = () => {
    if (inputUrl !== '') {
      const newTab = { url: inputUrl, title: inputUrl }
      setTabs([...tabs, newTab])
      saveTabToBackend(newTab)
      setInputUrl('')
    }
  }

  return (
    <div className="container">
      <h1>Virtual Backpack</h1>

      <div
        className="drop-zone"
        onDrop={handleDrop}
        onDragOver={handleDragOver}
      >
        <p>Drag your tabs here</p>
      </div>

      <div className="url-input">
        <input
          type="text"
          placeholder="Paste a URL here"
          value={inputUrl}
          onChange={(e) => setInputUrl(e.target.value)}
        />
        <button onClick={handleAddUrl}>Add to Backpack</button>
      </div>

      <div className="backpack-list">
        <h2>Your Backpack</h2>
        {tabs.length === 0 ? (
          <p>No tabs packed yet.</p>
        ) : (
          tabs.map((tab, index) => (
            <div key={index}>
              <a href={tab.url} target="_blank">{tab.title}</a>
            </div>
          ))
        )}
      </div>

    </div>
  )
}

export default App
