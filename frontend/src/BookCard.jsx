function BookCard({ book, onClick, compact }) {
  if (compact) {
    return (
      <div className="book-card-compact" onClick={onClick}>
        {book.coverUrl ? (
          <img src={book.coverUrl} alt={book.title} className="cover-tiny" />
        ) : (
          <div className="cover-placeholder-tiny" />
        )}
        <div className="compact-info">
          <strong>{book.title}</strong>
          <span className="dim"> {book.author}</span>
        </div>
        {book.rating !== null && <span className="rating-stars">{"★".repeat(book.rating)}</span>}
      </div>
    )
  }

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
    </div>
  )
}

export default BookCard