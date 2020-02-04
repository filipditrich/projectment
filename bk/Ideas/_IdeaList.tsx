import { findAllByDisplayValue } from "@testing-library/dom";
import { NamedColor } from "csstype";
import React, { useState, useMemo, useCallback, ReactElement, CSSProperties } from "react";
import { Cell, CellValue } from "react-table";
import { Badge } from "reactstrap";
import { TableColumn } from "../../components/common/Table";
import { Genders, RequestMethod } from "../../models";
import { DataJsonResponse } from "../../models/response";
import { useAppContext } from "../../providers";
import { Link } from "react-router-dom";
import { BoolColumnFilter, ListColumnFilter, Table } from "../../components";
import { enumToArray, fakePromise, getRandomInt } from "../../utils";
import { get, chunk, orderBy } from "lodash";
import classNames from "classnames";

/**
 * Idea List Component
 * @returns {*}
 * @constructor
 */
export const _IdeaList = (props: any): ReactElement => {
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
						<Link to={ "/ideas/list/" + data.row.original.id }><i className="icon-info font-lg" /></Link>
					</div>
				);
			},
		},
		{ Header: "Název", accessor: "name" },
		{ Header: "Předmět", accessor: "subject" },
		{ Header: "Jméno", accessor: "userFirstName" },
		{ Header: "Příjmení", accessor: "userLastName" },
		{
			Header: "Cílové skupiny",
			accessor: "ideaTargets",
			Cell: (data: CellValue): ReactElement => {
				console.log(data);
				return (
					<div>
						<span>{ data.cell.value }</span>
						{
							// TODO: need more data for this
							// (data.cell.value as IIdeaTarget[]).map((target: IIdeaTarget, i: number): ReactElement => {
							// 	return (
							// 		<Badge
							// 			className={ classNames({
							// 				"mr-2": true,
							// 				"bg-warning": target.id === 1 || target.id === 2,
							// 				"bg-danger": target.id === 3,
							// 				"bg-info": target.id === 4,
							// 				"bg-success": target.id === 5,
							// 			}) }
							// 			key={ i }
							// 			color="primary">
							// 			{ target.text }
							// 		</Badge>
							// 	);
							// })
						}
					</div>
				);
			},
			Filter: (column: TableColumn<object>) => {
				// TODO: custom filtering (need real data)
				// const values: Array<{ key: string, value: string }> = ideaTargets
				// 	.map((target: IIdeaTarget) => {
				// 		return { key: target.id.toString(), value: target.text };
				// 	});
				// return ListColumnFilter({ column }, values);
				return <></>;
			},
			disableSortBy: true,
		},
		{
			Header: "Nabízený",
			accessor: "offered",
			disableSortBy: true,
			Cell: (data: CellValue): ReactElement => {
				return (data.cell.value === true ?
					<i className="fa fa-check" />
					: <i className="fa fa-ban" />);
			},
			Filter: BoolColumnFilter,
		},
	], []);
	
	const fetchData = useCallback(({ page, size, sort, filters }) => {
		(async () => {
			setIsLoading(true);
			setError(false);
			let res: Response, json: DataJsonResponse;
			let parameters = [];
			
			let order = sort[0] ? sort[0].id : undefined;
			if (order) order = order.toLowerCase();
			// if (order && sort[0].desc) order = order + "_desc"; // TODO: de-comment
			
			if (page) parameters.push("page=" + page);
			if (size) parameters.push("pageSize=" + size);
			if (order) parameters.push("order=" + order);
			
			if (Array.isArray(filters)) {
				for (let f of filters) {
					// TODO: f.id case "firstname" never occurs, comes in as "user.firstName" etc...ERROR?
					switch (f.id) {
					case "name":
						parameters.push("name=" + f.value.toString());
						break;
					case "subject":
						parameters.push("subject=" + f.value.toString());
						break;
					case "userId":
						parameters.push("userId=" + f.value.toString());
						break;
					case "firstname":
						parameters.push("firstname=" + f.value.toString());
						break;
					case "lastname":
						parameters.push("lastname=" + f.value.toString());
						break;
					case "offered":
						parameters.push("offered=" + f.value.toString());
						break;
					case "target":
						parameters.push("target=" + f.value.toString());
						break;
					default:
						break;
					}
				}
			}
			
			try {
				res = await fetch(process.env.REACT_APP_API_URL + "/ideas?" + parameters.join("&"), {
					method: RequestMethod.GET,
					headers: { Authorization: "Bearer " + accessToken },
				});
				
				if (res.ok) {
					json = await res.json();
					setData(json.data);
					console.log(json.data);
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

export default _IdeaList;
