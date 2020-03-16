import axios from "axios";
import React, { Dispatch, ReactElement, SetStateAction, useCallback, useEffect, useMemo, useState } from "react";
import { Link } from "react-router-dom";
import { CellProps, Column, TableInstance } from "react-table";
import { toast } from "react-toastify";
import { Badge, UncontrolledTooltip } from "reactstrap";
import { DataTable, ListColumnFilter } from "../../components/common";
import { FetchDataProps, generateParams } from "../../components/common/Table";
import { KeyValue } from "../../models/generic";
import { IIdea } from "../../models/idea";
import { DataJsonResponse, TableDataJsonResponse } from "../../models/response";
import { IWork, IWorkSet, IWorkState } from "../../models/work";
import { useAppContext } from "../../providers";
import { Axios, isStatusOk } from "../../utils";
import { handleRes, responseError, responseFail } from "../../utils/axios";
import { stateName } from "../../utils/name";

/**
 * Works List Component
 * TODO: role checking
 * @constructor
 */
export const WorkList: React.FC = () => {
	const [ isLoading, setIsLoading ] = useState<boolean>(false);
	const [ error, setError ] = useState<boolean | string>(false);
	const [ { accessToken } ] = useAppContext();
	
	// data
	const [ data, setData ] = useState<IWork[]>([]);
	const [ states, setStates ] = useState<IWorkState[]>([]);
	const [ sets, setSets ] = useState<IWorkSet[]>([]);
	const [ totalPages, setTotalPages ] = useState<number>(0);
	const [ totalRows, setTotalRows ] = useState<number>(0);
	
	// fetch work states
	useEffect(() => {
		(async () => {
			setIsLoading(true);
			try {
				const [ statesRes, setsRes ] = handleRes(
					...await axios.all<DataJsonResponse | TableDataJsonResponse>([
						Axios(accessToken).get<DataJsonResponse<IWorkState[]>>("/works/allstates"),
						Axios(accessToken).get<TableDataJsonResponse<IWorkSet[]>>("/sets"),
					]));
				setStates(statesRes.data);
				setSets(setsRes.data.data);
			} catch (error) {
				toast.error(responseError(error).message);
			} finally {
				setIsLoading(false);
			}
		})();
	}, [ accessToken ]);
	
	// columns
	const columns = useMemo<Column<IWork>[]>(() => [
		{
			Header: "Akce",
			Cell: (data: CellProps<IIdea>): ReactElement => (
				<>
					<div className="table-icon">
						<Link to={ "/works/detail/" + data.row.original.id } id={ `work-${ data.row.original.id }-detail` }>
							<i className="icon-info font-lg"
							   title="Detail zadání"
							   aria-label="Detail zadání" />
						</Link>
					</div>
					<UncontrolledTooltip target={ `work-${ data.row.original.id }-detail` } placement="right">Detail zadání</UncontrolledTooltip>
				</>
			),
			Filter: (column: TableInstance<IIdea>) => {
				return (
					<>
						<div className="table-icon">
							<i className="fa fa-close font-lg text-muted"
							   id="works-clear-filters"
							   onClick={ () => {
								   column.setAllFilters([]);
							   } } />
						</div>
						<UncontrolledTooltip target="works-clear-filters" placement="bottom">Zrušit všechny filtry</UncontrolledTooltip>
					</>
				);
			},
			disableFilters: false,
			defaultCanFilter: true,
		},
		{ Header: "Název", accessor: "name" },
		{ Header: "Jméno autora", accessor: "authorFirstName" },
		{ Header: "Příjmení autora", accessor: "authorLastName" },
		{ Header: "Třída", accessor: "className", disableFilters: true, disableSortBy: true }, // TODO: filtering on API missing ?
		{
			Header: "Sada prací",
			accessor: "setId",
			Cell: (data: CellProps<IWork>): ReactElement => (
				<span>{ sets.find((set) => set.id === data.cell.value)?.name }</span>
			),
			Filter: (column: TableInstance<IWork>) => (
				ListColumnFilter({ column }, [ ...sets
					.map((set): KeyValue => {
						return { key: set.id, value: set.name };
					})
				], "setId")
			)
		},
		{
			Header: "Stav",
			accessor: "state",
			Cell: (data: CellProps<IWork>): ReactElement => (
				<Badge>{ stateName(states.find((state) => state.code === data.cell.value)?.code) }</Badge>
			),
			Filter: (column: TableInstance<IWork>) => (
				ListColumnFilter({ column }, [ ...states
					.map((state): KeyValue => {
						return { key: state.code, value: stateName(state.code) };
					})
				], "state")
			),
		},
	], [ states, sets ]);
	
	// fetch data
	const fetchData = useCallback(({ page, size, sort, filters }: FetchDataProps): void => {
		(async () => {
			setIsLoading(true);
			setError(false);
			const philters = generateParams({ page, size, sort, filters, aliases: { authorFirstName: "firstname", authorLastName: "lastname" } });
			
			try {
				const [ res ] = handleRes<TableDataJsonResponse<IWork[]>>(await Axios(accessToken).get<TableDataJsonResponse<IWork[]>>(`/works?${ philters.join("&") }`));
				setData(res.data.data);
				setTotalPages(res.data.pages || 0);
				setTotalRows(res.data.total || 0);
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
