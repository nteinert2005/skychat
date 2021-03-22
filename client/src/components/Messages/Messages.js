import React from 'react'
import { useHistory } from 'react-router-dom'


const Conversation = (prop) => {
    var userID = prop.match.params.id;
    return(
        <>
            <h1> Conversation</h1>
            <h5>{userID}</h5>
        </>
    )
}

export default Conversation 