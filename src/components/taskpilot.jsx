import React, { useState, useEffect, useRef } from 'react';
import { TextField, Container, Box } from '@mui/material';
import axios from 'axios';
import Typography from '@mui/material/Typography';
import LandingPage from './landingPage';
import taskData from './data.json';
import IconButton from '@mui/material/IconButton';
import SendIcon from '@mui/icons-material/Send';
import InputAdornment from '@mui/material/InputAdornment';
import image from './image.png';
import CollapsibleTreeNode from './collapsibleTreeNode';

const TaskPilotPro = () => {
    const [messages, setMessages] = useState([]);
    const [inputValue, setInputValue] = useState('');
    const chatContainerRef = useRef(null);
    const [isFetching, setIsFetching] = useState(false);
    const [showLandingPage, setShowLandingPage] = useState(true);

    // Function to handle card click event
    const handleCardClick = async (card) => {
        setShowLandingPage(false);
        try {
            console.log('Card clicked:', card);
            sendConversation("Get me the feature level summary for the task 2");
        } catch (error) {
            console.error('Error sending message to backend:', error);
        }
    };

    // Fetch recent conversations when component mounts
    useEffect(() => {
        fetchRecentConversations();
    }, []);

    // Scroll to the bottom of the chat container whenever messages change
    useEffect(() => {
        if (chatContainerRef && chatContainerRef.current) chatContainerRef.current.scrollTop = chatContainerRef.current.scrollHeight;
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
            //const response = await axios.post('http://udayanbaidya:3004/recent-conversations', { userId: userId });
            const response = await axios.get(`http://localhost:3004/recent-conversations/?userId=${userId}`);
            const conversations = response.data;
            console.log('Fetch RecentConversations:', conversations)
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

    const fetchUpdatedConversations = async () => {
        if (isFetching) {
            return
        }
        setIsFetching(true);
        const urlParams = new URLSearchParams(window.location.search);
        const userId = urlParams.get('userid');
        const lastMessage = messages[messages.length - 1];
        console.log("lastMessage", messages, lastMessage)
        const Timestamp = lastMessage?.timestamp || Date.now() - 1000;
        if (!userId) {
            console.error('User ID is missing in the URL');
            return;
        }

        try {
            //const response = await axios.post('http://udayanbaidya:3004/recent-conversations', { userId: userId, lastTimestamp: timestamp });
            const response = await axios.get(`http://localhost:3004/recent-conversations/?userId=${userId}&lastTimestamp=${Timestamp}`);
            const conversations = response.data;
            console.log('Fetch UpdatedConversations:', conversations, Timestamp);
            // Add updated conversations to the messages state
            const newMessages = conversations.map(conversation => ({
                "message": conversation.Message,
                "sender": conversation.Role,
                "timestamp": conversation.TimeStamp
            })).sort((a, b) => a.timestamp - b.timestamp);
            console.log('New messages:', newMessages)
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
            await fetchUpdatedConversations();
        }, 1000);

        // Clear the interval when the component is unmounted
        return () => clearInterval(intervalId);
    }, [messages]); // Empty dependency array

    const handleSubmit = async (e) => {
        if (e) { e.preventDefault(); }
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
        console.log('Messages on user input:', messages);
    };

    const sendMessageToBackend = async (message) => {
        const urlParams = new URLSearchParams(window.location.search);
        const userId = urlParams.get('userid');
        const inputString = message;
        const userDisplayName = userId;
        console.log('message backend:', message, userId, inputString, userDisplayName);
        if (!userId) {
            console.error('User ID is missing in the URL');
            return;
        }
        // const requestBody = {
        //     userId: userId,
        //     input: message
        // };

        try {
            //const response = await axios.post('http://udayanbaidya:3004/conversation', requestBody);
            const response = await axios.get(`http://localhost:3004/conversation/?userId=${userId}&input="${inputString}"`);
            return response;

        } catch (error) {
            console.error('Error getting post response:', error);
        }
    };

    const urlParams = new URLSearchParams(window.location.search);
    const userId = urlParams.get('userid');

    return (
        <Container>
            <Box mt={4}>
                {showLandingPage && messages.length === 0 ? (
                    <>
                        <div style={{ display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center', paddingBottom: '10px' }}>
                            <img src={image} alt="ProjectPilot logo" style={{ width: '80px', height: '80px' }} />
                            <Typography variant="h6" style={{ fontWeight: 'bold', fontFamily: 'Segoe UI' }}>ProjectPilot</Typography>
                            <Typography variant="caption" style={{ fontFamily: 'Segoe UI', fontWeight: 'normal' }}>Empowering teams , streamlining communications</Typography>
                        </div>
                        <Box>
                            <Typography variant="body1" style={{ textAlign: 'center', fontFamily: 'Segoe UI', fontWeight: 'normal' }}>Hey {userId}, welcome to ProjectPilot!</Typography>
                        </Box>
                        <Box style={{ paddingBottom: '10px' }}>
                            <Typography variant="body1" style={{ textAlign: 'center', fontFamily: 'Segoe UI', fontWeight: 'normal' }}>Here are the projects that you are associated with. Please click to get the details:</Typography>
                        </Box>
                        <LandingPage onCardClick={handleCardClick} />
                    </>
                ) : (
                    <Box
                        display="flex"
                        flexDirection="column"
                        alignItems="flex-end"
                        style={{ height: '67vh', overflowY: 'auto', paddingTop: '10px' }}
                        ref={chatContainerRef}
                    >
                        {messages.map((msg, index) => {
                            if (!msg.message) return null; // If message is empty, don't render it
                            let message;
                            try {
                                message = JSON.parse(msg.message);
                            } catch (error) {
                                message = msg.message;
                            }
                            console.log('Message:', message);
                            return (
                                <React.Fragment key={index}>
                                    <Typography variant="caption" color="textSecondary" alignSelf={msg.sender === 'user' ? 'flex-end' : 'flex-start'} mr={1} >
                                        {msg.sender === 'user' ? 'You' : 'ProjectPilot'} &nbsp; {new Date(msg.timestamp).toLocaleDateString(undefined, { day: '2-digit', month: '2-digit' })} {new Date(msg.timestamp).toLocaleTimeString(undefined, { hour: '2-digit', minute: '2-digit', hour12: false })}
                                    </Typography>
                                    <Box textAlign={msg.sender === 'user' ? 'right' : 'left'}
                                        alignSelf={msg.sender === 'user' ? 'flex-end' : 'flex-start'}
                                        mb={1}
                                        mr={1}
                                    >
                                        {typeof message === 'object' ? (
                                            <CollapsibleTreeNode task={message} />
                                        ) : (
                                            <Box
                                                bgcolor={msg.sender === 'user' ? '#E6E6FA' : '#F5F5F5'}
                                                p={1}
                                                borderRadius={2}
                                                style={{ fontFamily: 'Segoe UI', fontSize: '14px' }}
                                            >
                                                {message}
                                            </Box>
                                        )}
                                    </Box>
                                </React.Fragment>
                            )
                        })}
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
                                InputProps={{
                                    endAdornment: (
                                        <InputAdornment position="end">
                                            <IconButton type="submit" style={{ backgroundColor: '#E6E6FA', color: 'black' }}>
                                                <SendIcon />
                                            </IconButton>
                                        </InputAdornment>
                                    ),
                                }}
                            />
                        </Box>
                    </form>
                </Box>
            </Box>
        </Container>
    );
};

export default TaskPilotPro;