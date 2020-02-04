import React, { ReactElement, useCallback, useMemo, useState } from "react";
import { Link } from "react-router-dom";
import { CellValue } from "react-table";
import { BoolColumnFilter, ListColumnFilter, Table } from "../../components/common";
import { TableColumn } from "../../components/common/Table";
import { DataJsonResponse } from "../../models/response";
import { Genders } from "../../models";
import { useAppContext } from "../../providers";
import { enumToArray, fakePromise, getRandomInt } from "../../utils";
import { get, chunk, orderBy } from "lodash";

/**
 * User List Component
 * @returns {*}
 * @constructor
 */
export const IdeaList = (props: any): ReactElement => {
	
	const [ isLoading, setIsLoading ]: any = useState(false);
	const [ error, setError ]: any = useState(false);
	
	const [ data, setData ]: any = useState([]);
	const [ totalPages, setTotalPages ]: any = useState(0);
	const [ totalRows, setTotalRows ]: any = useState(0);
	const [ { accessToken } ] = useAppContext();
	
	const columns = useMemo(() => [
		{
			Header: "Akce",
			Cell: (data: CellValue): ReactElement => {
				return (
					<div className="d-flex justify-content-center">
						<Link to={ "/users/list/" + data.row.original.id }><i className="icon-info font-lg" /></Link>
					</div>
				);
			},
		},
		{ Header: "Jméno", accessor: "userFirstName" },
		{ Header: "Příjmení", accessor: "userLastName" },
		{ Header: "Email", accessor: "email" },
		{
			Header: "Pohlaví", accessor: "gender", disableSortBy: true, Cell: (data: CellValue) => {
				return Genders[data.cell.value] || "";
			}, Filter: (column: TableColumn<object>) => {
				return ListColumnFilter({ column }, enumToArray(Genders));
			},
		},
		{
			Header: "Autor",
			accessor: "canBeAuthor",
			disableSortBy: true,
			Cell: (data: CellValue) => (data.cell.value === true ? "Ano" : "Ne"),
			Filter: BoolColumnFilter,
		},
		{
			Header: "Hodnotitel",
			accessor: "canBeEvaluator",
			disableSortBy: true,
			Cell: (data: CellValue) => (data.cell.value === true ? "Ano" : "Ne"),
			Filter: BoolColumnFilter,
		},
	], []);
	
	const fakeData: any[] = JSON.parse(localStorage.getItem("fakeUsersData") as string) || [];
	
	const fetchData = useCallback(({ page, size, sort, filters }) => {
		(async () => {
			setIsLoading(true);
			setError(false);
			let res: Response, json: DataJsonResponse, parameters = [], order = sort[0] ? sort[0].id : undefined;
			if (order) order = order.toLowerCase();
			// if (order && sort[0].desc) order = order + "_desc"; // TODO: de-comment
			
			if (page) parameters.push("page=" + page);
			if (size) parameters.push("pageSize=" + size);
			if (order) parameters.push("order=" + order);
			
			if (Array.isArray(filters)) {
				for (let f of filters) {
					switch (f.id) {
					case "gender":
						parameters.push("gender=" + f.value);
						break;
					case "firstName":
						parameters.push("firstname=" + f.value);
						break;
					case "lastName":
						parameters.push("lastname=" + f.value);
						break;
					case "email":
						parameters.push("email=" + f.value);
						break;
					case "canBeAuthor":
						parameters.push("author=" + f.value);
						break;
					case "canBeEvaluator":
						parameters.push("evaluator=" + f.value);
						break;
					default:
						break;
					}
				}
			}
			
			try {
				res = await fetch(process.env.REACT_APP_API_URL + "/ideas?" + parameters.join("&"), {
					method: "GET",
					headers: { Authorization: "Bearer " + accessToken },
				});
				
				if (res.ok) {
					json = await res.json();
					setData(json.data || []);
					setTotalPages(json.pages);
					setTotalRows(json.total);
				} else {
					throw new Error(res.statusText);
				}
			} catch (error) {
				setError({ status: error.status, text: error.message });
			} finally {
				setIsLoading(false);
			}
		})();
	}, [ accessToken ]);
	
	return (
		<>
			<Table
				columns={ columns }
				data={ data }
				fetchData={ fetchData }
				isLoading={ isLoading }
				error={ error }
				totalPages={ totalPages }
				totalRows={ totalRows } />
			<br />
		</>
	);
};

export default IdeaList;
