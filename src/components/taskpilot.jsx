import React, { useState, useEffect, useRef } from 'react';
import { TextField, Button, Container, Box } from '@mui/material';
import axios from 'axios';

const TaskPilotPro = () => {
    const [messages, setMessages] = useState([]);
    const [inputValue, setInputValue] = useState('');
    const chatContainerRef = useRef(null);

    useEffect(() => {
        // Scroll to the bottom of the chat container whenever messages change
        chatContainerRef.current.scrollTop = chatContainerRef.current.scrollHeight;
    }, [messages]);

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (inputValue.trim() !== '') {
            sendMessage(inputValue, 'user');
            setInputValue('');

            try {
                const botResponse = await sendMessageToBackend(inputValue);
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
        try {
            const response = await axios.post('/conversation', { message });
            return response;
        } catch (error) {
            throw error;
        }
    };
    /// checking.............
    return (
        <Container>
            <Box mt={4}>
                <Box mb={2} bgcolor="primary.main" color="white" p={2} textAlign="center">
                    <h2>Task Pilot Pro</h2>
                </Box>
                <Box
                    display="flex"
                    flexDirection="column"
                    style={{ height: '50vh', overflowY: 'auto' }}
                    ref={chatContainerRef}
                >
                    {messages.map((msg, index) => (
                        <Box
                            key={index}
                            display="flex" // Added display flex
                            alignItems="center" // Added align items to center the message
                            justifyContent={msg.sender === 'user' ? 'flex-end' : 'flex-start'} // Align messages based on sender
                            mt={1} // Added margin top
                        >
                            <Box
                                bgcolor={msg.sender === 'user' ? 'primary.main' : 'grey.200'}
                                color={msg.sender === 'user' ? 'white' : 'black'}
                                p={1}
                                borderRadius={5}
                                alignSelf="flex-start" // Align message box within its flex container
                                maxWidth="70%" // Limit width to 70% of container
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
