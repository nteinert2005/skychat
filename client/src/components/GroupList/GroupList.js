import React, { useState, useEffect } from 'react';
import axios from 'axios';

const GroupList = () => {
    const [ activeUsers, setUsers ] = useState([]);

    const getUsers = () => {
        let requestURL;
        if(process.env.NODE_ENV != 'production'){
            requestURL = "http://localhost:5151"
        } else {
            requestURL = "http://skywriterchat.herokuapp.com"
        }
        axios.get(requestURL+'/api/getUsers').then(res => {
            //var data = res.data;
            //console.log(res.data);
            setUsers(res.data);
        })
    }

    useEffect( () => {
        getUsers();
    }, [activeUsers]);

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