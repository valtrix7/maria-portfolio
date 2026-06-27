/* ─── ReviewStars ─── */
interface ReviewStarsProps {
  rating: number;
  maxRating?: number;
  className?: string;
}

export const ReviewStars = ({ rating, maxRating = 5, className = '' }: ReviewStarsProps) => {
  const filledStars = Math.floor(rating);
  const fractionalPart = rating - filledStars;
  const emptyStars = maxRating - filledStars - (fractionalPart > 0 ? 1 : 0);

  return (
    <div className={`acs-stars ${className}`}>
      <div className="acs-stars-row">
        {[...Array(filledStars)].map((_, i) => (
          <svg key={`f${i}`} className="acs-star" viewBox="0 0 20 20" fill="currentColor">
            <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.286 3.957a1 1 0 00.95.69h4.162c.969 0 1.371 1.24.588 1.81l-3.37 2.448a1 1 0 00-.364 1.118l1.287 3.957c.3.921-.755 1.688-1.54 1.118l-3.37-2.448a1 1 0 00-1.175 0l-3.37 2.448c-.784.57-1.838-.197-1.54-1.118l1.287-3.957a1 1 0 00-.364-1.118L2.05 9.384c-.783-.57-.38-1.81.588-1.81h4.162a1 1 0 00.95-.69l1.286-3.957z" />
          </svg>
        ))}
        {fractionalPart > 0 && (
          <svg className="acs-star" viewBox="0 0 20 20" fill="currentColor">
            <defs>
              <linearGradient id="acs-half">
                <stop offset={`${fractionalPart * 100}%`} stopColor="currentColor" />
                <stop offset={`${fractionalPart * 100}%`} stopColor="#444" />
              </linearGradient>
            </defs>
            <path
              fill="url(#acs-half)"
              d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.286 3.957a1 1 0 00.95.69h4.162c.969 0 1.371 1.24.588 1.81l-3.37 2.448a1 1 0 00-.364 1.118l1.287 3.957c.3.921-.755 1.688-1.54 1.118l-3.37-2.448a1 1 0 00-1.175 0l-3.37 2.448c-.784.57-1.838-.197-1.54-1.118l1.287-3.957a1 1 0 00-.364-1.118L2.05 9.384c-.783-.57-.38-1.81.588-1.81h4.162a1 1 0 00.95-.69l1.286-3.957z"
            />
          </svg>
        )}
        {[...Array(emptyStars)].map((_, i) => (
          <svg key={`e${i}`} className="acs-star acs-star--empty" viewBox="0 0 20 20" fill="currentColor">
            <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.286 3.957a1 1 0 00.95.69h4.162c.969 0 1.371 1.24.588 1.81l-3.37 2.448a1 1 0 00-.364 1.118l1.287 3.957c.3.921-.755 1.688-1.54 1.118l-3.37-2.448a1 1 0 00-1.175 0l-3.37 2.448c-.784.57-1.838-.197-1.54-1.118l1.287-3.957a1 1 0 00-.364-1.118L2.05 9.384c-.783-.57-.38-1.81.588-1.81h4.162a1 1 0 00.95-.69l1.286-3.957z" />
          </svg>
        ))}
      </div>
      <span className="sr-only">{rating}</span>
    </div>
  );
};

export default ReviewStars;
