import React, { useState, useEffect, useRef } from 'react';
import { TextField, Button, Container, Box } from '@mui/material';
import axios from 'axios';
import Typography from '@mui/material/Typography';
import LandingPage from './landingPage';
 
import IconButton from '@mui/material/IconButton';
import SendIcon from '@mui/icons-material/Send';
import InputAdornment from '@mui/material/InputAdornment';
import image from './image.png'; 

const TaskPilotPro = () => {
    const [messages, setMessages] = useState([]);
    const [inputValue, setInputValue] = useState('');
    const chatContainerRef = useRef(null);
    const [isFetching, setIsFetching] = useState(false);
    const [showLandingPage, setShowLandingPage] = useState(true);
   
    const handleCardClick = async (card) => {
    setShowLandingPage(false);
    try {
        console.log('Card clicked:', card);
        sendConversation("Get me the feature level summary for the task #2");
       
        // const response = await sendMessageToBackend("Get me the feature level summary for the task #2");
        // console.log('Response from backend:', response.data);
    } catch (error) {
        console.error('Error sending message to backend:', error);
    }
};
 
    useEffect(() => {
        // Fetch recent conversations when component mounts
        fetchRecentConversations();
    }, []);
 
    useEffect(() => {
        // Scroll to the bottom of the chat container whenever messages change
        if(chatContainerRef && chatContainerRef.current ) chatContainerRef.current.scrollTop = chatContainerRef.current.scrollHeight;
    }, [messages]);
 
 
    // Calling the backend to get the recent conversations for a particular user id.
    const fetchRecentConversations = async () => {
        if (isFetching) {
            return
        }
        const urlParams = new URLSearchParams(window.location.search);
        const userId = urlParams.get('userid');
        if (!userId) {
            console.error('User ID is missing in the URL');
            return;
        }
        setIsFetching(true);
 
        try {
            const response = await axios.post('http://udayanbaidya:3004/recent-conversations', { userId: userId });
            const conversations = response.data;
            // Add recent conversations to the messages state
            const newMessages = conversations
                .map(conversation => ({
                    message: conversation.Message,
                    sender: conversation.Role,
                    timestamp: conversation.TimeStamp
                }))
                .sort((a, b) => a.timestamp - b.timestamp);
            setMessages(newMessages);
        } catch (error) {
            console.error('Error fetching recent conversations:', error);
        }
        setIsFetching(false);
    };
 
    const fetchUpdatedConversations = async (timestamp) => {
        if (isFetching) {
            return
        }
        setIsFetching(true);
        const urlParams = new URLSearchParams(window.location.search);
        const userId = urlParams.get('userid');
        if (!userId) {
            console.error('User ID is missing in the URL');
            return;
        }
 
        try {
            const response = await axios.post('http://udayanbaidya:3004/recent-conversations', { userId: userId, lastTimestamp: timestamp });
            const conversations = response.data;
            console.log('Updated conversations:', conversations, timestamp);
            // Add updated conversations to the messages state
            const newMessages = conversations.map(conversation => [
                { message: conversation.Message, sender: conversation.Role, timestamp: conversation.TimeStamp }
            ]).sort((a, b) => a.timestamp - b.timestamp);
            if (newMessages.length > 0) {
                setMessages(prevMessages => [...prevMessages, ...newMessages]); // Appends new messages to the existing ones
            }
        } catch (error) {
            console.error('Error fetching updated conversations:', error);
        }
        setIsFetching(false);
    };
 
    useEffect(() => {
        const intervalId = setInterval(async () => {
            await fetchUpdatedConversations(Date.now());
        }, 1000);

        // Clear the interval when the component is unmounted
        return () => clearInterval(intervalId);
    }, []); // Empty dependency array

    const handleSubmit = async (e) => {
        if(e){e.preventDefault();}
        if (inputValue.trim() !== '') {
            await sendConversation(inputValue);
        }

    };
    async function sendConversation(text) {
        setIsFetching(true);
        sendMessage(text, 'user', Date.now());
        setInputValue('');
        try {
            const botResponse = await sendMessageToBackend(text);
            console.log('Bot response:', botResponse.data);
            sendMessage(botResponse.data.message, 'assistant', Date.now());

        } catch (error) {
            console.error('Error getting bot response:', error);
            sendMessage('Error occurred. Please try again.', 'assistant', Date.now());
        }
        setIsFetching(false);
    }
 
    const sendMessage = (message, sender, timestamp) => {
        setMessages((prevMessages) => [...prevMessages, { message, sender, timestamp }]);
    };
 
    const sendMessageToBackend = async (message) => {
        const requestBody = {
            userId: "111",
            input: message
        };
 
        try {
            const response = await axios.post('http://udayanbaidya:3004/conversation', requestBody);
            return response;
        } catch (error) {
            console.error('Error getting post response:', error);
        }
    };
 
    const urlParams = new URLSearchParams(window.location.search);
    const userId = urlParams.get('userid');

    return (
        <Container style={{ paddingTop: '10px', height: '100%' }}>
            <Box mt={4}>
                {showLandingPage && messages.length === 0 ? (
                    <>
                        <div style={{ display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center', paddingBottom: '20px' }}>
                            <img src={image} alt="ProjectPilot logo" style={{ width: '150px', height: '150px' }} />
                            <Typography variant="h5" style={{ fontWeight: 'bold', fontFamily: 'Segoe UI' }}>ProjectPilot</Typography>
                            <Typography variant="subtitle2" style={{ fontFamily: 'Segoe UI', fontWeight: 'normal' }}>Empowering teams , streamlining communications</Typography>
                        </div>
                        <Box>
                            <Typography variant="h7" style={{ textAlign: 'left', fontFamily: 'Segoe UI', fontWeight: 'normal' }}>Hey {userId}, welcome to TaskPilot!</Typography>
                        </Box>
                        <Box>
                            <Typography variant="h7" style={{ textAlign: 'left', fontFamily: 'Segoe UI', fontWeight: 'normal' }}>Here are the projects that you are associated with. Please click to get the details:</Typography>
                        </Box><LandingPage onCardClick={handleCardClick} />
                    </>
                ) : (
                    <Box
                    display="flex"
                    flexDirection="column"
                    alignItems="flex-end"
                    style={{ height: '50vh', overflowY: 'auto' }}
                    ref={chatContainerRef}
                >
                    {messages.map((msg, index) => (<>
                        <Typography variant="caption" color="textSecondary" alignSelf={msg.sender === 'user' ? 'flex-end' : 'flex-start'} mr={1} >
                            {msg.sender === 'user' ? 'You' : 'TaskPilot'} &nbsp; {new Date(msg.timestamp).toLocaleDateString(undefined, { day: '2-digit', month: '2-digit' })} {new Date(msg.timestamp).toLocaleTimeString(undefined, { hour: '2-digit', minute: '2-digit', hour12: false })}
                        </Typography>
                        <Box key={index} textAlign={msg.sender === 'user' ? 'right' : 'left'}
                            alignSelf={msg.sender === 'user' ? 'flex-end' : 'flex-start'}
                            mb={1}
                            mr={1}
                        >
                            <Box
                                bgcolor={msg.sender === 'user' ? '#E6E6FA' : '#F5F5F5'}
                                p={1}
                                borderRadius={2}
                                style={{ fontFamily: 'Segoe UI', fontSize: '14px' }}
                            >
                                {msg.message}
                            </Box>
                        </Box>
                    </>
                    ))}
                </Box>
                )}
               
                <Box mt={4}>
                    <form onSubmit={handleSubmit}>
                        <Box display="flex" alignItems="center">
                            <TextField
                                label="Type a message..."
                                variant="outlined"
                                fullWidth
                                value={inputValue}
                                onChange={(e) => setInputValue(e.target.value)}
                            />
                            <Box ml={2}>
                                <IconButton type="submit" style={{ backgroundColor: '#E6E6FA', color: 'black' }}>
                                    <SendIcon />
                                </IconButton>
                            </Box>
                        </Box>
                    </form>
                </Box>
            </Box>
        </Container>
    );
};
 
export default TaskPilotPro;