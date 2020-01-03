import React, { useEffect, useMemo } from "react";
import { useFilters, usePagination, useSortBy, useTable } from "react-table";
import {Table as ReactstrapTable, Input, Pagination, PaginationItem, PaginationLink} from "reactstrap";
import { loading } from "../../misc";
import classnames from "classnames";

/**
 * Text Column Filter
 * @param filterValue
 * @param preFilterRows
 * @param setFilter
 * @returns {*}
 * @constructor
 */
export const TextColumnFilter = ({ column: { filterValue, preFilterRows, setFilter } }) => {
    return (
        <Input
            type="text"
            placeholder="Zadejte hledaný výraz"
            value={ filterValue || "" }
            onChange={ (e) => { setFilter(e.target.value || undefined) } }
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
export const BoolColumnFilter = ({ column: { filterValue, preFilteredRows, setFilter }}) => {
    return (
        <Input
            type="select"
            value={ filterValue }
            onChange={ (e) => { setFilter(e.target.value || undefined) } }>
            <option value="">Vše</option>
            <option value={ true }>Ano</option>
            <option value={ false }>Ne</option>
        </Input>
    );
};

/**
 * IdeaList Column filter
 * @param filterValue
 * @param preFilteredRows
 * @param setFilter
 * @param values
 * @returns {*}
 * @constructor
 */
export const ListColumnFilter = ({ column: { filterValue, preFilteredRows, setFilter }}, values) => {
    return (
        <Input
            type="select"
            value={ filterValue }
            onChange={ (e) => { setFilter(e.target.value || undefined) } }>
            <option value="">Vše</option>
            {
                Object.keys(values).map((key, index) => (
                    <option key={ index } value={ key }>{ values[key] }</option>
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
export const Table = ({ columns, data, fetchData, isLoading, error, totalPages, totalRows }) => {
    const defaultColumn = useMemo(() => ({
        Filter: TextColumnFilter,
    }), []);

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
    } = useTable({ columns, data, defaultColumn, initialState: { pageIndex: 0, pageSize: 10 }, manualPagination: true, pageCount: totalPages, manualSortBy: true, disableMultiSort: true, manualFilters: true }, useFilters, useSortBy, usePagination);

    useEffect(() => {
        fetchData({ page: pageIndex, size: pageSize, sort: sortBy, filters });
    }, [ fetchData, pageIndex, pageSize, sortBy, filters ]);

    const countFrom = data.length ? (pageSize * pageIndex) + 1 : 0;
    const countTo = (pageSize * pageIndex) + data.length;

    return (
        <>
            {/* Table */}
            <div className="table-container">
                <ReactstrapTable { ...getTableProps() } className="rt-table" striped hover responsive>

                    {/* Table Head */}
                    <thead className="rt-head">
                        {
                            // Header Titles
                            headerGroups.map(headerGroup => (
                                <tr { ...headerGroup.getHeaderGroupProps() } className="-headerGroups">
                                    {
                                        headerGroup.headers.map(column => (
                                            <th { ...column.getHeaderProps(column.getSortByToggleProps()) }>
                                                { column.render("Header") }
                                                <span className="ml-2">{ column.isSorted ? column.isSortedDesc ? "▼" : "▲" : "" }</span>
                                            </th>
                                        ))
                                    }
                                </tr>
                            ))
                        }
                        {
                            // Header Filters
                            headerGroups.map(headerGroup => (
                                <tr { ...headerGroup.getHeaderGroupProps() } className="-filters">
                                    {
                                        headerGroup.headers.map(column => (
                                            <th { ...column.getHeaderProps() } className="rt-th">
                                                { column.canFilter ? column.render("Filter") : null }
                                            </th>
                                        ))
                                    }
                                </tr>
                            ))
                        }
                    </thead>

                    {/* Table Body */}
                    <tbody {...getTableBodyProps()} className="rt-body">
                    {
                        // Error Message
                        error ? (
                            <tr><td colSpan={ 1000 }>{ error.text } ({ error.status })</td></tr>
                        ) : (
                            // Loading
                            isLoading ? (
                                <tr><td colSpan={ 1000 }>{ loading() }</td></tr>
                                // Cell
                            ) : page.map((row, i) => {
                                    prepareRow(row);
                                    return (
                                        <tr { ...row.getRowProps() } className="rt-tr">
                                            {
                                                row.cells.map(cell => {
                                                    return <td { ...cell.getCellProps() } className="rt-td">{ cell.render("Cell") }</td>
                                                })
                                            }
                                        </tr>
                                    )
                            })
                        )
                    }
                    </tbody>
                </ReactstrapTable>
            </div>

            {/* Paginator */}
            <div className="paginator">

                {/* Pagination */}
                <Pagination>
                    <PaginationItem
                        className={ classnames({ 'disabled': !canPreviousPage }) }>
                        <PaginationLink
                            first
                            onClick={() => gotoPage(0)}
                            disabled={!canPreviousPage} />
                    </PaginationItem>
                    <PaginationItem
                        className={ classnames({ 'disabled': !canPreviousPage }) }>
                        <PaginationLink
                            previous
                            onClick={ () => previousPage }
                            disabled={ !canPreviousPage } />
                    </PaginationItem>
                    {
                        [...Array(pageCount).keys()].map((num) => (
                            <PaginationItem
                                key={ num }
                                className={ classnames({ 'active': pageIndex === num }) }>
                                <PaginationLink
                                    onClick={ () => gotoPage(num) }>
                                    { num + 1 }
                                </PaginationLink>
                            </PaginationItem>
                        ))
                    }
                    <PaginationItem
                        className={ classnames({ 'disabled': !canNextPage }) }>
                        <PaginationLink
                            next
                            onClick={ () => nextPage() }
                            disabled={ !canNextPage } />
                    </PaginationItem>
                    <PaginationItem
                        className={ classnames({ 'disabled': !canNextPage }) }>
                        <PaginationLink
                            last
                            onClick={ () => gotoPage(pageCount - 1) }
                            disabled={ !canNextPage } />
                    </PaginationItem>
                </Pagination>

                {/* Total + IPP */}
                <div className="d-flex align-items-center mt-3 mt-lg-0">
                    <span className="mr-3 text-muted">{ countFrom } - { countTo } z { totalRows } záznamů</span>

                    <Input
                        type="select"
                        value={ pageSize }
                        onChange={ (e) => { setPageSize(Number(e.target.value)) } }>
                        {
                            [10, 20, 30, 40, 50, 100].map(pageSize => (
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
