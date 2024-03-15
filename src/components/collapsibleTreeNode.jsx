import React, { useState } from 'react';
import './collapsibleTreeNode.css';
import Typography from '@mui/material/Typography';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import ChevronRightIcon from '@mui/icons-material/ChevronRight';
import Box from '@mui/material/Box';

const CollapsibleTreeNode = ({ task }) => {
    const [isOpen, setIsOpen] = useState(true);

    // Determine CSS class based on the task state
    const stateClass = task.TaskSummary.State.toLowerCase().replace(/\s+/g, '-');

    const toggleOpen = () => setIsOpen(!isOpen);

    return (
        <Box className={`tree-node ${stateClass}`}>
            <Box className="node-header" onClick={toggleOpen}>
                <Box className={`toggle ${isOpen ? 'open' : 'closed'}`}>
                    {isOpen ? <ExpandMoreIcon /> : <ChevronRightIcon />}
                </Box>
                <Typography variant="body1" className="task-info">
                    <strong>Task ID:</strong> {task.TaskSummary.TaskId} <br />
                    <strong>Title:</strong> {task.TaskSummary.Title} <br />
                    <strong>Assigned To:</strong> {task.TaskSummary.AssignedToDisplayName} <br />
                    <strong>State:</strong> {task.TaskSummary.State === 'Doing' ? 'In Progress' : task.TaskSummary.State}
                </Typography>
            </Box>
            {isOpen && task.RelatedWorkItems && (
                <Box className="tree-children">
                    {task.RelatedWorkItems.map((childTask, index) => (
                        <CollapsibleTreeNode key={index} task={childTask} />
                    ))}
                </Box>
            )}
        </Box>
    );
};

export default CollapsibleTreeNode;