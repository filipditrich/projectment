import React, { ReactElement } from "react";
import { Link } from "react-router-dom";
import UserList from "./UserList";

/**
 * Main Users View
 * @constructor
 */
export const Users = (props: any): ReactElement => {
	
	return (
		<>
			<header className="table-pre-header">
				<h1>Seznam uživatelů</h1>
				<Link
					className="button button-secondary"
					to="/users/create">
					<span>Nový</span>
				</Link>
			</header>
			<UserList />
		</>
	);
};

export default Users;
