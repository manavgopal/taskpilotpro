import React, { useState, useEffect, useRef } from 'react';
import { TextField, Button, Container, Box } from '@mui/material';
import axios from 'axios';
import Typography from '@mui/material/Typography';

const TaskPilotPro = () => {
    const [messages, setMessages] = useState([]);
    const [inputValue, setInputValue] = useState('');
    const chatContainerRef = useRef(null);
    const [isFetching, setIsFetching] = useState(false);

    useEffect(() => {
        // Fetch recent conversations when component mounts
        fetchRecentConversations();
    }, []);

    useEffect(() => {
        // Scroll to the bottom of the chat container whenever messages change
        chatContainerRef.current.scrollTop = chatContainerRef.current.scrollHeight;
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
            setMessages(prevMessages => [...prevMessages, ...newMessages]); // Appends new messages to the existing ones
        } catch (error) {
            console.error('Error fetching updated conversations:', error);
        }
        setIsFetching(false);
    };

    useEffect(() => {
        const intervalId = setInterval(async () => {
            // Get the timestamp from the last message
            const lastMessage = messages[messages.length - 1];
            const timestamp = lastMessage.timestamp || Date.now();
            console.log('Last message:', lastMessage);
            console.log('Timestamp:', timestamp);
            await fetchUpdatedConversations(timestamp);
        }, 1000);
        // Clear the interval when the component is unmounted
        return () => clearInterval(intervalId);
    }, [messages]); // Add messages and isFetching to the dependency array

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (inputValue.trim() !== '') {
            sendMessage(inputValue, 'user', Date.now());
            setInputValue('');
            try {
                const botResponse = await sendMessageToBackend(inputValue);
                console.log('Bot response:', botResponse.data);
                sendMessage(botResponse.data.message, 'assistant');

            } catch (error) {
                console.error('Error getting bot response:', error);
                sendMessage('Error occurred. Please try again.', 'assistant');
            }
        }
    };

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


    return (
        <Container>
            <Box mt={4}>
                <Box
                    display="flex"
                    flexDirection="column"
                    alignItems="flex-end"
                    style={{ height: '50vh', overflowY: 'auto' }}
                    ref={chatContainerRef}
                >
                    {messages.map((msg, index) => (
                        <Box key={index} textAlign={msg.sender === 'user' ? 'right' : 'left'}
                            alignSelf={msg.sender === 'user' ? 'flex-end' : 'flex-start'}
                            display="flex"
                            flexDirection="column"
                        >
                            <Typography variant="caption" color="textSecondary" style={{ display: 'inline-block' }}>
                                {msg.sender === 'user' ? 'You' : 'TaskPilot'} &nbsp; {new Date(msg.timestamp).toLocaleDateString(undefined, { day: '2-digit', month: '2-digit' })} {new Date(msg.timestamp).toLocaleTimeString(undefined, { hour: '2-digit', minute: '2-digit', hour12: false })}
                            </Typography>
                            <Box
                                bgcolor={msg.sender === 'user' ? '#E6E6FA' : '#F5F5F5'}
                                p={1}
                                borderRadius={2}
                                mb={1}
                                style={{ fontFamily: 'Segoe UI', fontSize: '14px', display: 'inline-block' }}
                            >
                                {msg.message}
                            </Box>
                        </Box>
                    ))}
                </Box>
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
                                <Button variant="contained" style={{ backgroundColor: '#E6E6FA', color: 'black' }} type="submit">
                                    Send
                                </Button>
                            </Box>
                        </Box>
                    </form>
                </Box>
            </Box>
        </Container>
    );
};

export default TaskPilotPro;
