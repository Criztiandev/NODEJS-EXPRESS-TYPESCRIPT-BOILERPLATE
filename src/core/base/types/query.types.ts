import { PopulateOptions, SortOrder } from "mongoose";

// Base pagination parameters
export interface PaginationParams {
  page?: number;
  limit?: number;
  sort?: Record<string, SortOrder>;
}

// Pagination response structure
export interface PaginatedResponse<T> {
  data: T[];
  pagination: {
    total: number;
    page: number;
    limit: number;
    pages: number;
  };
}

// Extended pagination parameters with additional query options
export interface PaginationQueryParams extends PaginationParams {
  search?: string;
  sortBy?: string;
  sortOrder?: SortOrder;
  startDate?: string;
  endDate?: string;
}

// Options for pagination and query customization
export interface QueryOptions {
  select?: string | Record<string, number>;
  sort?: Record<string, SortOrder>;
  populate?: string | string[] | PopulateOptions | PopulateOptions[];
  search?: string;
  searchFields?: string[];
  errorMessage?: string;
}

export interface UpdateQueryOptions
  extends Pick<QueryOptions, "select" | "errorMessage"> {
  batch?: boolean;
}

// Re-export PaginationOptions as an alias of QueryOptions for backward compatibility
export interface PaginationOptions extends QueryOptions {
  limit?: number;
  page?: number;
}

// Validate options
export interface ValidateOptions extends QueryOptions {
  errorMessage?: string;
  overideValidation?: boolean;
}
