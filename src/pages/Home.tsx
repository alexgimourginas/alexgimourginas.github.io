import { useState } from 'react'
import { Link } from 'react-router-dom'
import { ContactModal } from '../components/ContactModal'
import './Home.css'

export function Home() {
  const [contactOpen, setContactOpen] = useState(false)

  return (
    <>
      <div className="home-scene">
        {/* Resume – left */}
        <Link
          to="/resume"
          className="home-hotspot"
          style={{
            left: '8%',
            top: '50%',
            transform: 'translateY(-50%)',
          }}
        >
          Resume
        </Link>

        {/* Projects – higher up, slightly right */}
        <Link
          to="/projects"
          className="home-hotspot"
          style={{
            left: '62%',
            top: '22%',
            transform: 'translateX(-50%)',
          }}
        >
          Projects
        </Link>

        {/* About – right */}
        <Link
          to="/about"
          className="home-hotspot"
          style={{
            right: '10%',
            top: '48%',
          }}
        >
          About
        </Link>

        {/* Contact – lower, a bit left */}
        <button
          type="button"
          className="home-hotspot button"
          onClick={() => setContactOpen(true)}
          style={{
            left: '42%',
            bottom: '18%',
          }}
        >
          Contact
        </button>
      </div>

      <ContactModal isOpen={contactOpen} onClose={() => setContactOpen(false)} />
    </>
  )
}
