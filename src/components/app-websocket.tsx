import React, { useEffect } from 'react';
import { useDispatch } from 'react-redux';

const WebSocketComponent = () => {
    const dispatch = useDispatch();

    useEffect(() => {
        // Start the WebSocket connection when the component is mounted
        dispatch({ type: 'START_SOCKET' });

        // Clean up (optional if needed)
        return () => {
            // Close WebSocket connection if needed
        };
    }, [dispatch]);

    return <div>WebSocket Listener Component</div>;
};

export default WebSocketComponent;