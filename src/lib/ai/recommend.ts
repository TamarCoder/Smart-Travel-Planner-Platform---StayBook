import type { Destination } from "@/lib/api/destinations";

export interface RecommendationInput {
  travelStyle?: string[];
  favoriteDestinationIds?: string[];
  destinations: Destination[];
}

export interface Recommendation {
  destination: Destination;
  score: number;
  reasons: string[];
}

export function recommendDestinations(input: RecommendationInput): Recommendation[] {
  const { destinations, favoriteDestinationIds = [], travelStyle = [] } = input;
  if (destinations.length === 0) return [];

  const favorites = destinations.filter((d) => favoriteDestinationIds.includes(d.id));
  const favoriteCategories = new Set(favorites.map((d) => d.category));
  const styleLower = travelStyle.map((s) => s.toLowerCase());

  const scored = destinations
    .filter((d) => !favoriteDestinationIds.includes(d.id))
    .map<Recommendation>((d) => {
      const reasons: string[] = [];
      let score = d.rating;

      styleLower.forEach((style) => {
        const tagMatch = (d.tags ?? []).some((tag) => tag.toLowerCase().includes(style));
        const activityMatch = (d.activities ?? []).some((act) => act.toLowerCase().includes(style));
        if (tagMatch || activityMatch) {
          score += 4;
          reasons.push(`Fits your ${style} preference`);
        }
      });

      if (favoriteCategories.has(d.category)) {
        score += 3;
        reasons.push(`Similar to favorites you've saved`);
      }

      if (d.featured) {
        score += 1;
      }

      return { destination: d, score, reasons };
    })
    .sort((a, b) => b.score - a.score);

  return scored.slice(0, 3);
}
