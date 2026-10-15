function StarRating({value, onChange }){
    return(
        <div className="star-rating">
            {[1, 2, 3, 4, 5].map((n) => (
                <span key={n} className={n <= (value || 0) ? "star filled" : "star"} onClick={() => onChange(n)}>★</span>
        ))}
        </div>
    )
}

export default StarRating