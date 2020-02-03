/**
 * Expected Data JSON Response from API
 */
export interface DataJsonResponse {
	total: number;
	filtered: number;
	count: number;
	page: number;
	pages: number;
	data: any[] | any;
}
