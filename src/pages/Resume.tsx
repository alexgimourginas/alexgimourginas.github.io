import { Link } from 'react-router-dom'

export function Resume() {
  return (
    <>
      <h1>Resume</h1>
      <p style={{ marginTop: '2rem' }}>
        <Link to="/">Back to Alley</Link>
      </p>
    </>
  )
}
