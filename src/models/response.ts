/**
 * Data Type from JSON Response from API
 */
export type DataJsonResponse<D = any> = D;
export type NoContentResponse = null;

/**
 * Expected Table Data JSON Response from API
 */
export interface TableDataJsonResponse<T = DataJsonResponse> {
	total?: number;
	filtered?: number;
	count?: number;
	page?: number;
	pages?: number;
	data: T;
}
