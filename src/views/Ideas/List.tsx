import React, { ReactElement, useCallback, useEffect, useMemo, useState } from "react";
import { Link } from "react-router-dom";
import { CellProps, Column, TableInstance } from "react-table";
import { Badge } from "reactstrap";
import {
	BoolColumnFilter,
	FetchDataProps,
	ListColumnFilter,
	DataTable,
} from "../../components/common/Table";
import { KeyValue } from "../../models/generic";
import { IIdea, IIdeaTarget } from "../../models/idea";
import { TableDataJsonResponse } from "../../models/response";
import { AxiosResponse } from "axios";
import { useAppContext } from "../../providers";
import { Axios, isStatusOk } from "../../utils";

/**
 * Idea List Component
 * @constructor
 */
export const IdeaList: React.FC = () => {
	const [ isLoading, setIsLoading ] = useState<boolean>(false);
	const [ error, setError ] = useState<boolean | string>(false);
	
	const [ targets, setTargets ] = useState<IIdeaTarget[]>([]);
	
	const [ data, setData ] = useState<IIdea[]>([]);
	const [ totalPages, setTotalPages ] = useState<number>(0);
	const [ totalRows, setTotalRows ] = useState<number>(0);
	
	const [ { accessToken } ] = useAppContext();
	
	// get idea targets
	useEffect(() => {
		(async () => {
			setIsLoading(true);
			
			try {
				const res: AxiosResponse<TableDataJsonResponse<IIdeaTarget[]>> = await Axios(accessToken)
					.get<TableDataJsonResponse<IIdeaTarget[]>>("/targets");
				
				if (isStatusOk(res)) {
					setTargets(res.data.data);
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
		{ Header: "Předmět", accessor: "subject" },
		{ Header: "Jméno", accessor: "userFirstName" }, // TODO: filtering not working
		{ Header: "Příjmení", accessor: "userLastName" }, // TODO: filtering not working
		{
			Header: "Cílové skupiny",
			accessor: "targets",
			Cell: (data: CellProps<IIdea>): ReactElement => (
				<div className="badge-container">
					{
						// TODO: badge colors
						(data.cell.value as IIdeaTarget[]).map((target: IIdeaTarget, i: number): ReactElement => (
							<Badge key={ i }>
								{ target.text }
							</Badge>
						))
					}
				</div>
			),
			Filter: (column: TableInstance<IIdea>) => (
				ListColumnFilter({ column }, [ ...targets
					.map((target: IIdeaTarget): KeyValue => {
						return { key: target.id, value: target.text };
					})
				])
			),
			disableSortBy: true,
		},
		{
			Header: "Nabízený",
			accessor: "offered",
			disableSortBy: true,
			Cell: (data: CellProps<IIdea>): ReactElement => (
				data.cell.value
					? <i className="fa fa-check" />
					: <i className="fa fa-ban" />
			),
			Filter: BoolColumnFilter,
		},
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
					case "userFirstName":
						parameters.push("firstName=" + f.value);
						break;
					case "userLastName":
						parameters.push("lastName=" + f.value);
						break;
					case "offered":
						parameters.push("offered=" + f.value);
						break;
					case "targets":
						parameters.push("target=" + f.value);
						break;
					default:
						break;
				}
			}
			
			try {
				const res: AxiosResponse<TableDataJsonResponse<IIdea[]>> = await Axios(accessToken)
					.get<TableDataJsonResponse<IIdea[]>>("/ideas?" + parameters.join("&"));
				
				if (isStatusOk(res)) {
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

export default IdeaList;
