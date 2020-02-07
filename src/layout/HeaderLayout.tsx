import { Profile, UserManager } from "oidc-client";
import React, { ReactElement } from "react";
import { UncontrolledDropdown, DropdownItem, DropdownMenu, DropdownToggle, Nav, NavItem, Badge } from "reactstrap";
import {
	AppSidebarToggler,
	AppAsideToggler,
	AppNavbarBrand,
	// @ts-ignore
} from "@coreui/react";
import { Application } from "../config";
import { useAppContext } from "../providers";
import importLogo from "../utils/logo";

/**
 * Main Header Layout
 * @author filipditrich
 */
const HeaderLayout = (): ReactElement => {
	
	const [ { accessToken, idToken, userManager, profile } ]:
		[ { accessToken: string, idToken: string, userManager: UserManager, profile: Profile } ] = useAppContext();
	
	return (
		<React.Fragment>
			
			<AppSidebarToggler className="d-lg-none" display="md" mobile />
			<div className="navbar-brand-container d-md-down-none">
				<AppNavbarBrand
					full={ {
						src: importLogo("lg"),
						width: 89,
						height: 25,
						alt: `Logo ${ Application.APP_NAME }`,
					} }
					minimized={ {
						src: importLogo("sm"),
						width: 30,
						height: 30,
						alt: `Logo ${ Application.APP_NAME }`,
					} }
				/>
				<AppSidebarToggler className="d-md-down-none" display="lg" />
			</div>
			
			<Nav className="flex-grow-1" navbar>
				
				<div className="ml-auto" />
				
				<UncontrolledDropdown nav direction="down" className="ml-3">
					<DropdownToggle nav className="navbar-avatar d-flex">
						<div className="navbar-avatar-name">
							<span><b>{ profile.given_name + " " + profile.family_name }</b></span>
							<span><small>{ profile.preferred_username }</small></span>
						</div>
						<div className="name-avatar">
							<span>
								{ (profile.given_name as string).charAt(0).toUpperCase() + (profile.family_name as string).charAt(0).toUpperCase() }
							</span>
						</div>
					</DropdownToggle>
					
					<DropdownMenu right>
						<DropdownItem header tag="div" className="text-center"><strong>Nastavení</strong></DropdownItem>
						<DropdownItem disabled><i className="fa fa-user" /> Profil</DropdownItem>
						<DropdownItem disabled><i className="fa fa-wrench" /> Předvolby</DropdownItem>
						<DropdownItem onClick={ () => window.location.href = "/sign-out" }><i
							className="fa fa-lock" /> Odhlásit se</DropdownItem>
					</DropdownMenu>
				</UncontrolledDropdown>
			</Nav>
			
			{/*<AppAsideToggler className="d-md-down-none"*/ }
			{/*                 children={ React.createElement("span", { className: "icon-options" }) } />*/ }
		</React.Fragment>
	);
};

export default HeaderLayout;
