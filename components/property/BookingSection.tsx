// components/property/BookingSection.tsx
import React, { useMemo, useState } from "react";

const nightsBetween = (a?: string, b?: string) => {
  if (!a || !b) return 0;
  const s = new Date(a).getTime();
  const e = new Date(b).getTime();
  const d = e - s;
  return d > 0 ? Math.ceil(d / (1000 * 60 * 60 * 24)) : 0;
};

const BookingSection: React.FC<{ price: number }> = ({ price }) => {
  const [checkIn, setCheckIn] = useState("");
  const [checkOut, setCheckOut] = useState("");

  const nights = useMemo(() => nightsBetween(checkIn, checkOut), [checkIn, checkOut]);
  const total = useMemo(() => (nights > 0 ? nights * price : 0), [nights, price]);

  return (
    <div className="bg-white p-5 md:p-6 rounded-2xl shadow-md sticky top-6">
      <div className="flex items-baseline justify-between">
        <h3 className="text-2xl font-semibold">${price}</h3>
        <span className="text-sm text-gray-500">/ night</span>
      </div>

      {/* Dates */}
      <div className="mt-4 grid grid-cols-2 gap-3">
        <div>
          <label className="text-xs text-gray-500">Check in</label>
          <input
            type="date"
            value={checkIn}
            onChange={(e) => setCheckIn(e.target.value)}
            className="mt-1 w-full rounded-lg border p-2 text-sm"
          />
        </div>
        <div>
          <label className="text-xs text-gray-500">Check out</label>
          <input
            type="date"
            value={checkOut}
            onChange={(e) => setCheckOut(e.target.value)}
            className="mt-1 w-full rounded-lg border p-2 text-sm"
          />
        </div>
      </div>

      {/* Summary / Total */}
      <div className="mt-4 space-y-2 text-sm">
        <div className="flex justify-between text-gray-700">
          <span>
            ${price} × {nights} night{nights === 1 ? "" : "s"}
          </span>
          <span>${nights > 0 ? price * nights : 0}</span>
        </div>
        <div className="border-t pt-2 flex justify-between font-semibold">
          <span>Total payment</span>
          <span>${total}</span>
        </div>
      </div>

      <button
        className="mt-4 w-full rounded-lg bg-green-600 hover:bg-green-700 text-white py-2.5 font-medium disabled:opacity-50"
        disabled={nights <= 0}
        onClick={() => alert(`Reserved for ${nights} night(s). Total: $${total}`)}
      >
        Reserve now
      </button>
    </div>
  );
};

export default BookingSection;