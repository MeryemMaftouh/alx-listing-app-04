// components/property/PropertyDetail.tsx
import React, { useState } from "react";
import type { PropertyProps } from "@/interfaces";

type TabKey = "offer" | "reviews" | "host";

const Stars = ({ value }: { value: number }) => {
  const r = Math.round(value);
  return (
    <div className="flex items-center gap-2">
      <span className="text-yellow-500">{Array.from({ length: 5 }, (_, i) => (i < r ? "★" : "☆")).join("")}</span>
      <span className="text-gray-600 text-sm">{value.toFixed(2)}</span>
    </div>
  );
};

const PropertyDetail: React.FC<{ property: PropertyProps }> = ({ property }) => {
  const [tab, setTab] = useState<TabKey>("offer");

  // 5-photo collage (fallback uses the single image)
  const imgs = [property.image, property.image, property.image, property.image, property.image];

  // Minimal description (your interface doesn’t define one)
  const description = `Enjoy a comfortable stay in ${property.address.city}, ${property.address.country}. Close to attractions and equipped with essentials for a great visit.`;

  return (
    <div className="container mx-auto p-6">
      {/* Title + meta */}
      <h1 className="text-3xl md:text-4xl font-bold">{property.name}</h1>
      <div className="mt-2 flex flex-wrap items-center gap-3 text-sm text-gray-700">
        <Stars value={property.rating} />
        <span>•</span>
        <span>
          {property.address.city}, {property.address.country}
        </span>
        <span>•</span>
        <span className="text-gray-500">
          {property.offers.bed} beds · {property.offers.shower} baths · {property.offers.occupants} guests
        </span>
      </div>

      {/* Images */}
      <div className="mt-5 grid grid-cols-2 md:grid-cols-4 gap-3">
        <img
          src={imgs[0]}
          alt={`${property.name}-hero`}
          className="col-span-2 md:col-span-2 w-full h-64 md:h-80 object-cover rounded-xl"
        />
        {imgs.slice(1).map((src, i) => (
          <img
            key={i}
            src={src}
            alt={`${property.name}-${i}`}
            className="w-full h-32 md:h-40 object-cover rounded-xl"
          />
        ))}
      </div>

      {/* Tabs header */}
      <div className="mt-6 flex gap-4 border-b">
        {(["offer", "reviews", "host"] as TabKey[]).map((k) => (
          <button
            key={k}
            onClick={() => setTab(k)}
            className={`py-2 px-1 -mb-px border-b-2 text-sm md:text-base ${
              tab === k ? "border-gray-900 text-gray-900" : "border-transparent text-gray-500 hover:text-gray-800"
            }`}
          >
            {k === "offer" ? "What we offer" : k === "reviews" ? "Reviews" : "About host"}
          </button>
        ))}
      </div>

      {/* Description */}
      <div className="mt-4">
        <h2 className="text-2xl font-semibold">Description</h2>
        <p className="mt-2 text-gray-700 leading-relaxed">{description}</p>
      </div>

      {/* Tab body (kept minimal per brief) */}
      <div className="mt-6">
        {tab === "offer" && (
          <section>
            <h3 className="text-lg font-semibold mb-3">What this place offers</h3>
            <ul className="flex flex-wrap gap-2">
              {property.category.map((amenity, i) => (
                <li key={i} className="bg-gray-100 text-gray-800 px-3 py-1 rounded-full text-sm">
                  {amenity}
                </li>
              ))}
            </ul>
          </section>
        )}
        {tab === "reviews" && <p className="text-gray-600">Scroll down to the reviews section.</p>}
        {tab === "host" && <p className="text-gray-600">Host details not provided.</p>}
      </div>

      {/* “What this place offer” section (like mockup) */}
      <div className="mt-8">
        <h2 className="text-2xl font-semibold">What this place offer</h2>
        <p className="text-sm text-gray-500 mt-1">
          Each home is fully equipped to meet your needs, with ample space and privacy.
        </p>
        <ul className="mt-4 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-2">
          {property.category.map((a, i) => (
            <li key={i} className="flex items-center gap-3 text-gray-800">
              <span className="h-2 w-2 rounded-full bg-gray-500" />
              {a}
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
};

export default PropertyDetail;