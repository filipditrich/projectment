import React from 'react';
import { Badge, UncontrolledDropdown, DropdownItem, DropdownMenu, DropdownToggle, Nav, NavItem } from 'reactstrap';
import {
    AppSidebarToggler,
    AppAsideToggler,
    AppNavbarBrand,
    // @ts-ignore
} from '@coreui/react';

// image imports
import logo from '../../assets/img/logo-projectment-lg.png';
import logoSm from '../../assets/img/logo-projectment-sm.png';
import profileImage from '../../assets/img/senior-developer.png';

/**
 * Header Layout Properties Interface
 */
interface IHeaderLayoutProps {
    onLogout: (event: any) => void;
}

/**
 * Header Layout State Interface
 */
interface IHeaderLayoutState {}

/**
 * Main Header Layout
 * @author filipditrich
 */
export default class HeaderLayout extends React.Component<IHeaderLayoutProps, IHeaderLayoutState> {

    onSearchClick(e: Event | any): void {
        // TODO
        console.log(e);
    }

    render() {
        return(
            <React.Fragment>

                <AppSidebarToggler className="d-lg-none" display="md" mobile />
                <div className="navbar-brand-container d-md-down-none">
                    <AppNavbarBrand
                        full={{ src: logo, width: 89, height: 25, alt: 'ProjectMent Logo' }}
                        minimized={{ src: logoSm, width: 30, height: 30, alt: 'ProjectMent Logo' }}
                    />
                    <AppSidebarToggler className="d-md-down-none" display="lg" />
                </div>

                <Nav className="flex-grow-1" navbar>

                    <NavItem className="ml-2 d-flex mr-auto cursor-pointer" onClick={ (e: any) => this.onSearchClick(e) }>
                        <div className="navbar-search input-group d-md-down-none">
                            <div className="input-group-prepend">
                                <span className="input-group-text" id="basic-addon1"><i className="icon-magnifier"/></span>
                            </div>
                            <input type="text" className="form-control" placeholder="Search..." aria-label="Username"
                                   aria-describedby="basic-addon1"/>
                        </div>
                    </NavItem>

                    <UncontrolledDropdown nav direction="down">
                        <DropdownToggle nav>
                            <i className="icon-bell"/><Badge pill color="danger">5</Badge>
                        </DropdownToggle>

                        <DropdownMenu right>
                            {/*<DropdownItem tag="div" className="text-center">No Notifications</DropdownItem>*/}
                            <div className="text-center py-3">No Notifications</div>
                        </DropdownMenu>
                    </UncontrolledDropdown>

                    <UncontrolledDropdown nav direction="down" className="ml-3">
                        <DropdownToggle nav className="navbar-avatar d-flex">
                            <div className="navbar-avatar-name">
                                <span><b>Filip</b></span>
                                <span><small>Administrator</small></span>
                            </div>
                            <img src={ profileImage } className="img-avatar" alt="Name Surname" />
                            {/*<div className="name-avatar"><span>FD</span></div>*/}
                        </DropdownToggle>

                        <DropdownMenu right>
                            <DropdownItem header tag="div" className="text-center"><strong>Nastavení</strong></DropdownItem>
                            <DropdownItem><i className="fa fa-user"/> Profil</DropdownItem>
                            <DropdownItem><i className="fa fa-wrench"/> Předvolby</DropdownItem>
                            <DropdownItem onClick={e => this.props.onLogout(e)}><i className="fa fa-lock"/> Odhlásit se</DropdownItem>
                        </DropdownMenu>
                    </UncontrolledDropdown>
                </Nav>

                {/*<AppAsideToggler className="d-md-down-none" children={ React.createElement('span', { className: 'icon-options' }) } />*/}
            </React.Fragment>
        );
    }
}
