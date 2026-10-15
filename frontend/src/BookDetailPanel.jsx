import StarRating from "./StarRating"

function BookDetailPanel({ book, onChange, onDelete, onClose, onMarkRead }) {
  return (
    <div className="panel-overlay" onClick={onClose}>
      <div className="panel" onClick={(e) => e.stopPropagation()}>
        <button className="panel-close" onClick={onClose}>✕</button>
        {book.coverUrl ? (
          <img src={book.coverUrl} alt={book.title} className="cover-large" />
        ) : (
          <div className="cover-placeholder-large" />
        )}
        <input value={book.title} onChange={(e) => onChange({ title: e.target.value })} placeholder="Title" />
        <input value={book.author} onChange={(e) => onChange({ author: e.target.value })} placeholder="Author" />

        {book.status === "read" && (
          <>
            <label>Rating</label>
            <StarRating value={book.rating} onChange={(n) => onChange({ rating: n })} />
            <label>Date read</label>
            <input type="date" value={book.dateRead} onChange={(e) => onChange({ dateRead: e.target.value })} />
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
  )
}

export default BookDetailPanel