import React, { useState, useContext, useEffect } from 'react';
import axios from 'axios';
import { SocketContext } from '../../socketContext'
import { MainContext } from '../../mainContext'

import * as Icon from 'react-bootstrap-icons';
import { Toast } from 'react-bootstrap';


let requestURL;
if(process.env.NODE_ENV != 'production'){
    requestURL = "http://localhost:5151"
} else {
    requestURL = "http://skywriterchat.herokuapp.com"
}


const GroupList = () => {
    const [ activeUsers, setUsers ] = useState([]);
    const { name, room } = useContext(MainContext)
    const socket = useContext(SocketContext)
    const [ show, setShow ] = useState(false);
    const [ privateRoom, setPrivate ] = useState('');

    const getUsers = async () => {
        await axios.get(requestURL+'/api/getUsers').then(res => {
            setUsers(res.data);
        })
    }

    useEffect( () => {
        socket.on('user_join', () => {
            getUsers();
        });
        
        socket.on('user_left', () => {
            getUsers();
        })

        socket.on('private_started', (data) => {
            var privateRoom = data.newRoom;  
            setPrivate(privateRoom);     
            setShow(true);     
        })
    }, []);

    // useEffect( () => {
    //     socket.on('users', (data) => {
    //         axios.get(requestURL+'/api/getUsers').then(res => {
    //             //var data = res.data;
    //             //console.log(res.data);
    //             setUsers(res.data);
    //         })
    //     })
    // }, []);

    // useEffect( () => {
    //     socket.on('user_disconnected', (data) => {
    //         axios.get(requestURL+'/api/getUsers').then(res => {
    //             //var data = res.data;
    //             //console.log(res.data);
    //             setUsers(res.data);
    //         })
    //     })
    // }, []);

    const startPrivate = (el) => {
        var sendTo = el.target.getAttribute('data-name');
        console.log(sendTo);
        socket.emit('start_private', {
            socketTo: sendTo
        })
    }

    return(
        <>
            <ul>
                {
                    activeUsers.map(function(d, idx){
                        if(d.name === name){
                            return (<li key={idx} data-name={d.name}> {d.name}  </li>)
                        } else {
                            return (<li key={idx} data-name={d.name} onClick={startPrivate.bind(this)}>{d.name} <Icon.CircleFill data-name={d.name} style={{float: 'right', color: 'green'}} /> </li>)
                        }
                    })
                }
            </ul>

            <Toast 
                onClose={() => setShow(false)}
                show={show} 
                delay={3000} 
                autohide
                style={{
                    position: 'absolute',
                    top: 0,
                    right: '-400px',
                    color: 'black',
                    zIndex: 1000
                }}>
                    <Toast.Header>
                        <strong className="mr-auto">New Chat</strong>
                        <small> Just now</small>
                    </Toast.Header>
                    <Toast.Body>
                        Join the room <a href={ '/room/'+privateRoom }>here.</a>
                    </Toast.Body>
            </Toast>
        </>
    )
}

export default GroupList;