import destinationsData from "@/data/destinations.json";
import type { Destination } from "@/lib/api/destinations";

const DESTINATIONS = destinationsData as Destination[];

export interface ChatResponse {
  text: string;
  suggestions?: string[];
}

const PACKING_BY_REGION: Record<string, string[]> = {
  tropical: ["Reef-safe sunscreen", "Lightweight linen", "Quick-dry swimwear", "Mosquito repellent"],
  cold: ["Down jacket", "Merino base layers", "Waterproof boots", "Hand warmers"],
  alpine: ["Layered fleece", "UV sunglasses", "Wind shell", "Sturdy trail shoes"],
  desert: ["Wide-brim hat", "Loose long sleeves", "Lip balm", "Electrolytes"],
  default: ["Universal adapter", "Comfortable walking shoes", "Refillable water bottle", "Compact daypack"],
};

function regionFor(d: Destination): keyof typeof PACKING_BY_REGION {
  const w = d.weather?.condition?.toLowerCase() ?? "";
  if (w.includes("tropical")) return "tropical";
  if (w.includes("cold")) return "cold";
  if (w.includes("crisp") || w.includes("cool")) return "alpine";
  if (w.includes("dry") || w.includes("sunny")) return "desert";
  return "default";
}

function findDestination(prompt: string): Destination | undefined {
  const lower = prompt.toLowerCase();
  return DESTINATIONS.find((d) => lower.includes(d.name.toLowerCase()) || lower.includes(d.country.toLowerCase()) || lower.includes(d.slug));
}

function intentOf(prompt: string): "budget" | "season" | "packing" | "things" | "overview" | "list" | "smalltalk" {
  const lower = prompt.toLowerCase();
  if (/(budget|cost|price|how much|expensive|cheap)/.test(lower)) return "budget";
  if (/(season|when to|best time|month)/.test(lower)) return "season";
  if (/(pack|bring|wear|outfit)/.test(lower)) return "packing";
  if (/(do|see|activities|things)/.test(lower)) return "things";
  if (/(suggest|recommend|where|destination ideas)/.test(lower)) return "list";
  if (/(hi|hello|hey|good (morning|afternoon|evening))/.test(lower)) return "smalltalk";
  return "overview";
}

export function answer(prompt: string): ChatResponse {
  const trimmed = prompt.trim();
  if (!trimmed) {
    return {
      text: "Ask me about a destination, a budget, what to pack, or things to do.",
      suggestions: ["Best time for Santorini", "Maldives budget", "What to pack for Iceland"],
    };
  }

  const intent = intentOf(trimmed);
  const destination = findDestination(trimmed);

  if (intent === "smalltalk") {
    return {
      text: "Hello! I'm Voyager. I can help you plan trips, compare destinations, and pack smart. Where are you headed?",
      suggestions: ["Tell me about Patagonia", "Suggest a beach trip"],
    };
  }

  if (intent === "list" && !destination) {
    const featured = DESTINATIONS.filter((d) => d.featured).slice(0, 3);
    return {
      text: `Try one of our top picks: ${featured.map((d) => d.name).join(", ")}.`,
      suggestions: featured.map((d) => `Tell me about ${d.name}`),
    };
  }

  if (!destination) {
    return {
      text: "I couldn't match a destination in that message. Try mentioning a country or city like Kyoto, Banff, or Patagonia.",
      suggestions: ["Best time for Kyoto", "Banff packing list"],
    };
  }

  if (intent === "budget") {
    return {
      text: `${destination.name} starts around ${formatPrice(destination.pricePerNight, destination.currency)} per night for boutique stays. A 7-night trip usually lands between ${formatPrice(destination.pricePerNight * 7, destination.currency)} and ${formatPrice(destination.pricePerNight * 12, destination.currency)} depending on style and activities.`,
      suggestions: [`What to pack for ${destination.name}`, `Best time for ${destination.name}`],
    };
  }

  if (intent === "season") {
    return {
      text: `Best season for ${destination.name}: ${destination.bestSeason}. Average ${destination.weather.temp}°${destination.weather.unit} and ${destination.weather.condition?.toLowerCase() ?? "pleasant"} when you arrive.`,
      suggestions: [`Things to do in ${destination.name}`, `${destination.name} budget`],
    };
  }

  if (intent === "packing") {
    const items = PACKING_BY_REGION[regionFor(destination)];
    return {
      text: `For ${destination.name}, pack: ${items.join(", ")}. Average weather is ${destination.weather.temp}°${destination.weather.unit} (${destination.weather.condition}).`,
      suggestions: [`Best time for ${destination.name}`, `Things to do in ${destination.name}`],
    };
  }

  if (intent === "things") {
    const highlights = destination.highlights.slice(0, 4).join(", ");
    return {
      text: `Top experiences in ${destination.name}: ${highlights}. Plan two relaxed activities per day for the right pace.`,
      suggestions: [`${destination.name} budget`, `What to pack for ${destination.name}`],
    };
  }

  return {
    text: `${destination.name} — ${destination.tagline}. ${destination.description}`,
    suggestions: [
      `Best time for ${destination.name}`,
      `${destination.name} budget`,
      `What to pack for ${destination.name}`,
    ],
  };
}

function formatPrice(amount: number, currency: string) {
  try {
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency,
      maximumFractionDigits: 0,
    }).format(amount);
  } catch {
    return `${currency} ${amount}`;
  }
}
