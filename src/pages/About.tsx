import { Link } from 'react-router-dom'

export function About() {
  return (
    <>
      <h1>About</h1>
      <p style={{ marginTop: '2rem' }}>
        <Link to="/">Back to Alley</Link>
      </p>
    </>
  )
}
