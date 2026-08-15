import { useState, useEffect } from 'react'
import './App.css'

const API_URL = 'https://backpack-5i7d.onrender.com'

/* ---------- small helpers (plain JavaScript, no React) ---------- */

// people paste "google.com" as often as "https://google.com"
const normalizeUrl = (raw) => {
  const trimmed = raw.trim()
  if (!trimmed) return ''
  return /^https?:\/\//i.test(trimmed) ? trimmed : `https://${trimmed}`
}

const hostOf = (url) => {
  try {
    return new URL(url).hostname.replace(/^www\./, '')
  } catch {
    return url
  }
}

const pathOf = (url) => {
  try {
    const u = new URL(url)
    const rest = u.pathname + u.search
    return rest === '/' ? '' : rest
  } catch {
    return ''
  }
}

// tiny component: site icon, falls back to a letter if the icon won't load
function Favicon({ url }) {
  const [failed, setFailed] = useState(false)
  const host = hostOf(url)

  if (failed || !host) {
    return <span className="favicon favicon--letter">{(host || '?').charAt(0).toUpperCase()}</span>
  }

  return (
    <img
      className="favicon"
      src={`https://www.google.com/s2/favicons?domain=${host}&sz=64`}
      alt=""
      loading="lazy"
      onError={() => setFailed(true)}
    />
  )
}

