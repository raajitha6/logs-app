function BookCard({ title, author, status, rating, review, dateRead, coverUrl, onEdit, onDelete, onMarkRead }) {
  return (
    <div className="book-card">
      {coverUrl ? (
        <img src={coverUrl} alt={title} className="cover" />
      ) : (
        <div className="cover-placeholder" />
      )}
      <h2>{title}</h2>
      <p>{author}</p>
      {rating !== null && <p>Rating: {rating}/5</p>}
      {dateRead && <p>Read on: {dateRead}</p>}
      {review && <p>Review: {review}</p>}
      {status === "want" && <button onClick={onMarkRead}>Mark as read</button>}
      <button onClick={onEdit}>Edit</button>
      <button onClick={onDelete}>Delete</button>
    </div>
  )
}

export default BookCard