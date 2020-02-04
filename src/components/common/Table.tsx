import { filter } from "minimatch";
import React, { FC, ReactElement, useEffect, useMemo } from "react";
import {
	useFilters,
	usePagination,
	useSortBy,
	useTable,
	ColumnInstance,
	UseSortByColumnProps,
	UseResizeColumnsColumnProps,
	UseFiltersColumnProps,
	Column,
	TableOptions,
	UseTableRowProps,
	UseTableCellProps,
} from "react-table";
import { Table as ReactstrapTable, Input, Pagination, PaginationItem, PaginationLink } from "reactstrap";
import { loading, error as errorPartial } from "../../misc";
import classnames from "classnames";

/**
 * Types
 */
type Data = object;
export type Props = {
	columns: Column<Data>[],
	data: Data[],
	fetchData: any,
	isLoading: boolean,
	error: any | null,
	totalPages: number,
	totalRows: number,
}

/**
 * Table Column Interface
 */
export interface TableColumn<D extends object = {}>
	extends ColumnInstance<D>,
		UseSortByColumnProps<D>,
		UseResizeColumnsColumnProps<D>,
		UseFiltersColumnProps<D> {
}

export interface SortableColumnInstance<D extends object = {}>
	extends ColumnInstance<D>,
		UseSortByColumnProps<D> {
}

export interface FetchDataProps {
	// TODO
	page: number;
	size: number;
	sort: any;
	filters: any;
}

/**
 * Text Column Filter
 * @param filterValue
 * @param preFilterRows
 * @param setFilter
 * @returns {*}
 * @constructor
 */
export const TextColumnFilter = ({ column: { filterValue, setFilter } }: { column: TableColumn<object> }): ReactElement => {
	return (
		<Input
			type="text"
			placeholder="Zadejte hledaný výraz"
			value={ filterValue || "" }
			onChange={ (e) => {
				setFilter(e.target.value || undefined);
			} }
		/>
	);
};

/**
 * Boolean Column Filter
 * @param filterValue
 * @param preFilteredRows
 * @param setFilter
 * @returns {*}
 * @constructor
 */
export const BoolColumnFilter = ({ column: { filterValue, setFilter } }: { column: TableColumn<object> }): ReactElement => {
	// TODO: fix, filtering on "false" value not working
	return (
		<Input
			type="select"
			value={ filterValue }
			onChange={ (e) => {
				setFilter(e.target.value || undefined);
			} }>
			<option value="">Vše</option>
			<option value="true">Ano</option>
			<option value="false">Ne</option>
		</Input>
	);
};

/**
 * IdeaList Column filter
 * @param filterValue
 * @param preFilteredRows
 * @param setFilter
 * @param options
 * @returns {*}
 * @constructor
 */
export const ListColumnFilter = ({ column: { filterValue, setFilter } }: { column: TableColumn<object> }, options: Array<{ key: any, value: any }>): ReactElement => {
	// TODO: fix, error on setFilter()
	return (
		<Input
			type="select"
			value={ filterValue }
			onChange={ (e) => {
				setFilter(e.target.value || undefined);
			} }>
			<option value="">Vše</option>
			{
				options.map((value: { key: string | number, value: string | number }, index: number) => (
					<option key={ index } value={ value.key }>{ value.value }</option>
				))
			}
		</Input>
	);
};

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
export const Table: FC<Props> = ({ columns, data, fetchData, isLoading, error, totalPages, totalRows }: Props): ReactElement => {
	const defaultColumn: any = useMemo(() => ({
		Filter: TextColumnFilter,
	}), []);
	
	const tableOptions: TableOptions<Data> & any = {
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
	}: any = useTable<Data>(tableOptions, useFilters, useSortBy, usePagination);
	
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
							headerGroups.map((headerGroup: any, headerIndex: number) => (
								<tr { ...headerGroup.getHeaderGroupProps() } className="-headerGroups" key={ headerIndex }>
									{
										headerGroup.headers.map((column: SortableColumnInstance<Data>, columnIndex: number) => (
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
							headerGroups.map((headerGroup: any, headerIndex: number) => (
								<tr { ...headerGroup.getHeaderGroupProps() } className="-filters" key={ headerIndex }>
									{
										headerGroup.headers.map((column: SortableColumnInstance<Data> & UseFiltersColumnProps<Data>, columnIndex: number) => (
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
								) : page.map((row: UseTableRowProps<Data>, rowIndex: number) => {
									prepareRow(row);
									return (
										<tr { ...row.getRowProps() } className="rt-tr" key={ rowIndex }>
											{
												row.cells.map((cell: UseTableCellProps<Data>, cellIndex: number) => {
													return <td { ...cell.getCellProps() } className="rt-td" key={ cellIndex }>{ cell.render("Cell") }</td>;
												})
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
