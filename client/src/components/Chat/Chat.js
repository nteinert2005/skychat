import React, { useContext, useEffect, useState } from 'react'
import { Link, useHistory } from 'react-router-dom'
import { MainContext } from '../../mainContext'
import { SocketContext } from '../../socketContext'
import { UsersContext } from '../../usersContext'

import Sidebar from '../../components/Sidebar/Sidebar';
import ActiveUsers from '../../components/ActiveUsers/ActiveUsers';
import Room from '../../components/Room/Room';
import { Container, Row, Col } from 'react-bootstrap';

const Chat = () => {
    const { name, room, setName, setRoom } = useContext(MainContext)
    const socket = useContext(SocketContext)
    const [message, setMessage] = useState('')
    const [messages, setMessages] = useState([])
    const { users } = useContext(UsersContext)
    const history = useHistory()

    useEffect(() => { if (!name) return history.push('/') }, [history, name])
    useEffect(() => { if (!room) return history.push('/') }, [history, room])
    
    useEffect(() => {
        if(name != ''){
            socket.emit('test', {
                username: name,
                defaultRoom: room
            });
        }
    }, []);

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