import { useEffect } from 'react'
import { Routes, Route, useLocation } from 'react-router-dom'
import Layout from './components/Layout.jsx'
import Dashboard from './pages/Dashboard.jsx'
import Simplify from './pages/Simplify.jsx'
import Discover from './pages/Discover.jsx'
import Recommend from './pages/Recommend.jsx'
import AuditTrail from './pages/AuditTrail.jsx'

export default function App() {
  const location = useLocation()

  // On every navigation, jump straight back to the top of the page.
  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'auto' })
  }, [location.key])

  return (
    <Layout>
      {/* key on location.key remounts the page on every navigation — including
          clicking the sidebar link for the page you're already on — so a finished
          analysis resets to its initial state. */}
      <Routes location={location} key={location.key}>
        <Route path="/" element={<Dashboard />} />
        <Route path="/simplify" element={<Simplify />} />
        <Route path="/discover" element={<Discover />} />
        <Route path="/recommend" element={<Recommend />} />
        <Route path="/audit" element={<AuditTrail />} />
      </Routes>
    </Layout>
  )
}
