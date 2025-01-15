"use client"
import React from 'react';
import { useAppContext } from './app-context';

export const AppSidebar = () => {
    const { username, setUsername } = useAppContext();

    const handleUsernameChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        setUsername(event.target.value);
    };

    return (
        <div>
            <input
                type="text"
                value={username}
                onChange={handleUsernameChange}
                placeholder="Enter username"
            />
        </div>
    );
};

