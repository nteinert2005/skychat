import { IconButton } from '@chakra-ui/react'
import React from 'react'
import { BiArrowBack } from 'react-icons/bi'
import { Redirect, useHistory } from 'react-router-dom'
export default function DefaultPage() {
    const history = useHistory()
    const redirect = () => history.push('/')
    return (
        <div>
            Go Home. 
        </div>
    )
}