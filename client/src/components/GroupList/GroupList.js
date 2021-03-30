import React, {useState,  useContext, useEffect, Component } from 'react';
import { Link, useHistory } from 'react-router-dom'
import { MainContext } from '../../mainContext'
import { SocketContext } from '../../socketContext'
import { UsersContext } from '../../usersContext'
import axios from 'axios';

export default class GroupList extends Component {
    constructor(props){
        super(props);
        this.state = {
            users: []
        }
    }

    getUsers(){
        let requestURL;
        if(process.env.NODE_ENV != 'production'){
            requestURL = "http://localhost:5151"
        } else {
            requestURL = "http://skywriterchat.herokuapp.com"
        }
        
        axios.get(requestURL+"/api/getUsers").then(res => {
            var data = res.data;
            //console.log(data);
            this.setState({
                users: data 
            });
        })
    }

    componentDidMount(){
        this.getUsers();
    }

    componentDidUpdate(){
        this.getUsers();
    }

    render(){
        return(
            <>
                <ul>
                    {this.state.users.map(u => (<li key={u.id}>{u.name}</li>))}
                </ul>
            </>
        )
    }
}