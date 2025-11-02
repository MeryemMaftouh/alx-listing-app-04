import React, { useState, useEffect } from "react";
import axios from "axios";

const StarRow = ({ rating }: { rating: number }) => {
  const r = Math.round(rating);
  return (
    <span className="text-yellow-500">
      {Array.from({ length: 5 }, (_, i) => (i < r ? "★" : "☆")).join("")}
    </span>
  );
};

interface Review {
  id: string | number;
  name: string;
  avatar: string;
  rating: number;
  comment: string;
}

const ReviewSection: React.FC<{ propertyId: string }> = ({ propertyId }) => {
  const [reviews, setReviews] = useState<Review[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchReviews = async () => {
      try {
        const response = await axios.get(`/api/properties/${propertyId}/reviews`);
        setReviews(response.data);
      } catch (err) {
        console.error(err);
        setError("Failed to fetch reviews.");
      } finally {
        setLoading(false);
      }
    };

    if (propertyId) fetchReviews();
  }, [propertyId]);

  if (loading) return <p>Loading reviews...</p>;
  if (error) return <p className="text-red-500">{error}</p>;

  return (
    <div className="mt-10">
      <h3 className="text-2xl font-semibold mb-4">Reviews</h3>
      {reviews.length === 0 && <p className="text-gray-600">No reviews yet.</p>}

      <div className="grid md:grid-cols-2 gap-6">
        {reviews.map((review) => (
          <div
            key={review.id}
            className="border-b md:border-b-0 md:border-r last:border-none pb-6 md:pb-0 md:pr-6"
          >
            <div className="flex items-center">
              <img
                src={review.avatar}
                alt={review.name}
                className="w-12 h-12 rounded-full mr-4 object-cover"
              />
              <div>
                <p className="font-bold">{review.name}</p>
                <StarRow rating={review.rating} />
              </div>
            </div>
            <p className="mt-3 text-gray-700 leading-relaxed">{review.comment}</p>
          </div>
        ))}
      </div>
    </div>
  );
};

export default ReviewSection;
