import { useState } from "react"
import StarRating from "./StarRating"

function BookDetailPanel({ book, onChange, onDelete, onClose, onMarkRead }) {
  const [editingTitle, setEditingTitle] = useState(false)
  return (
    <div className="panel-overlay" onClick={onClose}>
      <div className="panel panel-wide" onClick={(e) => e.stopPropagation()}>
        <button className="panel-close" onClick={onClose}>✕</button>
        <div className="panel-top">
          {book.coverUrl ? (
            <img src={book.coverUrl} alt={book.title} className="cover-large" />
          ) : (
            <div className="cover-placeholder-large" />
          )}

          <div className="panel-top-info">
            {editingTitle ? (
              <>
                <input value={book.title} onChange={(e) => onChange({ title: e.target.value })} placeholder="Title" />
                <input value={book.author} onChange={(e) => onChange({ author: e.target.value })} placeholder="Author" />
                <button className="link-btn" onClick={() => setEditingTitle(false)}>Done</button>
              </>
            ) : (
              <>
                <h2>{book.title}</h2>
                <p className="dim">{book.author}</p>
                <button className="link-btn" onClick={() => setEditingTitle(true)}>Edit title/author</button>
              </>
            )}
          </div>
        </div>

        <div className="panel-fields">
          {book.status === "read" && (
            <>
              <div className="field-row">
                <label>Rating</label>
                <StarRating value={book.rating} onChange={(n) => onChange({ rating: n })} />
              </div>
              <div className="field-row">
                <label>Date read</label>
                <input type="date" value={book.dateRead} onChange={(e) => onChange({ dateRead: e.target.value })} />
              </div>
              <label>Review</label>
              <textarea
                value={book.review}
                onChange={(e) => onChange({ review: e.target.value })}
                placeholder="Share your thoughts"
              />
            </>
          )}

          {book.status === "want" && (
            <button className="btn-primary" onClick={onMarkRead}>Mark as read</button>
          )}

          <button className="btn-danger" onClick={onDelete}>Delete</button>
        </div>
      </div>
    </div>
  )
}

export default BookDetailPanel