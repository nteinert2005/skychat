import React, { useContext, useState, useEffect } from 'react'
import { useHistory } from 'react-router-dom'
import { MainContext } from '../../mainContext'
import { UsersContext } from '../../usersContext'
import { SocketContext } from '../../socketContext'
import userRooms from '../../userRooms';
import axios from 'axios';

import { Container, Row, Form, Button }  from 'react-bootstrap'


const Home = () => {
    const { name, setName, room, setRoom } = useContext(MainContext)
    const history = useHistory()
    const { setUsers } = useContext(UsersContext)
    const socket = useContext(SocketContext)

    const setUser = (name) => {
        setName(name);
        userTable(name);
    }


    const userTable = (user) => {
        for(var i =0; i < userRooms.length; i++){
            if(userRooms[i].user == user){
                setRoom(userRooms[i].room);
                break;
            }
        }
    }
    


    const handleClick = (e) => {
        e.preventDefault();
        let requestURL;
        if(process.env.NODE_ENV === 'production'){
            requestURL = 'https://skywriterchat.herokuapp.com';
        } else {
            requestURL = "http://localhost:5151";
        }

        axios.get(requestURL+"/auth/login", {
            params: {
                username: name, 
                room: room
            }
        })
        .then(function(response) {
            //console.log(response);
            if(response.data){
                history.push('/chat');
            } else {
                history.push('/');
            }
        })
    }

    return(
        <>
            <Container fluid className="login">
                <div className="loginBox">
                    <h1> Hello. </h1>
                    <h1> Welcome Back </h1>
                    <Form>
                        <Form.Group controlId="formLogin">
                            <Form.Label> Username </Form.Label>
                            <Form.Control 
                                type="text" 
                                placeholder="Enter Username" 
                                onBlur={ (e) => setUser(e.target.value) }
                            />
                        </Form.Group>
                        <Button 
                            block 
                            variant="outline-light"
                            onClick={handleClick}
                        >
                            Login 
                        </Button>
                    </Form>
                </div>
            </Container>
        </>
    )

}


export default Home;
