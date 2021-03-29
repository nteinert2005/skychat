import React from 'react';

import * as Icon from 'react-bootstrap-icons';
import { Row, Col, Nav, Form, ListGroup } from 'react-bootstrap';


const Room = () => {
    return(
        <div>
            <Row style={{borderBottom: "1px solid gray", marginLeft: "-2em", paddingBottom: "1em"}}>
                <Col lg={8}>
                    <div className="room-header">
                        <h4><Icon.Hash color="gray" /> Team 1</h4>
                        <span className="text-muted roomCount">5 members</span>
                    </div>
                </Col>
                <Col lg={4}>
                    <div className="room-bar">
                        <Nav> 
                            <Nav.Item>
                                <Nav.Link href="">
                                    <Icon.PinAngle size={24}/>
                                </Nav.Link>
                            </Nav.Item>
                            <Nav.Item>
                                <Nav.Link href="">
                                    <Icon.InfoCircle size={24} />
                                </Nav.Link>
                            </Nav.Item>
                            <Nav.Item>
                                <Nav.Link href="">
                                    <Icon.StarFill color="#FDD36D" size={24} />
                                </Nav.Link>
                            </Nav.Item>
                            <Nav.Item>
                                <Nav.Link href="">
                                    <Icon.GearFill size={24} />
                                </Nav.Link>
                            </Nav.Item>
                            <Nav.Item>
                                <Nav.Link href="">
                                    <Icon.ThreeDotsVertical size={24} />
                                </Nav.Link>
                            </Nav.Item>
                        </Nav>
                    </div>
                </Col>
            </Row>
            <Row style={{ height: "560px" }}>
                <ListGroup>
                    <ListGroup.Item>
                        <Row>
                            <Col xs={1}>
                                <img src="https://cdn1.iconfinder.com/data/icons/avengers-1/512/avangers_icon003-512.png" />
                            </Col>
                            <Col xs={11} style={{marginLeft: "-30px" }}>
                                <span style={{width: "80%", display: "block"}}> Test User </span> 
                                <span className="text-muted">Socket ID: jalkd0982340ij2l3kr</span>
                            </Col> 
                        </Row>
                        <Row className="chat-msg">
                        <p>Lorem ipsum dolor sit amet, consectetur adipiscing elit. Pellentesque pretium augue eget lorem feugiat tempus. Aenean eleifend ex sed urna malesuada sodales. Donec tristique sed dui ut elementum. Aliquam erat volutpat. Nunc lacinia ante at sagittis posuere. Praesent viverra euismod nunc, faucibus porta nibh facilisis eu. Aenean a luctus sapien. In hac habitasse platea dictumst. Nunc euismod ornare tempor. Aenean dapibus laoreet faucibus. Integer lacinia tortor nec blandit dictum.
                        Pellentesque viverra, lorem quis mattis consectetur, mauris lorem varius purus, vel tempor metus velit eget lorem. Vivamus volutpat posuere ligula, ac consectetur magna molestie a. Donec a semper orci. Class aptent taciti sociosqu ad litora torquent per conubia nostra, per inceptos himenaeos. Aenean ac metus sodales, cursus libero quis, dignissim massa. Integer quis justo feugiat, feugiat risus a, consectetur ipsum. Phasellus nec enim efficitur, tempor lectus a, auctor sapien. </p>
                        </Row>
                    </ListGroup.Item>
                    <ListGroup.Item>
                        <Row>
                            <Col xs={1}>
                                <img src="https://cdn1.iconfinder.com/data/icons/avengers-1/512/avangers_icon003-512.png" />
                            </Col>
                            <Col xs={11} style={{marginLeft: "-30px" }}>
                                <span style={{width: "80%", display: "block"}}> Test User </span> 
                                <span className="text-muted">Socket ID: jalkd0982340ij2l3kr</span>
                            </Col> 
                        </Row>
                        <Row className="chat-msg">
                        <p>Lorem ipsum dolor sit amet, consectetur adipiscing elit. Pellentesque pretium augue eget lorem feugiat tempus. Aenean eleifend ex sed urna malesuada sodales. Donec tristique sed dui ut elementum. Aliquam erat volutpat. Nunc lacinia ante at sagittis posuere. Praesent viverra euismod nunc, faucibus porta nibh facilisis eu. Aenean a luctus sapien. In hac habitasse platea dictumst. Nunc euismod ornare tempor. Aenean dapibus laoreet faucibus. Integer lacinia tortor nec blandit dictum.
                        Pellentesque viverra, lorem quis mattis consectetur, mauris lorem varius purus, vel tempor metus velit eget lorem. Vivamus volutpat posuere ligula, ac consectetur magna molestie a. Donec a semper orci. Class aptent taciti sociosqu ad litora torquent per conubia nostra, per inceptos himenaeos. Aenean ac metus sodales, cursus libero quis, dignissim massa. Integer quis justo feugiat, feugiat risus a, consectetur ipsum. Phasellus nec enim efficitur, tempor lectus a, auctor sapien. </p>
                        </Row>
                    </ListGroup.Item>
                </ListGroup>
            </Row>
            <Row style={{ bottom: "0", left: "0", width: "100%"}}>
                <Form>
                    <Form.Group controlId="msgbox">
                        <Form.Control type="textarea" placeholder="Enter your message..." />
                    </Form.Group>
                </Form>
            </Row>
            
            
        </div>
    );
}

export default Room;