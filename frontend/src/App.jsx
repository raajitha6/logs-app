import { useState, useEffect } from 'react'
import './App.css'
import BookCard from './BookCard'
import BookDetailPanel from './BookDetailPanel'
import AddBookPanel from './AddBookPanel'

const API_URL = "http://127.0.0.1:8000"
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
  useEffect(()=>{
    fetch(`${API_URL}/entries`)
    .then((res)=> res.json())
    .then((data)=> setBooks(data.map((b) => ({...b, coverUrl: b.cover_url, dateRead: b.date_read}))))
  }, [])
  const [shelf, setShelf] = useState("read")
  const [view, setView] = useState("list")
  const [query, setQuery] = useState("")
  const [results, setResults] = useState([])
  const [searching, setSearching] = useState(false)
  const [searchError, setSearchError] = useState("")
  const [panelBook, setPanelBook] = useState(null)
  const [editingBookId, setEditingBookId] = useState(null)

  useEffect(() => {
    document.documentElement.dataset.theme = theme
    localStorage.setItem("theme", theme)
  }, [theme])

  useEffect(() => {
    localStorage.setItem("books", JSON.stringify(books))
  }, [books])

  async function updateBook(id, changes) {
    const body = {}
    if ("title" in changes) body.title = changes.title
    if ("author" in changes) body.author = changes.author
    if ("coverUrl" in changes) body.cover_url = changes.coverUrl
    if ("status" in changes) body.status = changes.status
    if ("rating" in changes) body.rating = changes.rating
    if ("review" in changes) body.review = changes.review
    if ("dateRead" in changes) body.date_read = changes.dateRead
    const response = await fetch(`${API_URL}/entries/${id}`,{
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(body),
    })
    const updated = await response.json()
    setBooks(books.map((b) => (b.id === id ? { ...updated, coverUrl: updated.cover_url, dateRead: updated.date_read } : b)))
  }

  async function handleDelete(id) {
    const response = await fetch(`${API_URL}/entries/${id}`, { method: "DELETE" })
    if (!response.ok) return
    setBooks(books.filter((b) => b.id !== id))
    if (id === editingBookId) setEditingBookId(null)
  } 

  function handleMarkRead(id){
    updateBook(id, {status:"read", dateRead:new Date().toISOString().slice(0,10) })
  }

  async function handleAddToDiary(fields){
    const response = await fetch(`${API_URL}/entries`, {
      method: 'POST',
      headers: {'Content-Type':'application/json'},
      body: JSON.stringify({
        title: fields.title,
        author: fields.author,
        cover_url: fields.coverUrl,
        status: 'read',
        rating: fields.rating,
        review: fields.review,
        date_read: fields.dateRead,
      }),
    })
    const newEntry = await response.json()
    setBooks([...books, { ...newEntry, coverUrl: newEntry.cover_url, dateRead: newEntry.date_read }])
    setPanelBook(null)
  }

  async function handleAddToReadlist(fields){
    const response = await fetch(`${API_URL}/entries`, {
      method: 'POST',
      headers: {'Content-Type':'application/json'},
      body: JSON.stringify({
        title: fields.title,
        author: fields.author,
        cover_url: fields.coverUrl,
        status: 'want',
        rating: null,
        review: '',
        date_read: '',
      }),
    })
    const newEntry= await response.json()
    setBooks([...books, { ...newEntry, coverUrl: newEntry.cover_url, dateRead: newEntry.date_read }])
    setPanelBook(null)
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
    setPanelBook({
      title: book.title,
      author: book.author_name ? book.author_name[0] : "",
      coverUrl: book.cover_i ? `https://covers.openlibrary.org/b/id/${book.cover_i}-M.jpg` : "",
  })
    setResults([])
    setQuery("")
  }

  const shelfBooks = books
    .filter((b) => b.status === shelf)
    .sort((a, b) => (b.dateRead||"").localeCompare(a.dateRead||""))

  const editingBook = books.find((b) => b.id === editingBookId) || null

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
      <button className="btn-secondary" onClick={() => setPanelBook({ title: "", author: "", coverUrl: "" })}>
        Add manually
      </button>


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


			<div className="tabs-main">
				<button className={shelf === "read" ? "active" : ""} onClick={() => setShelf("read")}>
					Diary
				</button>
				<button className={shelf === "want" ? "active" : ""} onClick={() => setShelf("want")}>
					Readlist
				</button>
			</div>

      {shelf === "want" && (
			<div className="tabs tabs-secondary">
				<button className={view === "list" ? "active" : ""} onClick={() => setView("list")}>
					List
				</button>
				<button className={view === "grid" ? "active" : ""} onClick={() => setView("grid")}>
					Grid
				</button>
			</div>
      )}

      {shelf === "read" ? (
        <div className="diary">
          {diaryGroups.map((group) => (
            <div key={group.label} className="month-group">
              <div className="month-header">{group.label}</div>
              {group.days.map(({ day, entries }) =>
                entries.map((book) => (
                  <div key={book.id} className="diary-row">
                    <div className="diary-date">{day}</div>
                    <BookCard book={book} onClick={() => setEditingBookId(book.id)} compact />
                  </div>
                ))
              )}
            </div>
          ))}
        </div>
      ) : (
        <div className={`books ${view}`}>
          {shelfBooks.map((book) => (
            <BookCard key={book.id} book={book} onClick={() => setEditingBookId(book.id)} />
          ))}
        </div>
      )}

      {editingBook && (
        <BookDetailPanel
          book={editingBook}
          onChange={(changes) => updateBook(editingBook.id, changes)}
          onDelete={() => handleDelete(editingBook.id)}
          onClose={() => setEditingBookId(null)}
          onMarkRead={() => handleMarkRead(editingBook.id)}
        />
      )}

      {panelBook && (
        <AddBookPanel book={panelBook}
          onAddDiary={handleAddToDiary}
          onAddReadlist={handleAddToReadlist}
          onClose={() => setPanelBook(null) }
        />
      )}
    </>
  )
}

export default App