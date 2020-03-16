import { remove, uniqBy } from "lodash";
import React, { FC, ReactElement, useEffect, useMemo } from "react";
import {
	Cell,
	Column,
	ColumnInstance,
	Filters,
	HeaderGroup,
	Row,
	SortingRule,
	TableInstance,
	TableOptions,
	useFilters,
	UseFiltersColumnProps,
	usePagination,
	useSortBy,
	useTable,
} from "react-table";
import { Table as ReactstrapTable, Input, Pagination, PaginationItem, PaginationLink } from "reactstrap";
import { loading, error as errorPartial } from "../../misc";
import classnames from "classnames";
import { KeyValue } from "../../models/generic";

/**
 * Types
 */
type Data = any;
export type DataTablePropFetchData = ({ page, size, sort, filters }: FetchDataProps) => void;
export interface FetchDataProps {
	page: number,
	size: number,
	sort: Array<SortingRule<Data>>,
	filters: Filters<Data>
}
export interface DataTableProps<T extends object = Data> {
	columns: Array<Column<T>>;
	data: T[];
	fetchData: DataTablePropFetchData;
	isLoading: boolean;
	error: boolean | string;
	totalPages: number;
	totalRows: number;
}
export interface PhiltersProps<D extends object = Data> {
	page: number,
	size: number,
	sort: Array<SortingRule<D>>,
	filters: Filters<D>,
	aliases?: { [key: string]: string },
}

/**
 * Filter parameters
 * @param page
 * @param size
 * @param sort
 * @param filters
 * @param aliases
 */
export const generateParams = ({ page, size, sort, filters, aliases }: PhiltersProps): string[] => {
	let order: string | undefined = sort[0] ? sort[0].id : undefined;
	if (order) order = order.toLowerCase();
	if (order && sort[0].desc) order = order + "_desc";
	
	remove(filters, (v) => (v.id === "order")
		|| (v.id === "pageSize") || (v.id === "page"));
	if (page) filters.push({ id: "page", value: page });
	if (size) filters.push({ id: "pageSize", value: size });
	if (order) filters.push({ id: "order", value: order });
	
	return uniqBy(filters, "id").map((filter) => `${ aliases && aliases[filter.id] ? aliases[filter.id] : filter.id }=${ filter.value }`);
};

/**
 * Text Column Filter
 * @param filterValue
 * @param preFilterRows
 * @param setFilter
 * @returns {*}
 * @constructor
 */
export const TextColumnFilter = ({ column: { filterValue, setFilter } }: { column: UseFiltersColumnProps<Data> }): ReactElement => (
	<Input
		type="text"
		placeholder="Zadejte hledaný výraz"
		value={ filterValue || "" }
		onChange={
			(e) => {
				setFilter(e.target.value || undefined);
			}
		}
	/>
);

/**
 * Boolean Column Filter
 * @param filterValue
 * @param preFilteredRows
 * @param setFilter
 * @returns {*}
 * @constructor
 */
export const BoolColumnFilter = ({ column: { filterValue, setFilter } }: { column: UseFiltersColumnProps<Data> }): ReactElement => (
	<Input
		type="select"
		value={ filterValue }
		onChange={
			(e) => {
				setFilter(e.target.value || undefined);
			}
		}>
		<option value="">Vše</option>
		<option value="true">Ano</option>
		<option value="false">Ne</option>
	</Input>
);

/**
 * IdeaList Column filter
 * @param filterValue
 * @param preFilteredRows
 * @param setFilter
 * @param options
 * @param id
 * @returns {*}
 * @constructor
 */
export const ListColumnFilter = ({ column: { filterValue, setFilter } }: { column: TableInstance<Data> }, options: Array<KeyValue>, id: string): ReactElement => (
	<Input
		type="select"
		value={ filterValue }
		onChange={
			(e) => {
				setFilter(id, e.target.value);
			}
		}>
		<option value="">Vše</option>
		{
			options.map((value: KeyValue, index: number) => (
				<option key={ index } value={ value.key }>{ value.value }</option>
			))
		}
	</Input>
);

/**
 * Table Component
 * @param columns
 * @param data
 * @param fetchData
 * @param isLoading
 * @param error
 * @param totalPages
 * @param totalRows
 * @returns {*}
 * @constructor
 */
