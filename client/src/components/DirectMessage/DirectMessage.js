import React, { useContext, useState, useEffect } from 'react';
import { SocketContext } from '../../socketContext'
import { MainContext } from '../../mainContext'
import axios from 'axios';

import * as Icon from 'react-bootstrap-icons';


const DirectMessageList = () => {
    const { name, room, setName, setRoom } = useContext(MainContext)
    const [ roomList, setRoomList ] = useState([]);
    const socket = useContext(SocketContext)

    useEffect( () => {
        let requestURL;
        if(process.env.NODE_ENV != 'production'){
            requestURL = "http://localhost:5151"
        } else {
            requestURL = "http://skywriterchat.herokuapp.com"
        }

        axios.get(requestURL+"/api/getRooms", {
            params: {
                username: name
            }
        })
        .then(response => {
            socket.emit('findRooms', null);
        });
    }, [])

    useEffect( () => {
        socket.on('allRooms', data => {
            setRoomList(data.roomList);
        });
    }, []);

    return(
        <>
            <ul>
                { 
                    roomList.map(function(d, idx) {
                        return(<li key={idx}>{d}</li>)
                    })
                }
            </ul>
        </>
    );
}

export default DirectMessageList;