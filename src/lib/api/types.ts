export type Id = string;

export type Timestamp = string;

export interface Paginated<T> {
  items: T[];
  total: number;
  page: number;
  pageSize: number;
}

export interface RequestOptions {
  delayMs?: number;
  errorRate?: number;
  signal?: AbortSignal;
}

export type SortDirection = "asc" | "desc";
