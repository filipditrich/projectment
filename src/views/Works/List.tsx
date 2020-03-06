import { AxiosResponse } from "axios";
import React, { ReactElement, useCallback, useEffect, useMemo, useState } from "react";
import { Link } from "react-router-dom";
import { CellProps, Column, TableInstance } from "react-table";
import { toast } from "react-toastify";
import { BoolColumnFilter, DataTable, ListColumnFilter } from "../../components/common";
import { FetchDataProps } from "../../components/common/Table";
import TargetBadges from "../../components/common/TargetBadges";
import { KeyValue } from "../../models/generic";
import { IIdea, ITarget } from "../../models/idea";
import { TableDataJsonResponse } from "../../models/response";
import { IWork, IWorkInit } from "../../models/work";
import { useAppContext } from "../../providers";
import { Axios, isStatusOk } from "../../utils";
import { responseError, responseFail } from "../../utils/axios";

/**
 * Works List Component
 * @constructor
 */
export const WorkList: React.FC = () => {
	const [ isLoading, setIsLoading ] = useState<boolean>(false);
	const [ error, setError ] = useState<boolean | string>(false);
	
	const [ targets, setTargets ] = useState<any[]>([]);
	
	const [ data, setData ] = useState<IWork[]>([]);
	const [ totalPages, setTotalPages ] = useState<number>(0);
	const [ totalRows, setTotalRows ] = useState<number>(0);
	
	const [ { accessToken } ] = useAppContext();
	
	// get idea targets
	useEffect(() => {
		(async () => {
			setIsLoading(true);
			
			try {
				const res: AxiosResponse<TableDataJsonResponse<ITarget[]>> = await Axios(accessToken)
					.get<TableDataJsonResponse<ITarget[]>>("/targets");
				
				if (isStatusOk(res)) {
					setTargets(res.data.data);
				} else throw responseFail(res);
			} catch (error) {
				toast.error(responseError(error).message);
			} finally {
				setIsLoading(false);
			}
		})();
	}, [ accessToken ]);
	
	// columns
	const columns = useMemo<Column<IIdea>[]>(() => [
		{
			Header: "Akce",
			Cell: (data: CellProps<IIdea>): ReactElement => (
				<div className="table-icon">
					<Link to={ "/ideas/detail/" + data.row.original.id }>
						<i className="icon-info font-lg"
						   title="Detail námětu"
						   aria-label="Detail námětu" />
					</Link>
				</div>
			),
			Filter: (column: TableInstance<IIdea>) => {
				return (
					<div className="table-icon">
						<i className="icon-close font-lg"
						   title="Zrušit všechny filtry"
						   aria-label="Zrušit všechny filtry"
						   onClick={ () => {
							   column.setAllFilters([]);
						   } } />
					</div>
				);
			},
			disableFilters: false,
			defaultCanFilter: true,
		},
		{ Header: "Název", accessor: "name" },
	], [ targets ]);
	
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
			
			// for (let f of filters) {
			// 	switch (f.id) {
			// 		case "name":
			// 			parameters.push("name=" + f.value);
			// 			break;
			// 		case "subject":
			// 			parameters.push("subject=" + f.value);
			// 			break;
			// 		case "userId":
			// 			parameters.push("userId=" + f.value);
			// 			break;
			// 		case "userFirstName":
			// 			parameters.push("firstName=" + f.value);
			// 			break;
			// 		case "userLastName":
			// 			parameters.push("lastName=" + f.value);
			// 			break;
			// 		case "offered":
			// 			parameters.push("offered=" + f.value);
			// 			break;
			// 		case "targets":
			// 			parameters.push("target=" + f.value);
			// 			break;
			// 		default:
			// 			break;
			// 	}
			// }
			
			try {
				const res: AxiosResponse<TableDataJsonResponse<IWork[]>> = await Axios(accessToken)
					.get<TableDataJsonResponse<IWork[]>>("/works?" + parameters.join("&"));
				
				if (isStatusOk(res)) {
					setData(res.data.data);
					setTotalPages(res.data.pages || 0);
					setTotalRows(res.data.total || 0);
					// setTotal(res.data.total || 0);
					console.log(res);
				} else throw responseFail(res);
			} catch (error) {
				toast.error(responseError(error).message);
			} finally {
				setIsLoading(false);
			}
		})();
	}, [ accessToken ]);
	
	return (
		<DataTable
			columns={ columns }
			data={ data }
			fetchData={ fetchData }
			isLoading={ isLoading }
			error={ error }
			totalPages={ totalPages }
			totalRows={ totalRows } />
	);
};

export default WorkList;
