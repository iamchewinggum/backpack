 import { useState, useEffect } from 'react'
import './App.css'

function App() { //javascript


//React
  const [tabs, setTabs] = useState([])
  //array destructuring 

  //tabs = current vlaue
  //setTabs = function used to change that value
  // *JavaScript feature

  const [inputUrl, setInputUrl] = useState('')
  //inputUrl --> setInputURL(setter)

  const [token, setToken] = useState(localStorage.getItem('token'))
  //token --> setToken (setter)

  const [showSignup, setShowSignup] = useState(false)
  
  const [authEmail, setAuthEmail] = useState('')
  
  const [authPassword, setAuthPassword] = useState('')



  //functions
  //fetch() is a javaScript function used to communicate over HTTP
  const fetchTabs = () => {
    fetch('http://localhost:3000/backpack', {
      headers: { Authorization: `Bearer ${token}` }
    })
      .then(res => res.json())
      .then(data => setTabs(data))
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
    await fetch('http://localhost:3000/tabs', {
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
    const url = e.dataTransfer.getData('text/uri-list') || e.dataTransfer.getData('text/plain')
    const title = url
    if (url) {
      const newTab = { url, title }
      await saveTabToBackend(newTab)
      fetchTabs()
    }
  }

  const handleDragOver = (e) => {
    e.preventDefault()
  }

  const handleAddUrl = async () => {
    if (inputUrl !== '') {
      const newTab = { url: inputUrl, title: inputUrl }
      await saveTabToBackend(newTab)
      setInputUrl('')
      fetchTabs()
    }
  }

  const handleOpenTab = (tab, tabId) => {
    window.open(tab.url, '_blank')
    fetch(`http://localhost:3000/tabs/${tabId}`, {
      method: 'DELETE',
      headers: { Authorization: `Bearer ${token}` }
    })
    const updatedTabs = tabs.filter((t) => t.id !== tabId)
    setTabs(updatedTabs)
  }





  const handleRemoveTab = (tabId) => {
    fetch(`http://localhost:3000/tabs/${tabId}`, {
      method: 'DELETE',
      headers: { Authorization: `Bearer ${token}` }
    })
    const updatedTabs = tabs.filter((t) => t.id !== tabId)
    setTabs(updatedTabs)
  }







  const handleLogin = async () => {
    const res = await fetch('http://localhost:3000/login', {
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
      alert(data.error || 'Login failed')
    }
  }





//JavaScript making an HTTP request to backend
  const handleSignup = async () => {
    const res = await fetch('http://localhost:3000/signup', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email: authEmail, password: authPassword })
    })
    const data = await res.json()
    if (res.ok) {
      alert('Account created! Please log in.')
      setShowSignup(false)
      setAuthEmail('')
      setAuthPassword('')
    } else {
      alert(data.error || 'Signup failed')
    }
  }











  const handleLogout = () => {
    localStorage.removeItem('token')
    setToken(null)
    setTabs([])
  }

  if (!token) {
    return (

      //JSX
      // special syntax that lets you 
      // describe the UI using HTML like 
      // elements
      <div className="container">
        <h1>Virtual Backpack</h1>
        <h2>{showSignup ? 'Sign Up' : 'Log In'}</h2>
        <input
          type="email"
          placeholder="Email"
          value={authEmail}
          onChange={(e) => setAuthEmail(e.target.value)}
        />
        <input
          type="password"
          placeholder="Password"
          value={authPassword}
          onChange={(e) => setAuthPassword(e.target.value)}
        />
        <button onClick={showSignup ? handleSignup : handleLogin}>
          {showSignup ? 'Sign Up' : 'Log In'}
        </button>
        <p onClick={() => setShowSignup(!showSignup)} style={{ cursor: 'pointer', color: 'blue' }}>
          {showSignup ? 'Already have an account? Log in' : "Don't have an account? Sign up"}
        </p>
      </div>
    )
  }

  return (
    <div className="container">
      <h1>Virtual Backpack</h1>
      <button onClick={handleLogout}>Log Out</button>

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