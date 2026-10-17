import { useState } from "react";
import { API_URL } from "./api";

function AuthScreen({ onAuth }){
    const [mode, setMode] = useState("login")
  const [username, setUsername] = useState("")
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [error, setError] = useState("")
  const [loading, setLoading] = useState(false)

  async function post(path, body) {
    const res = await fetch(`${API_URL}${path}`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(body),
    })
    return res
  }

  async function handleSubmit(e) {
    e.preventDefault()
    setError("")
    setLoading(true)
    try {
      if (mode === "signup") {
        const res = await post("/signup", { username, email, password })
        if (res.status === 409) return setError("Username or email already taken")
        if (!res.ok) return setError("Check your details (password needs 8+ characters, valid email)")
      }
      const res = await post("/login", { username, password })
      if (!res.ok) return setError("Invalid username or password")
      const data = await res.json()
      onAuth(data.access_token)
    } catch {
      setError("Couldn't reach the server")
    } finally {
      setLoading(false)
    }
  }

  return (
  <div className="auth-page">
    <div className="auth-hero">
      <div className="auth-logo">Chronicle</div>
      <p className="auth-tagline">Log the books you read. Keep the ones you love.</p>
    </div>

    <form className="auth-card" onSubmit={handleSubmit}>
      <h2>{mode === "login" ? "Welcome back" : "Create your account"}</h2>
      <input value={username} onChange={(e) => setUsername(e.target.value)} placeholder="Username" required />
      {mode === "signup" && (
        <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} placeholder="Email" required />
      )}
      <input type="password" value={password} onChange={(e) => setPassword(e.target.value)} placeholder="Password" required />
      {error && <p className="search-error">{error}</p>}
      <button className="btn-primary" type="submit" disabled={loading}>
        {loading ? "..." : mode === "login" ? "Log in" : "Sign up"}
      </button>
      <button
        type="button"
        className="link-btn"
        onClick={() => { setMode(mode === "login" ? "signup" : "login"); setError("") }}
      >
        {mode === "login" ? "No account? Sign up" : "Have an account? Log in"}
      </button>
    </form>
  </div>
    )
}

export default AuthScreen