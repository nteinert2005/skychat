import React, { useContext, useState, useEffect } from 'react'
import { useHistory } from 'react-router-dom'
import { MainContext } from '../../mainContext'
import { SocketContext } from '../../socketContext'

import { Container, Row, Form, Button } from "react-bootstrap"

import { useToast } from "@chakra-ui/react"
import { UsersContext } from '../../usersContext'

import userRooms from '../../userRooms';



const Login = () => {
    const socket = useContext(SocketContext)
    const { name, setName, room, setRoom } = useContext(MainContext)
    const history = useHistory()
    const toast = useToast()
    const { setUsers } = useContext(UsersContext)
    //Checks to see if there's a user already present


    useEffect(() => {
        socket.on("users", users => {
            setUsers(users)
        })
    })

    const userTable = (user) => {
        for(var i =0; i < userRooms.length; i++){
            if(userRooms[i].user == user){
                setRoom(userRooms[i].room);
                break;
            }
        }
    }

    const setUser = (name) => {
        setName(name);
        userTable(name);
    }    


    //Emits the login event and if successful redirects to chat and saves user data
    const handleClick = () => {
        socket.emit('login', { name, room }, error => {
            if (error) {
                console.log(error)
            }
            history.push('/chat')
            return toast({
                position: "top",
                title: "Hey there",
                description: `Welcome to ${room}`,
                status: "success",
                duration: 5000,
                isClosable: true,
            })
        })
    }

    return (
        <Container>
            <Row>
                <h1> Hello. <br /> Welcome Back. </h1>
                <Form>
                    <Form.group controlId="formUsername">
                        <Form.label> Username </Form.label>
                        <Form.control type="textbox" placeholder="Enter username"></Form.control>
                    </Form.group>
                </Form> 
                <Button  size="lg" block variant="outline-primary">
                    Login 
                </Button>
        
            </Row>
        </Container>

        // <Container className="loginPage" component="main" max-Width='xs'>
        //     <Avatar>
        //         <LockOutlineIcon />
        //     </Avatar>
        //     <Typography component="h1" variant="h5" style={{marginTop: '1em'}}>
        //         Hello. <br />
        //         Welcome Back.
        //     </Typography>
        //     <form noValidate>
        //         <Grid container spacing={2}>
        //             <Grid item xs={12} sm={6}>
        //                 <TextField
        //                     autoComplete="username"
        //                     name="username"
        //                     required
        //                     fullWidth
        //                     id="username"
        //                     label="Username"
        //                     autoFocus
        //                     style={{marginTop: '1em'}}
        //                     onBlur={ (e)=> { setUser(e.target.value)} }
        //                 />
        //                 <Button
        //                     fullwidth
        //                     variant="contained"
        //                     color="primary"
        //                     style={{marginTop: '1em', width: "100%"}}
        //                     onClick={handleClick}
        //                 >
        //                     Login
        //                 </Button>
        //             </Grid>
        //         </Grid>
        //     </form>
        // </Container>
        // <Flex className='login' flexDirection='column' mb='8'>
        //     <Heading as="h1" size="4xl" textAlign='center' mb='8' fontWeight='600' letterSpacing='-2px'>SkyChat</Heading>
        //     <Flex className="form" gap='1rem' flexDirection={{ base: "column", md: "row" }}>
        //         <Input variant='filled' mr={{ base: "0", md: "4" }} mb={{ base: "4", md: "0" }} type="text" placeholder='User Name' value={name} onBlur={e=> userTable(e.target.value)} onChange={e => setName(e.target.value)} />
        //         <IconButton colorScheme='blue' isRound='true' icon={<RiArrowRightLine />} onClick={handleClick}></IconButton>
        //     </Flex>
        // </Flex>
    )
}

export default Login