/**
 * Expected Data JSON Response from API
 */
export interface DataJsonResponse<T = any[]> {
	total?: number;
	filtered?: number;
	count?: number;
	page?: number;
	pages?: number;
	data: T;
}
