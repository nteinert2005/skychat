import React from 'react';

import Sidebar from '../../components/Sidebar/Sidebar';
import ActiveUsers from '../../components/ActiveUsers/ActiveUsers';
import Room from '../../components/Room/Room';
import { Container, Row, Col } from 'react-bootstrap';

const Chat = () => {
    return(
        <>
            <Container fluid>
                <Row>
                    <Col lg={1}>
                        <Sidebar />
                    </Col>
                    <Col lg={2} className="activeusers">
                        <ActiveUsers />
                    </Col>
                    <Col lg={9} className="chat">
                        <Room />
                    </Col>
                </Row>
            </Container>
        </>
    )
}

export default Chat;