function BookCard({ book, onClick }) {
  return (
    <div className="book-card" onClick={onClick}>
      {book.coverUrl ? (
        <img src={book.coverUrl} alt={book.title} className="cover" />
      ) : (
        <div className="cover-placeholder" />
      )}
      <h2>{book.title}</h2>
      <p>{book.author}</p>
      {book.rating !== null && <p>Rating: {book.rating}/5</p>}
      {book.dateRead && <p>Read on: {book.dateRead}</p>}
      {review && <p>Review: {review}</p>}
    </div>
  )
}

export default BookCard