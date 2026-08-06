import { useState, useEffect } from 'react'
import './App.css'

function App() {
  const [tabs, setTabs] = useState([])
  const [inputUrl, setInputUrl] = useState('')
  const [token, setToken] = useState(localStorage.getItem('token')) // 🆕
  const [showSignup, setShowSignup] = useState(false) // 🆕
  const [authEmail, setAuthEmail] = useState('') // 🆕
  const [authPassword, setAuthPassword] = useState('') // 🆕

  useEffect(() => {
    if (!token) return // 🆕 don't fetch if not logged in
    fetch('http://localhost:3000/backpack', {
      headers: { Authorization: `Bearer ${token}` } // 🆕 send token with request
    })
      .then(res => res.json())
      .then(data => setTabs(data))
  }, [token]) // 🆕 re-runs when token changes

  const saveTabToBackend = async (tab) => {
    await fetch('http://localhost:3000/tabs', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}` // 🆕 send token with request
      },
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

  const handleOpenTab = (tab, tabId) => {
    window.open(tab.url, '_blank')
    fetch(`http://localhost:3000/tabs/${tabId}`, {
      method: 'DELETE',
      headers: { Authorization: `Bearer ${token}` } // 🆕 send token with request
    })
    const updatedTabs = tabs.filter((t) => t.id !== tabId)
    setTabs(updatedTabs)
  }

  const handleRemoveTab = (tabId) => {
    fetch(`http://localhost:3000/tabs/${tabId}`, {
      method: 'DELETE',
      headers: { Authorization: `Bearer ${token}` } // 🆕 send token with request
    })
    const updatedTabs = tabs.filter((t) => t.id !== tabId)
    setTabs(updatedTabs)
  }

  const handleLogin = async () => { // 🆕
    const res = await fetch('http://localhost:3000/login', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email: authEmail, password: authPassword })
    })
    const data = await res.json()
    if (data.token) {
      localStorage.setItem('token', data.token) // 🆕 save token to localStorage
      setToken(data.token) // 🆕 update state so app re-renders
      setAuthEmail('') // 🆕 clear form
      setAuthPassword('') // 🆕 clear form
    } else {
      alert(data.error || 'Login failed') // 🆕
    }
  }

  const handleSignup = async () => { // 🆕
    const res = await fetch('http://localhost:3000/signup', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email: authEmail, password: authPassword })
    })
    const data = await res.json()
    if (res.ok) {
      alert('Account created! Please log in.') // 🆕
      setShowSignup(false) // 🆕 switch back to login form
      setAuthEmail('') // 🆕
      setAuthPassword('') // 🆕
    } else {
      alert(data.error || 'Signup failed') // 🆕
    }
  }

  const handleLogout = () => { // 🆕
    localStorage.removeItem('token') // 🆕 remove token from localStorage
    setToken(null) // 🆕 clear token from state
    setTabs([]) // 🆕 clear tabs from state
  }

  if (!token) { // 🆕 show login/signup form if not logged in
    return (
      <div className="container">
        <h1>Virtual Backpack</h1>
        <h2>{showSignup ? 'Sign Up' : 'Log In'}</h2> {/* 🆕 */}
        <input
          type="email"
          placeholder="Email"
          value={authEmail}
          onChange={(e) => setAuthEmail(e.target.value)}
        /> {/* 🆕 */}
        <input
          type="password"
          placeholder="Password"
          value={authPassword}
          onChange={(e) => setAuthPassword(e.target.value)}
        /> {/* 🆕 */}
        <button onClick={showSignup ? handleSignup : handleLogin}>
          {showSignup ? 'Sign Up' : 'Log In'}
        </button> {/* 🆕 */}
        <p onClick={() => setShowSignup(!showSignup)} style={{ cursor: 'pointer', color: 'blue' }}>
          {showSignup ? 'Already have an account? Log in' : "Don't have an account? Sign up"}
        </p> {/* 🆕 */}
      </div>
    )
  }

  return (
    <div className="container">
      <h1>Virtual Backpack</h1>
      <button onClick={handleLogout}>Log Out</button> {/* 🆕 */}

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

      <p className="tip">💡 Hold <strong>Ctrl</strong> and click <strong>Open</strong> to stay on this page while your tabs open.</p>

      <div className="backpack-list">
        <h2>Your Backpack</h2>
        {tabs.length === 0 ? (
          <p>No tabs packed yet.</p>
        ) : (
          tabs.map((tab, index) => (
            <div key={index} className="tab-item">
              <a href={tab.url} target="_blank" rel="noreferrer">{tab.url}</a>
              <button onClick={() => handleOpenTab(tab, tab.id)}>Open</button>
              <button onClick={() => handleRemoveTab(tab.id)}>Remove</button>
            </div>
          ))
        )}
      </div>
    </div>
  )
}

export default App