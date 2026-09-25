import { useState, useEffect } from 'react'
import './App.css'
import BookCard from './BookCard'

function App() {
  const [theme, setTheme] = useState(() => localStorage.getItem("theme") || "light")
  const [books, setBooks] = useState([])
  const [title, setTitle] = useState("")
  const [author, setAuthor] = useState("")
  const [review, setReview] = useState("")
  const [dateRead, setDateRead] = useState("")
  const [rating, setRating] = useState(5)
  const [status, setStatus] = useState("read")
  const [shelf, setShelf] = useState("read")
  const [editingId, setEditingId] = useState(null)
  const [view, setView] = useState("list")

  useEffect(() => {
    document.documentElement.dataset.theme = theme
    localStorage.setItem("theme", theme)
  }, [theme])

  function resetForm() {
    setEditingId(null)
    setTitle("")
    setAuthor("")
    setRating(5)
    setReview("")
    setDateRead("")
    setStatus(shelf)
  }

  function handleSubmit(e) {
    e.preventDefault()
    const isRead = status === "read"
    const fields = {
      title,
      author,
      status,
      rating: isRead ? rating : null,
      review: isRead ? review : "",
      dateRead: isRead ? dateRead : "",
    }
    if (editingId !== null) {
      setBooks(books.map((b) => (b.id === editingId ? { ...b, ...fields } : b)))
    } else {
      setBooks([...books, { id: Date.now(), ...fields }])
    }
    resetForm()
  }

  function handleDelete(id) {
    setBooks(books.filter((b) => b.id !== id))
    if (id === editingId) resetForm()
  }

  function handleEdit(book) {
    setEditingId(book.id)
    setTitle(book.title)
    setAuthor(book.author)
    setStatus(book.status)
    setRating(book.rating ?? 5)
    setReview(book.review)
    setDateRead(book.dateRead)
  }

  function handleMarkRead(book) {
    handleEdit(book)
    setStatus("read")
  }

  const shelfBooks = books
    .filter((b) => b.status === shelf)
    .sort((a, b) => b.dateRead.localeCompare(a.dateRead))

  return (
    <>
      <h1>My Bookshelf</h1>
      <button onClick={() => setTheme(theme === "light" ? "dark" : "light")}>
        {theme === "light" ? "Dark mode" : "Light mode"}
      </button>

      <form onSubmit={handleSubmit}>
        <select value={status} onChange={(e) => setStatus(e.target.value)}>
          <option value="read">Read</option>
          <option value="want">Want to read</option>
        </select>
        <input value={title} onChange={(e) => setTitle(e.target.value)} placeholder="Title" required />
        <input value={author} onChange={(e) => setAuthor(e.target.value)} placeholder="Author" />
        {status === "read" && (
          <>
            <input
              type="number"
              min="1"
              max="5"
              value={rating}
              onChange={(e) => setRating(Number(e.target.value))}
            />
            <textarea
              value={review}
              onChange={(e) => setReview(e.target.value)}
              placeholder="Share your thoughts"
            />
            <input type="date" value={dateRead} onChange={(e) => setDateRead(e.target.value)} />
          </>
        )}
        <button type="submit">{editingId !== null ? "Save" : "Add"}</button>
      </form>

      <div>
        <button onClick={() => setShelf("read")}>Diary</button>
        <button onClick={() => setShelf("want")}>Readlist</button>
        <button onClick={() => setView("list")}>List</button>
        <button onClick={() => setView("grid")}>Grid</button>
      </div>

      <div className={`books ${view}`}>
        {shelfBooks.map((book) => (
          <BookCard
            key={book.id}
            title={book.title}
            author={book.author}
            status={book.status}
            rating={book.rating}
            review={book.review}
            dateRead={book.dateRead}
            onDelete={() => handleDelete(book.id)}
            onEdit={() => handleEdit(book)}
            onMarkRead={() => handleMarkRead(book)}
          />
        ))}
      </div>
    </>
  )
}

export default App