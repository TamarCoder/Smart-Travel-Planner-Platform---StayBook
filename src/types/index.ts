export interface User {
  id: string;
  email: string;
  name: string;
  avatar: string;
  role: "user" | "admin";
  createdAt: string;
  preferences: {
    currency: string;
    language: string;
    darkMode: boolean;
    notifications: boolean;
  };
}

export interface AuthTokens {
  accessToken: string;
  refreshToken: string;
  expiresIn: number;
}

export interface Destination {
  id: string;
  slug: string;
  name: string;
  country: string;
  continent: string;
  description: string;
  shortDescription: string;
  image: string;
  gallery: string[];
  rating: number;
  reviewCount: number;
  priceFrom: number;
  currency: string;
  bestMonths: string[];
  tags: string[];
  coordinates: { lat: number; lng: number };
  weather: { temp: number; condition: string };
  popularActivities: string[];
}

export interface Hotel {
  id: string;
  destinationId: string;
  name: string;
  description: string;
  image: string;
  gallery: string[];
  rating: number;
  reviewCount: number;
  pricePerNight: number;
  currency: string;
  amenities: string[];
  address: string;
  coordinates: { lat: number; lng: number };
  stars: number;
  availability: boolean;
}

export interface TripActivity {
  id: string;
  title: string;
  description: string;
  time: string;
  duration: number;
  type: "transport" | "accommodation" | "activity" | "food" | "free";
  location: string;
  cost: number;
  currency: string;
  notes: string;
}

export interface TripDay {
  id: string;
  date: string;
  activities: TripActivity[];
}

export interface Trip {
  id: string;
  userId: string;
  title: string;
  destinationId: string;
  destination: string;
  coverImage: string;
  startDate: string;
  endDate: string;
  budget: number;
  currency: string;
  status: "planning" | "confirmed" | "ongoing" | "completed" | "cancelled";
  collaborators: string[];
  days: TripDay[];
  createdAt: string;
  updatedAt: string;
}

export interface ApiResponse<T> {
  data: T;
  meta?: {
    total: number;
    page: number;
    pageSize: number;
    totalPages: number;
  };
}

export interface ApiError {
  message: string;
  code: string;
  status: number;
}

export type SortOrder = "asc" | "desc";

export interface PaginationParams {
  page?: number;
  pageSize?: number;
  sortBy?: string;
  sortOrder?: SortOrder;
}

export interface DestinationFilters extends PaginationParams {
  search?: string;
  continent?: string;
  minPrice?: number;
  maxPrice?: number;
  minRating?: number;
  tags?: string[];
}
