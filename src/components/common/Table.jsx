import React, { useEffect, useMemo } from "react";
import { useFilters, usePagination, useSortBy, useTable } from "react-table";
import { loading } from "../../misc";

export const TextColumnFilter = ({ column: { filterValue, preFilterRows, setFilter } }) => {
    return (
        <input value={ filterValue || "" } onChange={ (e) => { setFilter(e.target.value || undefined) } } placeholder="Zadejte text" />
    );
};

export const BoolColumnFilter = ({ column: { filterValue, preFilteredRows, setFilter }}) => {
    return (
        <select value={ filterValue } onChange={e => { setFilter(e.target.value || undefined) } }>
            <option value="">Vše</option>
            <option value={ true }>Ano</option>
            <option value={ false }>Ne</option>
        </select>
    );
};

export const ListColumnFilter = ({ column: { filterValue, preFilteredRows, setFilter }}, values) => {
    return (
        <select value={ filterValue } onChange={ (e) => { setFilter(e.target.value || undefined) } }>
            <option value="">Vše</option>
            {
                Object.keys(values).map((key, index) => (
                    <option key={ index } value={ key }>{ values[key] }</option>
                ))
            }
        </select>
    );
};

export const Table = ({ columns, data, fetchData, isLoading, error, totalPages }) => {
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
        //pageOptions,
        pageCount,
        gotoPage,
        nextPage,
        previousPage,
        setPageSize,
        state: { pageIndex, pageSize, sortBy, filters },
    } = useTable({ columns, data, defaultColumn, initialState: {pageIndex: 0, pageSize: 50}, manualPagination: true, pageCount: totalPages, manualSortBy: true, disableMultiSort: true, manualFilters: true }, useFilters, useSortBy, usePagination);

    useEffect(() => {
        fetchData({ page: pageIndex, size: pageSize, sort: sortBy, filters });
    }, [ fetchData, pageIndex, pageSize, sortBy, filters ]);

    return (
        <>
            <div>
                <table {...getTableProps()}>
                    <thead>
                    {headerGroups.map(headerGroup => (
                        <tr {...headerGroup.getHeaderGroupProps()}>
                            {headerGroup.headers.map(column => (
                                <th {...column.getHeaderProps(column.getSortByToggleProps())}>
                                    {column.render("Header")}
                                    <span>
                  {column.isSorted
                      ? column.isSortedDesc
                          ? " 🔽"
                          : " 🔼"
                      : ""}
                </span>
                                </th>
                            ))}
                        </tr>
                    ))}
                    {headerGroups.map(headerGroup => (
                        <tr {...headerGroup.getHeaderGroupProps()}>
                            {headerGroup.headers.map(column => (
                                <th {...column.getHeaderProps()}>
                                    {column.canFilter ? column.render("Filter") : null}
                                </th>
                            ))}
                        </tr>
                    ))}
                    </thead>
                    <tbody {...getTableBodyProps()}>
                    {
                        error ? (
                            <tr>
                                <td colSpan={1000}>{error.text} ({error.status})</td>
                            </tr>
                        ) : (
                            isLoading ? (
                                <tr>
                                    <td colSpan={1000}>{ loading() }</td>
                                </tr>
                            ) : page.map(
                                (row, i) => {
                                    prepareRow(row);
                                    return (
                                        <tr {...row.getRowProps()}>
                                            {row.cells.map(cell => {
                                                return <td {...cell.getCellProps()}>{cell.render("Cell")}</td>
                                            })}
                                        </tr>
                                    )
                                }
                            )
                        )
                    }
                    </tbody>
                </table>
            </div>
            <div className="paginator">
                <div>
                    <button onClick={() => gotoPage(0)} disabled={!canPreviousPage}>{"<<"}</button>
                    <button onClick={() => previousPage()} disabled={!canPreviousPage}>{"<"}</button>
                    <button onClick={() => nextPage()} disabled={!canNextPage}>{">"}</button>
                    <button onClick={() => gotoPage(pageCount - 1)} disabled={!canNextPage}>{">>"}</button>
                </div>
                <div>
                    {[...Array(pageCount).keys()].map((num) => (
                        <span className="paginator-page" key={num} onClick={() => {
                            gotoPage(num)
                        }}>{num + 1}</span>))}
                </div>
                <div>
                    <select value={pageSize} onChange={e => {
                        setPageSize(Number(e.target.value))
                    }}
                    >{[10, 20, 30, 40, 50, 100].map(pageSize => (
                        <option key={pageSize} value={pageSize}>{pageSize}</option>
                    ))}
                    </select>
                </div>
            </div>
        </>
    );
};
