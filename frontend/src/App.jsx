import { useState, useEffect } from 'react'
import './App.css'
import BookCard from './BookCard'

const monthNames = ["JANUARY","FEBRUARY","MARCH","APRIL","MAY","JUNE","JULY","AUGUST","SEPTEMBER","OCTOBER","NOVEMBER","DECEMBER"]

function groupDiaryByMonth(books) {
  const groups = {}
  books.forEach((book) => {
    if (!book.dateRead) return
    const [year, month, day] = book.dateRead.split("-")
    const key = `${year}-${month}`
    if (!groups[key]) groups[key] = {}
    if (!groups[key][day]) groups[key][day] = []
    groups[key][day].push(book)
  })

  return Object.keys(groups)
    .sort((a, b) => b.localeCompare(a))
    .map((key) => {
      const [year, month] = key.split("-")
      const days = Object.keys(groups[key])
        .sort((a, b) => b.localeCompare(a))
        .map((day) => ({ day, entries: groups[key][day] }))
      return { label: `${monthNames[Number(month) - 1]} ${year}`, days }
    })
}

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
  const [query, setQuery] = useState("")
  const [results, setResults] = useState([])
  const [searching, setSearching] = useState(false)
  const [searchError, setSearchError] = useState("")
  const [coverUrl, setCoverUrl] = useState("")

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
    setCoverUrl("")
  }

  function handleSubmit(e) {
    e.preventDefault()
    const isRead = status === "read"
    const fields = {
      title,
      author,
      status,
      coverUrl,
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
    setCoverUrl(book.coverUrl || "")
  }

  function handleMarkRead(book) {
    handleEdit(book)
    setStatus("read")
  }  

  async function handleSearch(e) {
    e.preventDefault()
    if (!query.trim()) return

    setSearching(true)
    setSearchError("")

    try {
      const response = await fetch(`https://openlibrary.org/search.json?q=${encodeURIComponent(query)}`)
      if (!response.ok) throw new Error("Search failed")
      const data = await response.json()
      setResults(data.docs.slice(0, 10))
    } catch (err) {
      setSearchError("Couldn't fetch results. Try again.")
      setResults([])
    } finally {
      setSearching(false)
    }
  }

  function handleSelectResult(book) {
    setTitle(book.title)
    setAuthor(book.author_name ? book.author_name[0] : "")
    setCoverUrl(book.cover_i ? `https://covers.openlibrary.org/b/id/${book.cover_i}-M.jpg` : "")
    setResults([])
    setQuery("")
  }

  const shelfBooks = books
    .filter((b) => b.status === shelf)
    .sort((a, b) => (b.dateRead||"").localeCompare(a.dateRead||""))

  const diaryGroups = shelf === "read" ? groupDiaryByMonth(shelfBooks) : null

  return (
    <>
      <div className='topbar'>
      <h1>My Bookshelf</h1>
      <button className='theme-toggle' onClick={() => setTheme(theme === "light" ? "dark" : "light")}>
        {theme === "light" ? "Dark mode" : "Light mode"}
      </button>
      </div>

      <form onSubmit={handleSearch} className='search-form'>
        <input value={query} onChange={(e) => setQuery(e.target.value)} placeholder='Search a book'/>
        <button className='btn btn-primary' type='submit'>{searching? "Searching..":"Search"}</button>
      </form>

      {searchError && <p className="search-error">{searchError}</p>}

      {results.length > 0 && (
        <div className="search-results">
          {results.map((book) => (
            <div key={book.key} className="search-result" onClick={() => handleSelectResult(book)}>
              {book.cover_i ? (
                <img src={`https://covers.openlibrary.org/b/id/${book.cover_i}-S.jpg`} alt={book.title} />
              ) : (
                <div className="cover-placeholder" />
              )}
              <div>
                <strong>{book.title}</strong>
                <p className="dim">{book.author_name ? book.author_name[0] : "Unknown author"}</p>
              </div>
            </div>
          ))}
        </div>
      )}


      <form onSubmit={handleSubmit} className="book-form">
				<div className="form-row">
					<div className="form-group">
						<label>Status</label>
						<select value={status} onChange={(e) => setStatus(e.target.value)}>
							<option value="read">Read</option>
							<option value="want">Want to read</option>
						</select>
					</div>
					<div className="form-group">
						<label>Title</label>
						<input
							value={title}
							onChange={(e) => setTitle(e.target.value)}
							placeholder="Book title"
							required
						/>
					</div>
					<div className="form-group">
						<label>Author</label>
						<input
							value={author}
							onChange={(e) => setAuthor(e.target.value)}
							placeholder="Author name"
						/>
					</div>
				</div>
				{status === "read" && (
					<div className="form-row">
						<div className="form-group form-group-small">
							<label>Rating</label>
							<input
								type="number"
								min="1"
								max="5"
								value={rating}
								onChange={(e) => setRating(Number(e.target.value))}
							/>
						</div>
						<div className="form-group form-group-small">
							<label>Date read</label>
							<input
								type="date"
								value={dateRead}
								onChange={(e) => setDateRead(e.target.value)}
							/>
						</div>
						<div className="form-group form-group-wide">
							<label>Review</label>
							<textarea
								value={review}
								onChange={(e) => setReview(e.target.value)}
								placeholder="Share your thoughts"
							/>
						</div>
					</div>
				)}
				<button type="submit" className="btn-primary">
					{editingId !== null ? "Save" : "Add"}
				</button>
			</form>
			<div className="tabs-main">
				<button className={shelf === "read" ? "active" : ""} onClick={() => setShelf("read")}>
					Diary
				</button>
				<button className={shelf === "want" ? "active" : ""} onClick={() => setShelf("want")}>
					Readlist
				</button>
			</div>
			<div className="tabs tabs-secondary">
				<button className={view === "list" ? "active" : ""} onClick={() => setView("list")}>
					List
				</button>
				<button className={view === "grid" ? "active" : ""} onClick={() => setView("grid")}>
					Grid
				</button>
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
            coverUrl={book.coverUrl}
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