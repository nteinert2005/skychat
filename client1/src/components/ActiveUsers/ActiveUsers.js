import React from 'react';

import { Container, Form, ListGroup, ListGroupItem, Row } from 'react-bootstrap';
import * as Icon from 'react-bootstrap-icons';

const ActiveUsers = () => {
    return(
        <>
                <Form>
                    <Form.Group controlId="searchUsers">
                        <Form.Control type='text' placeholder="Search Users..." />
                    </Form.Group>
                </Form>

                <h5 style={{display: "block"}} className="text-muted">Favorites</h5>
                <ul>
                    <li className="favorite"> 
                        <Icon.Hash /> Team 1 <Icon.StarFill style={{float: "right", marginRight: "10px" , color: "#FDD36D", marginTop: '3px'}} />
                    </li>
                    <li className="favorite">
                        <Icon.Person /> Test User <Icon.StarFill style={{float: "right", marginRight: "10px" , color: "#FDD36D", marginTop: '3px'}} />
                    </li>
                </ul>
                <h5 style={{display: "block", marginTop: '1em'}} className="text-muted">Direct Messages</h5>
                <ul>
                    <li> <Icon.PersonCircle /> Test User </li>
                    <li>  <Icon.PersonCircle /> Test User </li>
                    <li>  <Icon.PersonCircle /> Test User </li>
                    <li>  <Icon.PersonCircle /> Test User </li>
                    <li>  <Icon.PersonCircle /> Test User </li>
                    <li>  <Icon.PersonCircle /> Test User </li>
                    <li>  <Icon.PersonCircle /> Test User </li>
                    <li>  <Icon.PersonCircle /> Test User </li>
                    <li>  <Icon.PersonCircle /> Test User </li>
                </ul>
                <h5 style={{paddingTop: "1em", display: "block"}} className="text-muted">Groups</h5>
                <ul>
                    <li> <Icon.Hash /> Team 1 </li>
                    <li> <Icon.Hash /> Team 1 </li>
                    <li> <Icon.Hash /> Team 1 </li>
                    <li> <Icon.Hash /> Team 1 </li>
                    <li> <Icon.Hash /> Team 1 </li>
                </ul>
        </>
    )
}

export default ActiveUsers;