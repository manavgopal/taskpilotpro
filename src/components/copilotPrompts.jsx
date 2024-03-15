import React from 'react';

const CopilotPrompts = ({ handlePromptClick }) => {
    const prompts = [
        { label: "What's the latest updates?", action: "latest updates" },
        { label: "How to write a request for proposal?", action: "request for proposal" },
        { label: "Get the gist", action: "get the gist" },
        { label: "Jumpstart a draft", action: "jumpstart a draft" },
        { label: "Help me write", action: "help me write" }
    ];

    return (
        <div className="copilot-container">
            <div className="header">
                <h1>Copilot</h1>
                <h2>For Microsoft 365</h2>
            </div>
            <div className="prompts">
                {prompts.map((prompt, index) => (
                    <button key={index} onClick={() => handlePromptClick(prompt.action)}>
                        {prompt.label}
                    </button>
                ))}
            </div>
        </div>
    );
};

export default CopilotPrompts;
