export const ENDPOINTS = {
  auth: {
    login: "/auth/login",
    register: "/auth/register",
    logout: "/auth/logout",
    refresh: "/auth/refresh",
    me: "/auth/me",
  },
  destinations: {
    list: "/destinations",
    detail: (slug: string) => `/destinations/${slug}`,
  },
  trips: {
    list: "/trips",
    detail: (id: string) => `/trips/${id}`,
    create: "/trips",
    update: (id: string) => `/trips/${id}`,
    delete: (id: string) => `/trips/${id}`,
  },
  hotels: {
    list: "/hotels",
    detail: (id: string) => `/hotels/${id}`,
  },
} as const;
