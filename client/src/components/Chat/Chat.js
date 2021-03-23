import React, { useContext, useEffect, useState } from 'react'
import { Link, useHistory } from 'react-router-dom'
import { MainContext } from '../../mainContext'
import { SocketContext } from '../../socketContext'
import { Box, Flex, Heading, IconButton, Text, Menu, Button, MenuButton, MenuList, MenuItem } from "@chakra-ui/react"
import { FiList } from 'react-icons/fi'
import { BiMessageDetail } from 'react-icons/bi'
import { RiSendPlaneFill } from 'react-icons/ri'
import ScrollToBottom from 'react-scroll-to-bottom';
import { useToast, Badge } from "@chakra-ui/react"
import './Chat.scss'
import { UsersContext } from '../../usersContext'

const Chat = () => {
    const { name, room, setName, setRoom } = useContext(MainContext)
    const socket = useContext(SocketContext)
    const [message, setMessage] = useState('')
    const [messages, setMessages] = useState([])
    const { users } = useContext(UsersContext)
    const history = useHistory()
    const toast = useToast()

    window.onpopstate = e => logout()
    //Checks to see if there's a user present
    useEffect(() => { if (!name) return history.push('/') }, [history, name])


    useEffect(() => {
        socket.on("message", msg => {
            setMessages(messages => [...messages, msg]);
        })


        socket.on('private-message-arrived', data => {
            toast({
                position: "bottom-left",
                title: "Private Message from "+data.from,
                description: data.msg, 
                status: "info",
                duration: 5000,
                isClosable: true
            })
        })


        socket.on('joinSecond_accept', (roomname) => {
            toast({
                position: "top",
                title: "Added to Room",
                description: "Successfully added to "+roomname,
                status: "success",
                duration: 5000,
                isClosable: true 
            })
        })

        socket.on('no-found-user', () => {
            toast({
                position: "bottom-left",
                title: "No User Found",
                description: "User wasn't reachable",
                status: "error",
                duration: 5000,
                isClosable: true
            })
        })

        socket.on("notification", notif => {
            toast({
                position: "top",
                title: notif?.title,
                description: notif?.description,
                status: "success",
                duration: 5000,
                isClosable: true,
            })
        })
    }, [socket, toast])


    const handleSendMessage = () => {
        socket.emit('sendMessage', message, () => setMessage(''))
        setMessage('')
    }

    const joinSecond = (event) => {
        console.log('joined second btn pressed')
        //var name1 = event.target.value;
        socket.emit('joinSecond_invite', null);
    }

    const logout = () => {
        setName(''); setRoom('');
        history.push('/')
        history.go(0)
    }

    return (
        <Flex className='room' flexDirection='column' width={{ base: "100%", sm: '575px' }} height={{ base: "100%", sm: "auto" }}>
            <Heading className='heading' as='h4' bg='white' p='1rem 1.5rem' borderRadius='10px 10px 0 0'>
                <Flex alignItems='center' justifyContent='space-between'>
                    <Menu >
                        <MenuButton as={IconButton} icon={<FiList />} isRound='true' bg='blue.300' color='white' />
                        <MenuList>
                            {
                                users && users.map(user => {
                                    return (
                                        <MenuItem minH='40px' key={user.id}>
                                            <Text style={{width: "100%"}} fontSize='sm'>{user.name} <Badge variant="solid" colorScheme="green" style={{align: "right"}}>1</Badge>  </Text>
                                        </MenuItem>
                                    )
                                })
                            }
                        </MenuList>
                    </Menu>
                    <Flex alignItems='center' flexDirection='column' flex={{ base: "1", sm: "auto" }}>
                        <Heading fontSize='lg'> {room.slice(0, 1).toUpperCase() + room.slice(1)}</Heading>
                        <Flex alignItems='center'><Text mr='1' fontWeight='400' fontSize='md' opacity='.7' letterSpacing='0' >{name}</Text><Box h={2} w={2} borderRadius='100px' bg='green.300'></Box></Flex>
                    </Flex>
                    <Button style={{marginRight: "10px"}} color="green.500" fontSize="sm" value="testing" onClick={e=> joinSecond(e.target.value)}> Join Another </Button>
                    <Button color='gray.500' fontSize='sm' onClick={logout}  >Logout</Button>
                </Flex>
            </Heading>


            <ScrollToBottom className='messages' debug={false}>
                {messages.length > 0 ?
                    messages.map((msg, i) =>
                    (<Box key={i} className={`message ${msg.user === name ? "my-message" : ""}`} m=".2rem 0">
                        <Text fontSize='xs' opacity='.7' ml='5px' className='user'>{msg.user} from {msg.room}</Text>
                        <Text fontSize='sm' className='msg' p=".4rem .8rem" bg='white' borderRadius='15px' color='white'>{msg.text}</Text>
                    </Box>)
                    )
                    :
                    <Flex alignItems='center' justifyContent='center' mt='.5rem' bg='#EAEAEA' opacity='.2' w='100%'>
                        <Box mr='2'>-----</Box>
                        <BiMessageDetail fontSize='1rem' />
                        <Text ml='1' fontWeight='400'>No messages</Text>
                        <Box ml='2'>-----</Box>
                    </Flex>
                }
            </ScrollToBottom>
            <div className='form'>
                <input type="text" placeholder='Enter Message' value={message} onChange={e => setMessage(e.target.value)} />
                <IconButton colorScheme='green' isRound='true' icon={<RiSendPlaneFill />} onClick={handleSendMessage} disabled={message === '' ? true : false}>Send</IconButton>
            </div>
        </Flex>

    )
}

export default Chat