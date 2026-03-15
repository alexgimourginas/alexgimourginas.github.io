import { useState } from 'react'
import { Link } from 'react-router-dom'
import { ContactModal } from '../components/ContactModal'

export function Home() {
  const [contactOpen, setContactOpen] = useState(false)

  return (
    <>
      <h1>Cyberpunk Alley</h1>
      <p>Landing scene – clickable hotspots will go here.</p>
      <div style={{ display: 'flex', gap: '1rem', flexWrap: 'wrap' }}>
        <Link to="/projects">Projects</Link>
        <Link to="/resume">Resume</Link>
        <Link to="/about">About</Link>
        <button type="button" onClick={() => setContactOpen(true)}>
          Contact
        </button>
      </div>
      <ContactModal isOpen={contactOpen} onClose={() => setContactOpen(false)} />
    </>
  )
}
