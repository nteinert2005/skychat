import React from 'react';
import { Nav } from 'react-bootstrap';

import * as Icon from 'react-bootstrap-icons';

import './Sidebar.css';


const Sidebar = () => {
    return(
        <>
            <Nav defaultActiveKey="/home" className="flex-column navbar-new">
                <Nav.Link href="/home">
                    <Icon.App className="ml-4" size={40} />
                </Nav.Link>
                <Nav.Link href="/room">
                    <Icon.People className="ml-4" size={40} />
                </Nav.Link>
                <Nav.Link href="/users">
                    <Icon.PersonSquare className="ml-4" size={40} />
                </Nav.Link>
            </Nav>
        </>
    )
}

export default Sidebar;