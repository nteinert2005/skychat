import React, { useState, useContext, useEffect } from 'react';
import axios from 'axios';
import { SocketContext } from '../../socketContext'

let requestURL;
if(process.env.NODE_ENV != 'production'){
    requestURL = "http://localhost:5151"
} else {
    requestURL = "http://skywriterchat.herokuapp.com"
}


const GroupList = () => {
    const [ activeUsers, setUsers ] = useState([]);
    const socket = useContext(SocketContext)

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
        console.log(el.currentTarget.getAttribute('data-name'));
    }

    return(
        <>
            <ul>
                {
                    activeUsers.map(function(d, idx){
                        return (<li key={idx} data-name={d.name} onClick={startPrivate.bind(this)}>{d.name}</li>)
                    })
                }
            </ul>
        </>
    )
}

export default GroupList;