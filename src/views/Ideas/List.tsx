import React, { ReactElement, useCallback, useEffect, useMemo, useState } from "react";
import { Link } from "react-router-dom";
import { CellProps, Column, TableInstance } from "react-table";
import { toast } from "react-toastify";
import { UncontrolledTooltip } from "reactstrap";
import { BoolColumnFilter, FetchDataProps, ListColumnFilter, DataTable, generateParams } from "../../components/common/Table";
import TargetBadges from "../../components/common/TargetBadges";
import { KeyValue } from "../../models/generic";
import { IIdea, ITarget } from "../../models/idea";
import { TableDataJsonResponse } from "../../models/response";
import { useAppContext } from "../../providers";
import { Axios } from "../../utils";
import { handleRes, responseError } from "../../utils/axios";

/**
 * Idea List Component
 * @constructor
 */
export const IdeaList: React.FC = () => {
	const [ isLoading, setIsLoading ] = useState<boolean>(false);
	const [ error, setError ] = useState<boolean | string>(false);
	const [ { accessToken } ] = useAppContext();
	
	// data
	const [ targets, setTargets ] = useState<ITarget[]>([]);
	const [ data, setData ] = useState<IIdea[]>([]);
	const [ totalPages, setTotalPages ] = useState<number>(0);
	const [ totalRows, setTotalRows ] = useState<number>(0);
	
	// get idea targets
	useEffect(() => {
		(async () => {
			setIsLoading(true);
			try {
				const [ res ] = handleRes<TableDataJsonResponse<ITarget[]>>(await Axios(accessToken)
					.get<TableDataJsonResponse<ITarget[]>>("/targets"));
				setTargets(res.data.data);
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
				<>
					<div className="table-icon">
						<Link to={ "/ideas/detail/" + data.row.original.id } id={ `ideas-${ data.row.original.id }-detail` }>
							<i className="icon-info font-lg" />
						</Link>
					</div>
					<UncontrolledTooltip target={ `ideas-${ data.row.original.id }-detail` } placement="right">Detail námětu</UncontrolledTooltip>
				</>
			),
			Filter: (column: TableInstance<IIdea>) => {
				return (
					<>
						<div className="table-icon">
							<i className="fa fa-close font-lg text-muted"
							   id="ideas-clear-filters"
							   onClick={ () => {
								   column.setAllFilters([]);
							   } } />
						</div>
						<UncontrolledTooltip target="ideas-clear-filters" placement="bottom">Zrušit všechny filtry</UncontrolledTooltip>
					</>
				);
			},
			disableFilters: false,
			defaultCanFilter: true,
		},
		{ Header: "Název", accessor: "name" },
		{ Header: "Předmět", accessor: "subject" },
		{ Header: "Jméno", accessor: "userFirstName" },
		{ Header: "Příjmení", accessor: "userLastName" },
		{
			Header: "Cílové skupiny",
			accessor: "targets",
			Cell: (data: CellProps<IIdea>): ReactElement => (
				<TargetBadges targets={ data.cell.value }/>
			),
			Filter: (column: TableInstance<IIdea>) => (
				ListColumnFilter({ column }, [ ...targets
					.map((target: ITarget): KeyValue => {
						return { key: target.id, value: target.text };
					})
				], "targets")
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
			const philters = generateParams({ page, size, sort, filters, aliases: { userFirstName: "firstname", userLastName: "lastname", targets: "target" } });
			
			try {
				const [ res ] = handleRes<TableDataJsonResponse<IIdea[]>>(await Axios(accessToken).get<TableDataJsonResponse<IIdea[]>>(`/ideas?${ philters.join("&") }`));
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

export default IdeaList;
