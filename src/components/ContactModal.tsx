type ContactModalProps = {
  isOpen: boolean
  onClose: () => void
}

export function ContactModal({ isOpen, onClose }: ContactModalProps) {
  if (!isOpen) return null

  return (
    <div
      style={{
        position: 'fixed',
        inset: 0,
        background: 'rgba(0,0,0,0.6)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        zIndex: 1000,
      }}
      onClick={onClose}
      role="dialog"
      aria-modal="true"
      aria-label="Contact"
    >
      <div
        style={{
          background: '#242424',
          padding: '1.5rem',
          borderRadius: '8px',
          maxWidth: '320px',
        }}
        onClick={(e) => e.stopPropagation()}
      >
        <h2 style={{ marginTop: 0 }}>Contact</h2>
        <p>Placeholder – contact form or links will go here.</p>
        <button type="button" onClick={onClose}>
          Close
        </button>
      </div>
    </div>
  )
}
