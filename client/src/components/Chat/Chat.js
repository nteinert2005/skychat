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
    const [messages, setMessages] = useState([])
    const { users, setUsers } = useContext(UsersContext)
    const history = useHistory()

    useEffect(() => { if (!name) return history.push('/') }, [history, name])
    useEffect(() => { if (!room) return history.push('/') }, [history, room])

    useEffect(() => {
        if(name != ''){
            socket.emit('join', {
                username: name,
                defaultRoom: room
            });

            socket.on('test_broadcast', () => {
                console.log('test from the server');
            });

            socket.on('user_join', data => {
                //console.log(data.userMap);
                //users = data.userMap;
                //console.log("users");
                setUsers(data.userMap);
            })
        }
    }, []);

    return(
        <div style={{ position: 'relative' }}>
            <Container fluid>
                <Row>
                    <Col lg={1}>
                        <Sidebar />
                    </Col>
                    <Col lg={2} className="activeusers">
                        <ActiveUsers users={users} />
                    </Col>
                    <Col lg={9} className="chat">
                        <Room />
                    </Col>
                </Row>
            </Container>
        </div>
    )
}

export default Chat;