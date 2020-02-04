import React, { ReactElement, useCallback, useMemo, useState } from "react";
import { Link } from "react-router-dom";
import { CellValue, Column } from "react-table";
import { BoolColumnFilter, FetchDataProps, Table, TableColumn } from "../../components/common/Table";
import { IIdea } from "../../models/idea";
import { DataJsonResponse } from "../../models/response";
import { AxiosResponse } from "axios";
import { useAppContext } from "../../providers";
import { Axios, statusOk } from "../../utils";

/**
 * Idea List Component
 * @constructor
 */
export const IdeaList: React.FC = () => {
	const [ isLoading, setIsLoading ] = useState<boolean>(false);
	const [ error, setError ] = useState<boolean | string>(false);
	
	const [ data, setData ] = useState<IIdea[]>([]);
	const [ totalPages, setTotalPages ] = useState<number>(0);
	const [ totalRows, setTotalRows ] = useState<number>(0);
	
	const [ { accessToken } ] = useAppContext();
	
	// columns
	const columns = useMemo<Column<IIdea>[]>(() => [
		{
			Header: "Akce",
			Cell: (data: CellValue): ReactElement => (
				<div className="d-flex justify-content-center">
					<Link to={ "/ideas/list/" + data.row.original.id }><i className="icon-info font-lg" /></Link>
				</div>
			),
		},
		{ Header: "Název", accessor: "name" },
		{ Header: "Předmět", accessor: "subject" },
		{ Header: "Jméno", accessor: "userFirstName" },
		{ Header: "Příjmení", accessor: "userLastName" },
		{
			Header: "Cílové skupiny",
			accessor: "ideaTargets",
			Cell: (data: CellValue): ReactElement => (
				<span>TODO</span>
			),
			Filter: (column: TableColumn<IIdea>) => (
				<span>TODO</span>
			),
			disableSortBy: true,
		},
		{
			Header: "Nabízený",
			accessor: "offered",
			disableSortBy: true,
			Cell: (data: CellValue): ReactElement => (
				data.cell.value
					? <i className="fa fa-check" />
					: <i className="fa fa-ban" />
			),
			Filter: BoolColumnFilter,
		},
	], []);
	
	// fetch data
	const fetchData = useCallback(({ page, size, sort, filters }: FetchDataProps): void => {
		(async () => {
			setIsLoading(true);
			setError(false);
			
			const parameters: string[] = [];
			let order: string | undefined = sort[0] ? sort[0].id : undefined;
			if (order) order = order.toLowerCase();
			if (order && sort[0].desc) order = order + "_desc";
			
			if (page) parameters.push("page=" + page);
			if (size) parameters.push("pageSize=" + size);
			if (order) parameters.push("order=" + order);
			
			if (Array.isArray(filters)) {
				for (let f of filters) {
					switch (f.id) {
						case "name":
							parameters.push("name=" + f.value);
							break;
						case "subject":
							parameters.push("subject=" + f.value);
							break;
						case "userId":
							parameters.push("userId=" + f.value);
							break;
						case "firstname":
							parameters.push("firstname=" + f.value);
							break;
						case "lastname":
							parameters.push("lastname=" + f.value);
							break;
						case "offered":
							parameters.push("offered=" + f.value);
							break;
						case "target":
							parameters.push("target=" + f.value);
							break;
						default:
							break;
					}
				}
			}
			
			try {
				const res: AxiosResponse<DataJsonResponse<IIdea[]>> = await Axios(accessToken)
					.get<DataJsonResponse<IIdea[]>>("/ideas?" + parameters.join("&"));
				
				if (statusOk(res)) {
					setData(res.data.data);
					setTotalPages(res.data.pages || 0);
					setTotalRows(res.data.total || 0);
				} else {
					throw new Error(res.statusText || res.status.toString());
				}
			} catch (error) {
				setError(error.message);
			} finally {
				setIsLoading(false);
			}
		})();
	}, [ accessToken ]);
	
	return (
		<Table
			columns={ columns }
			data={ data }
			fetchData={ fetchData }
			isLoading={ isLoading }
			error={ error }
			totalPages={ totalPages }
			totalRows={ totalRows } />
	);
};

export default IdeaList;
