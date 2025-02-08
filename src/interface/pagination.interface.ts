export interface QueryParams {
  page?: string;
  limit?: string;
  search?: string;
  status?: string;
  priority?: string;
  startDate?: string;
  endDate?: string;
  [key: string]: string | undefined;
}
