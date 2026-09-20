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
  const [editingId, setEditingId] = useState(null)
  const [view, setView] = useState("list")

  useEffect(() => {
    document.documentElement.dataset.theme = theme
    localStorage.setItem("theme", theme)
  }, [theme])

  function handleSubmit(e) {
  e.preventDefault()
  if (editingId !== null) {
    setBooks(books.map((b) =>
      b.id === editingId ? { ...b, title, author, rating, review, dateRead } : b
    ))
    setEditingId(null)
  } else {
    setBooks([...books, { id: Date.now(), title, author, rating, review, dateRead }])
  }
  setTitle("")
  setAuthor("")
  setRating(5)
  setReview("")
  setDateRead("")
}

function handleDelete(id) {
  setBooks(books.filter((b) => b.id !== id))
  if (id === editingId) {
    setEditingId(null)
    setTitle("")
    setAuthor("")
    setRating(5)
    setReview("")
    setDateRead("")
  }
}

function handleEdit(book) {
  setEditingId(book.id)
  setTitle(book.title)
  setAuthor(book.author)
  setRating(book.rating)
  setReview(book.review)
  setDateRead(book.dateRead)
}

  return (
    <>
      <h1>My Bookshelf</h1>
      <button onClick={() => setTheme(theme === "light" ? "dark" : "light")}>
        {theme === "light" ? "Dark mode" : "Light mode"}
      </button>
      <form onSubmit={handleSubmit}>
        <input value={title} onChange={(e) => setTitle(e.target.value)} placeholder="Title" required/>
        <input value={author} onChange={(e) => setAuthor(e.target.value)} placeholder="Author" />
        <input type="number" min="1" max="5" value={rating} onChange={(e) => setRating(Number(e.target.value))} ></input>
        <textarea value={review} onChange={(e) => setReview(e.target.value)} placeholder="Share your thoughts"/>
        <input type="date" value={dateRead} onChange={(e) => setDateRead(e.target.value)} placeholder="Date"/>
        <button type="submit">{editingId !== null ? "Save" : "Add"}</button>
      </form>
      <button onClick={() => setView("list")}>List</button>
      <button onClick={() => setView("grid")}>Grid</button>
      <div className={`books ${view}`}>
      {books.map((book) => (
        <BookCard
          key={book.id}
          title={book.title}
          author={book.author}
          rating={book.rating}
          review={book.review}
          dateRead={book.dateRead}
          onDelete={() => handleDelete(book.id)}
          onEdit={() => handleEdit(book)}
        />
      ))}
      </div>
    </>
  )
}

export default App