function App() { //javascript

  //React
  const [tabs, setTabs] = useState([])
  //array destructuring

  //tabs = current value
  //setTabs = function used to change that value
  // *JavaScript feature

  const [inputUrl, setInputUrl] = useState('')
  //inputUrl --> setInputUrl (setter)

  const [token, setToken] = useState(localStorage.getItem('token'))
  //token --> setToken (setter)

  const [showSignup, setShowSignup] = useState(false)
  const [authEmail, setAuthEmail] = useState('')
  const [authPassword, setAuthPassword] = useState('')

  // UI state: inline messages beat alert() boxes
  const [authError, setAuthError] = useState('')
  const [authNotice, setAuthNotice] = useState('')
  const [busy, setBusy] = useState(false)
  const [isDraggingOver, setIsDraggingOver] = useState(false)

  //functions
  //fetch() is a javaScript function used to communicate over HTTP
  const fetchTabs = () => {
    fetch(`${API_URL}/backpack`, {
      headers: { Authorization: `Bearer ${token}` }
    })
      .then(res => res.json())
      .then(data => setTabs(Array.isArray(data) ? data : []))
      .catch(() => setTabs([]))
  }

  useEffect(() => {
    if (!token) return
    fetchTabs()
  }, [token])

  /*
  this is describing an HTTP request
  package that is sending to backend
  Request: Method, Headers, Body

  Method: GET, POST, PUT, PATCH, DELETE, OPTIONS, TRACE, CONNECT
  Body: turns the js object into JSON text
  Headers: Headers are extra information attached to the request.
  */

  const saveTabToBackend = async (tab) => {
    await fetch(`${API_URL}/tabs`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`
      },
      body: JSON.stringify(tab)
    })
  }

  const handleDrop = async (e) => {
    e.preventDefault()
    setIsDraggingOver(false)
    const dropped = e.dataTransfer.getData('text/uri-list') || e.dataTransfer.getData('text/plain')
    const url = normalizeUrl(dropped)
    if (url) {
      await saveTabToBackend({ url, title: url })
      fetchTabs()
    }
  }

  const handleDragOver = (e) => {
    e.preventDefault()
    setIsDraggingOver(true)
  }

  const handleAddUrl = async () => {
    const url = normalizeUrl(inputUrl)
    if (!url) return
    setInputUrl('')
    await saveTabToBackend({ url, title: url })
    fetchTabs()
  }

  const handleOpenTab = (tab, tabId) => {
    window.open(tab.url, '_blank')
    fetch(`${API_URL}/tabs/${tabId}`, {
      method: 'DELETE',
      headers: { Authorization: `Bearer ${token}` }
    })
    setTabs(tabs.filter((t) => t.id !== tabId))
  }

  const handleRemoveTab = (tabId) => {
    fetch(`${API_URL}/tabs/${tabId}`, {
      method: 'DELETE',
      headers: { Authorization: `Bearer ${token}` }
    })
    setTabs(tabs.filter((t) => t.id !== tabId))
  }

  const handleLogin = async () => {
    setAuthError('')
    setAuthNotice('')
    setBusy(true)
    try {
      const res = await fetch(`${API_URL}/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: authEmail, password: authPassword })
      })
      const data = await res.json()
      if (data.token) {
        localStorage.setItem('token', data.token)
        setToken(data.token)
        setAuthEmail('')
        setAuthPassword('')
      } else {
        setAuthError(data.error || 'That email and password don\u2019t match an account.')
      }
    } catch {
      setAuthError('Couldn\u2019t reach the server. Check your connection and try again.')
    } finally {
      setBusy(false)
    }
  }

  //JavaScript making an HTTP request to backend
  const handleSignup = async () => {
    setAuthError('')
    setAuthNotice('')
    setBusy(true)
    try {
      const res = await fetch(`${API_URL}/signup`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: authEmail, password: authPassword })
      })
      const data = await res.json()
      if (res.ok) {
        setShowSignup(false)
        setAuthPassword('')
        setAuthNotice('Account created. Log in to start saving.')
      } else {
        setAuthError(data.error || 'Sign up didn\u2019t go through. Try a different email.')
      }
    } catch {
      setAuthError('Couldn\u2019t reach the server. Check your connection and try again.')
    } finally {
      setBusy(false)
    }
  }

  const handleLogout = () => {
    localStorage.removeItem('token')
    setToken(null)
    setTabs([])
  }

  const submitAuthOnEnter = (e) => {
    if (e.key === 'Enter') showSignup ? handleSignup() : handleLogin()
  }

  /* ---------- signed out ---------- */

  if (!token) {
    return (
      //JSX
      // special syntax that lets you
      // describe the UI using HTML like
      // elements
      <div className="page page--auth">
        <div className="card card--auth">
          <h1 className="wordmark">Backpack</h1>
          <p className="subhead">Save links now, open them later.</p>

          <div className="field">
            <label className="field__label" htmlFor="email">Email</label>
            <input
              id="email"
              type="email"
              autoComplete="email"
              value={authEmail}
              onChange={(e) => setAuthEmail(e.target.value)}
              onKeyDown={submitAuthOnEnter}
            />
          </div>

          <div className="field">
            <label className="field__label" htmlFor="password">Password</label>
            <input
              id="password"
              type="password"
              autoComplete={showSignup ? 'new-password' : 'current-password'}
              value={authPassword}
              onChange={(e) => setAuthPassword(e.target.value)}
              onKeyDown={submitAuthOnEnter}
            />
          </div>

          {authError && <p className="message message--error">{authError}</p>}
          {authNotice && <p className="message message--good">{authNotice}</p>}

          <button
            className="btn btn--primary btn--block"
            onClick={showSignup ? handleSignup : handleLogin}
            disabled={busy}
          >
            {busy ? 'Working\u2026' : showSignup ? 'Create account' : 'Log in'}
          </button>

          <button
            className="btn btn--quiet btn--block"
            onClick={() => { setShowSignup(!showSignup); setAuthError(''); setAuthNotice('') }}
          >
            {showSignup ? 'I already have an account' : 'I need an account'}
          </button>

          <p className="footnote">
            The server sleeps after 15 minutes of quiet. The first log in can take
            30&ndash;50 seconds while it wakes up &mdash; quick after that.
          </p>
        </div>
      </div>
    )
  }

  /* ---------- signed in ---------- */

  return (
    <div className="page">
      <header className="topbar">
        <div>
          <h1 className="wordmark wordmark--sm">Backpack</h1>
          <p className="count">{tabs.length} {tabs.length === 1 ? 'link saved' : 'links saved'}</p>
        </div>
        <button className="btn btn--ghost" onClick={handleLogout}>Log out</button>
      </header>

      <section
        className={isDraggingOver ? 'dropzone dropzone--active' : 'dropzone'}
        onDrop={handleDrop}
        onDragOver={handleDragOver}
        onDragLeave={() => setIsDraggingOver(false)}
      >
        <p className="dropzone__prompt">Drag a tab in here</p>
        <div className="divider"><span>or paste it</span></div>
        <div className="url-input">
          <input
            type="text"
            placeholder="example.com/the-thing-you-need-later"
            value={inputUrl}
            onChange={(e) => setInputUrl(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && handleAddUrl()}
          />
          <button className="btn btn--primary" onClick={handleAddUrl}>Save link</button>
        </div>
      </section>

      <section>
        <h2 className="section-title">Saved</h2>

        {tabs.length === 0 ? (
          <p className="empty">Nothing here yet. Add a link above and it&rsquo;ll wait for you.</p>
        ) : (
          <ul className="list">
            {tabs.map((tab) => (
              <li key={tab.id} className="card tab-item">
                <Favicon url={tab.url} />
                <a className="tab-item__link" href={tab.url} target="_blank" rel="noreferrer">
                  <span className="tab-item__host">{hostOf(tab.url)}</span>
                  <span className="tab-item__path">{pathOf(tab.url)}</span>
                </a>
                <div className="tab-item__actions">
                  <button className="btn btn--primary btn--sm" onClick={() => handleOpenTab(tab, tab.id)}>Open</button>
                  <button className="btn btn--ghost btn--sm" onClick={() => handleRemoveTab(tab.id)}>Remove</button>
                </div>
              </li>
            ))}
          </ul>
        )}

        <p className="tip">Opening a link removes it from the list. Hold <kbd>Ctrl</kbd> while you click to stay on this page.</p>
      </section>
    </div>
  )
}

export default App