export const DataTable: FC<DataTableProps> = ({ columns, data, fetchData, isLoading, error, totalPages, totalRows }: DataTableProps): ReactElement => {
	const defaultColumn = useMemo<any>(() => ({
		Filter: TextColumnFilter,
	}), []);
	
	const tableOptions: TableOptions<Data> = {
		columns,
		data,
		defaultColumn,
		initialState: {
			pageIndex: 0,
			pageSize: 10,
		},
		manualPagination: true,
		pageCount: totalPages,
		manualSortBy: true,
		disableMultiSort: true,
		manualFilters: true,
	};
	
	const {
		getTableProps,
		getTableBodyProps,
		headerGroups,
		prepareRow,
		page,
		canPreviousPage,
		canNextPage,
		// pageOptions,
		pageCount,
		gotoPage,
		nextPage,
		previousPage,
		setPageSize,
		state: { pageIndex, pageSize, sortBy, filters },
	} = useTable<Data>(tableOptions, useFilters, useSortBy, usePagination);
	
	useEffect(() => {
		fetchData({ page: pageIndex, size: pageSize, sort: sortBy, filters });
	}, [ fetchData, pageIndex, pageSize, sortBy, filters ]);
	
	const countFrom: number = data.length ? (pageSize * pageIndex) + 1 : 0;
	const countTo: number = (pageSize * pageIndex) + data.length;

	return (
		<>
			{/* Table */ }
			<div className="table-container">
				<ReactstrapTable { ...getTableProps() } className="rt-table" striped hover responsive>

					{/* Table Head */ }
					<thead className="rt-head">
						{
							// Header Titles
							headerGroups.map((headerGroup: HeaderGroup<Data>, headerIndex: number) => (
								<tr { ...headerGroup.getHeaderGroupProps() } className="-headerGroups" key={ headerIndex }>
									{
										headerGroup.headers.map((column: ColumnInstance<Data>, columnIndex: number) => (
											<th { ...column.getHeaderProps(column.getSortByToggleProps()) } key={ columnIndex }>
												{ column.render("Header") }
												<span
													className="ml-2">{ column.isSorted ? column.isSortedDesc ? "▼" : "▲" : "" }</span>
											</th>
										))
									}
								</tr>
							))
						}
						{
							// Header Filters
							headerGroups.map((headerGroup: HeaderGroup<Data>, headerIndex: number) => (
								<tr { ...headerGroup.getHeaderGroupProps() } className="-filters" key={ headerIndex }>
									{
										headerGroup.headers.map((column: ColumnInstance<Data>, columnIndex: number) => (
											<th { ...column.getHeaderProps() } className="rt-th" key={ columnIndex }>
												{ column.canFilter ? column.render("Filter") : null }
											</th>
										))
									}
								</tr>
							))
						}
					</thead>

					{/* Table Body */ }
					<tbody { ...getTableBodyProps() } className="rt-body">
						{
							// Error Message
							error ? (
								<tr>
									<td colSpan={ 1000 }>{ errorPartial(error) }</td>
								</tr>
							) : (
								// Loading
								isLoading ? (
									<tr>
										<td colSpan={ 1000 }>{ loading() }</td>
									</tr>
									// Cell
								) : page.map((row: Row<Data>, rowIndex: number) => {
									prepareRow(row);
									return (
										<tr { ...row.getRowProps() } className="rt-tr" key={ rowIndex }>
											{
												row.cells.map((cell: Cell<Data>, cellIndex: number) => (
													<td { ...cell.getCellProps() } className="rt-td"
													    key={ cellIndex }>{ cell.render("Cell") }</td>
												))
											}
										</tr>
									);
								})
							)
						}
					</tbody>
				</ReactstrapTable>
			</div>

			{/* Paginator */ }
			<div className="paginator">

				{/* Pagination */ }
				<Pagination>
					<PaginationItem
						className={ classnames({ "disabled": !canPreviousPage }) }>
						<PaginationLink
							first
							onClick={ () => gotoPage(0) }
							disabled={ !canPreviousPage } />
					</PaginationItem>
					<PaginationItem
						className={ classnames({ "disabled": !canPreviousPage }) }>
						<PaginationLink
							previous
							onClick={ () => previousPage }
							disabled={ !canPreviousPage } />
					</PaginationItem>
					{
						// @ts-ignore
						[ ...Array(pageCount).keys() ].map((num: number) => (
							<PaginationItem
								key={ num }
								className={ classnames({ "active": pageIndex === num }) }>
								<PaginationLink
									onClick={ () => gotoPage(num) }>
									{ num + 1 }
								</PaginationLink>
							</PaginationItem>
						))
					}
					<PaginationItem
						className={ classnames({ "disabled": !canNextPage }) }>
						<PaginationLink
							next
							onClick={ () => nextPage() }
							disabled={ !canNextPage } />
					</PaginationItem>
					<PaginationItem
						className={ classnames({ "disabled": !canNextPage }) }>
						<PaginationLink
							last
							onClick={ () => gotoPage(pageCount - 1) }
							disabled={ !canNextPage } />
					</PaginationItem>
				</Pagination>

				{/* Total + IPP */ }
				<div className="d-flex align-items-center mt-3 mt-lg-0">
					<span className="mr-3 text-muted">{ countFrom } - { countTo } z { totalRows } záznamů</span>

					<Input
						type="select"
						value={ pageSize }
						onChange={ (e) => {
							setPageSize(Number(e.target.value));
						} }>
						{
							[ 10, 20, 30, 40, 50, 100 ].map(pageSize => (
								<option
									key={ pageSize }
									value={ pageSize }>
									{ pageSize }
								</option>
							))
						}
					</Input>
				</div>
			</div>
		</>
	);
};
