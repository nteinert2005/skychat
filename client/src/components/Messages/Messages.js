import React from 'react'
import { useHistory } from 'react-router-dom'
import { Flex, Heading, IconButton, Input } from "@chakra-ui/react"
import './Messages.scss'

const Conversation = (prop) => {
    var userID = prop.match.params.id;
    return(
        <>
            <Heading as="h1" size="4xl" textAlign='center' mb='8' fontFamily='DM Sans' fontWeight='600' letterSpacing='-2px'>Conversation</Heading>
            <Flex>
                {userID}
            </Flex>
        </>
    )
}

export default Conversation 