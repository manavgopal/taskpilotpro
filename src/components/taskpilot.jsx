import React, { useState, useEffect, useRef } from 'react';
import { TextField, Button, Container, Box } from '@mui/material';
import axios from 'axios';

const TaskPilotPro = () => {
    const [messages, setMessages] = useState([]);
    const [inputValue, setInputValue] = useState('');
    const chatContainerRef = useRef(null);

    useEffect(() => {
        // Fetch recent conversations when component mounts
        fetchRecentConversations();
    }, []);

    useEffect(() => {
        // Scroll to the bottom of the chat container whenever messages change
        chatContainerRef.current.scrollTop = chatContainerRef.current.scrollHeight;
    }, [messages]);

    const fetchRecentConversations = async () => {
        try {

            const response = await axios.get('http://udayanbaidya:3004/recent-conversations');
            const conversations = response.data;
            console.log('Recent conversations:', conversations);
            // Add recent conversations to the messages state
            const newMessages = conversations.map(conversation => [
                { message: conversation.Request, sender: 'user' },
                { message: conversation.Response, sender: 'bot' }
            ]).flat(); // Flattens the array of arrays into a single array
            setMessages(newMessages);
        } catch (error) {
            console.error('Error fetching recent conversations:', error);
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (inputValue.trim() !== '') {
            sendMessage(inputValue, 'user');
            setInputValue('');
            try {
                const botResponse = await sendMessageToBackend(inputValue);
                console.log('Bot response:', botResponse.data);
                sendMessage(botResponse.data.message, 'bot');
            } catch (error) {
                console.error('Error getting bot response:', error);
                sendMessage('Error occurred. Please try again.', 'bot');
            }
        }
    };

    const sendMessage = (message, sender) => {
        setMessages((prevMessages) => [...prevMessages, { message, sender }]);
    };

    const sendMessageToBackend = async (message) => {
        const requestBody = {
            userid: "12345",
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
                        <Box
                            key={index}
                            textAlign={msg.sender === 'user' ? 'right' : 'left'}
                            bgcolor={msg.sender === 'user' ? 'primary.main' : 'grey.200'}
                            color={msg.sender === 'user' ? 'white' : 'black'}
                            p={1}
                            borderRadius={2}
                            mb={1}
                            alignSelf={msg.sender === 'user' ? 'flex-end' : 'flex-start'}
                        >
                            {msg.message}
                        </Box>
                    ))}
                </Box>
                <Box mt={4}>
                    <form onSubmit={handleSubmit}>
                        <Box display="flex" alignItems="center">
                            <TextField
                                label="Type your message..."
                                variant="outlined"
                                fullWidth
                                value={inputValue}
                                onChange={(e) => setInputValue(e.target.value)}
                            />
                            <Box ml={2}>
                                <Button variant="contained" color="primary" type="submit">
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
