import { useState } from "react";
import StarRating from "./StarRating";

function AddBookPanel({ book, onAddDiary, onAddReadlist, onClose }) {
  const [title, setTitle] = useState(book.title)
  const [author, setAuthor] = useState(book.author)
  const [editingTitle, setEditingTitle] = useState(!book.title)
  const [date, setDate] = useState(() => new Date().toISOString().slice(0, 10))
  const [rating, setRating] = useState(5)
  const [review, setReview] = useState("")

  return (
    <div className="panel-overlay" onClick={onClose}>
      <div className="panel panel-wide" onClick={(e) => e.stopPropagation()}>
        <button className="panel-close" onClick={onClose}>✕</button>
        
        <div className="panel-top">
          {book.coverUrl ? (
            <img src={book.coverUrl} alt={title} className="cover-large" />
          ) : (
            <div className="cover-placeholder-large" />
          )}

          <div className="panel-top-info">
            {editingTitle ? (
              <>
                <input value={title} onChange={(e) => setTitle(e.target.value)} placeholder="Title" />
                <input value={author} onChange={(e) => setAuthor(e.target.value)} placeholder="Author" />
                {title && <button className="link-btn" onClick={() => setEditingTitle(false)}>Done</button>}
              </>
            ) : (
              <>
                <h2>{title}</h2>
                <p className="dim">{author}</p>
                <button className="link-btn" onClick={() => setEditingTitle(true)}>Edit title/author</button>
              </>
            )}
          </div>
        </div>

        <div className="panel-fields">
          <div className="field-row">
            <label>Date read</label>
            <input type="date" value={date} onChange={(e) => setDate(e.target.value)} />
          </div>
          <div className="field-row">
            <label>Rating</label>
            <StarRating value={rating} onChange={setRating} />
          </div>
          <label>Review</label>
          <textarea value={review} onChange={(e) => setReview(e.target.value)} placeholder="Share your thoughts" />

          <div className="panel-actions">
            <button
              className="btn-primary"
              onClick={() => onAddDiary({ title, author, coverUrl: book.coverUrl, dateRead: date, rating, review })}
            >
              Add to Diary
            </button>
            <button className="btn-secondary" onClick={() => onAddReadlist({ title, author, coverUrl: book.coverUrl })}>
              Add to Readlist
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}

export default AddBookPanel