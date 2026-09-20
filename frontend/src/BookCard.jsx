function BookCard({ title, author, rating, review, dateRead, onEdit, onDelete }) {
  return (
    <div className="book-card">
      <h2>{title}</h2>
      <p>{author}</p>
      <p>Rating: {rating}/5</p>
      {dateRead && <p>Read on: {dateRead}</p>}
      {review && <p>Review: {review}</p>}
      <button onClick={onEdit}>Edit</button>
      <button onClick={onDelete}>Delete</button>
    </div>
  )
}

export default BookCard