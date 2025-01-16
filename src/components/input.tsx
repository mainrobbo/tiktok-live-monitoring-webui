"use client"
import { useDispatch, useSelector } from "react-redux";
import { Input } from "./ui/input";
import { setUsername } from '@/store/settingSlice';
import { RootState } from "@/store";
import { useEffect } from "react";
import useLocalStorage from "@/hooks/use-localstorage";
export function UsernameInput() {
    const dispatch = useDispatch();
    const { username } = useSelector(({ setting }: { setting: RootState["setting"] }) => setting);
    const { live } = useSelector(({ connection }: { connection: RootState["connection"] }) => connection);

    const { get } = useLocalStorage()
    useEffect(() => {
        const savedUsername = get('username')
        if (savedUsername) {
            dispatch(setUsername(savedUsername));
        }
    }, [dispatch]);
    const handleUsernameChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        dispatch(setUsername(e.target.value));
    };
    return (
        <Input
            placeholder="@Username"
            value={username}
            disabled={live}
            onChange={handleUsernameChange} />
    )
}