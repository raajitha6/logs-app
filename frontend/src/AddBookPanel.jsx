import { useState } from "react";

function AddBookPanel({ book, onAddDiary, onAddReadlist, onClose }) {
  const [title, setTitle] = useState(book.title)
  const [author, setAuthor] = useState(book.author)
  const [date, setDate] = useState(() => new Date().toISOString().slice(0, 10))

  return (
    <div className="panel-overlay" onClick={onClose}>
      <div className="panel" onClick={(e) => e.stopPropagation()}>
        <button className="panel-close" onClick={onClose}>✕</button>
        {book.coverUrl ? (
          <img src={book.coverUrl} alt={title} className="cover-large" />
        ) : (
          <div className="cover-placeholder-large" />
        )}
        <input value={title} onChange={(e) => setTitle(e.target.value)} placeholder="Title" />
        <input value={author} onChange={(e) => setAuthor(e.target.value)} placeholder="Author" />
        <label>Date read</label>
        <input type="date" value={date} onChange={(e) => setDate(e.target.value)} />
        <div className="panel-actions">
          <button
            className="btn-primary"
            onClick={() => onAddDiary({ title, author, coverUrl: book.coverUrl, dateRead: date })}
          >
            Add to Diary
          </button>
          <button
            className="btn-secondary"
            onClick={() => onAddReadlist({ title, author, coverUrl: book.coverUrl })}
          >
            Add to Readlist
          </button>
        </div>
      </div>
    </div>
  )
}

export default AddBookPanel