// pages/index.tsx
import { useEffect, useMemo, useState } from "react";
import axios from "axios";
import { HERO_BG, FILTER_LABELS } from "@/constants";
import type { PropertyProps } from "@/interfaces";
import Pill from "@/components/common/Pill";
import PropertyCard from "@/components/common/Card";

/* ---------- Filter predicates ---------- */
const includesCI = (arr: string[], needle: string) =>
  arr.map((x) => x.toLowerCase()).includes(needle.toLowerCase());

const FILTERS: Record<string, (p: PropertyProps) => boolean> = {
  "Top Villa": (p) =>
    p.rating >= 4.85 || p.category.some((c) => /luxury|villa/i.test(c)),
  "Self Checkin": (p) => p.category.some((c) => /self\s*checkin/i.test(c)),
  "Free Reschedule": (p) => !!p.discount && p.discount !== "",
  "Book Now, Pay Later": () => true,
  "Instant Book": () => true,
  Pool: (p) => p.category.some((c) => /pool/i.test(c)),
};

const getPredicate = (label: string) =>
  FILTERS[label] ?? ((p: PropertyProps) => includesCI(p.category, label));

export default function HomePage() {
  const [selected, setSelected] = useState<string[]>([]);
  const [properties, setProperties] = useState<PropertyProps[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const toggle = (label: string) =>
    setSelected((cur) =>
      cur.includes(label) ? cur.filter((x) => x !== label) : [...cur, label]
    );

  // Fetch properties from API
  useEffect(() => {
    const fetchProperties = async () => {
      try {
        const response = await axios.get("/api/properties");
        setProperties(response.data);
      } catch (err) {
        console.error("Error fetching properties:", err);
        setError("Failed to load properties.");
      } finally {
        setLoading(false);
      }
    };
    fetchProperties();
  }, []);

  // Filter badges cleanup
  const FILTERS_CLEAN = useMemo(() => FILTER_LABELS.map((l) => l.trim()), []);

  // Filtered properties
  const filtered: PropertyProps[] = useMemo(() => {
    if (selected.length === 0) return properties;
    return properties.filter((p) =>
      selected.every((label) => getPredicate(label)(p))
    );
  }, [properties, selected]);

  const getBadgesFor = (p: PropertyProps) =>
    FILTERS_CLEAN.filter((label) => getPredicate(label)(p)).slice(0, 3);

  if (loading) return <p className="text-center mt-10">Loading properties...</p>;
  if (error) return <p className="text-center mt-10 text-red-600">{error}</p>;

  return (
    <>
      {/* Hero */}
      <section className="relative">
        <div className="relative mx-auto w-full max-w-7xl overflow-hidden rounded-[28px]
                        h-[36vh] md:h-[42vh] lg:h-[48vh] max-h-[520px]">
          <img
            src={HERO_BG}
            alt="Find your favorite place"
            className="h-full w-full object-cover object-center"
          />
          <div className="absolute inset-0 bg-black/25" />
          <div className="absolute inset-0 flex flex-col items-center justify-center px-6 text-center text-white">
            <h1 className="max-w-4xl text-3xl md:text-4xl lg:text-5xl font-bold leading-tight">
              Find your favorite place here!
            </h1>
            <p className="mt-3 max-w-2xl text-sm md:text-base lg:text-lg text-white/90">
              The best prices for over 2 million properties worldwide.
            </p>
          </div>
        </div>
      </section>

      {/* Filter bar */}
      <section className="mx-auto mt-8 w-full max-w-7xl px-4">
        <div className="flex flex-wrap items-center gap-2">
          <Pill
            label="All"
            active={selected.length === 0}
            onClick={() => setSelected([])}
          />
          {FILTERS_CLEAN.map((label) => (
            <Pill
              key={label}
              label={label}
              active={selected.includes(label)}
              onClick={() => toggle(label)}
            />
          ))}
        </div>
      </section>

      {/* Listings */}
      <section className="mx-auto mt-6 w-full max-w-7xl px-4">
        <div className="mb-3 flex items-center justify-between">
          <h2 className="text-lg font-semibold">Places to stay</h2>
          <div className="text-sm text-gray-600">{filtered.length} results</div>
        </div>

        <div className="grid auto-rows-fr grid-cols-1 gap-4 sm:grid-cols-2 md:grid-cols-3 xl:grid-cols-4">
          {filtered.map((item) => (
            <PropertyCard key={item.name} item={item} badges={getBadgesFor(item)} />
          ))}
        </div>
      </section>
    </>
  );
}
