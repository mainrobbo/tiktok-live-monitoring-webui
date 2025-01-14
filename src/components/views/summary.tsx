"use client"
import {
    Menubar,
    MenubarCheckboxItem,
    MenubarContent,
    MenubarItem,
    MenubarMenu,
    MenubarRadioGroup,
    MenubarRadioItem,
    MenubarSeparator,
    MenubarShortcut,
    MenubarSub,
    MenubarSubContent,
    MenubarSubTrigger,
    MenubarTrigger,
} from "@/components/ui/menubar"
import { useState } from "react"
import MostLike from "./most/most-like"
import MostChat from "./most/most-chat"

export default function MenuBarChart() {
    const [topMostLikes, setTopMostLikes] = useState(false)
    const [mostChat, setMostChat] = useState(false)
    return (
        <>
            <Menubar className="mt-2 w-fit">
                <MenubarMenu>
                    <MenubarTrigger>Summary</MenubarTrigger>
                    <MenubarContent>
                        <MenubarSub>
                            <MenubarSubTrigger>Chat</MenubarSubTrigger>
                            <MenubarSubContent>
                                <MenubarItem onClick={() => setMostChat(true)}>Most Chat</MenubarItem>
                                <MenubarItem disabled>Most Word</MenubarItem>
                            </MenubarSubContent>
                        </MenubarSub>
                        <MenubarSub>
                            <MenubarSubTrigger>Likes</MenubarSubTrigger>
                            <MenubarSubContent>
                                <MenubarItem onClick={() => setTopMostLikes(true)}>Top & Most Likes</MenubarItem>
                            </MenubarSubContent>
                        </MenubarSub>
                        <MenubarSub>
                            <MenubarSubTrigger>Gift</MenubarSubTrigger>
                            <MenubarSubContent>
                                <MenubarItem disabled>Most Gift</MenubarItem>
                                <MenubarItem disabled>Top Gift</MenubarItem>
                                <MenubarItem disabled>Top & Most Giver</MenubarItem>
                            </MenubarSubContent>
                        </MenubarSub>
                        <MenubarSub>
                            <MenubarSubTrigger>Viewer</MenubarSubTrigger>
                            <MenubarSubContent>
                                <MenubarItem disabled>Most Activity</MenubarItem>
                                <MenubarItem disabled>Top Viewer</MenubarItem>
                            </MenubarSubContent>
                        </MenubarSub>
                    </MenubarContent>
                </MenubarMenu>
                <MostLike open={topMostLikes} setOpen={setTopMostLikes} />
                <MostChat open={mostChat} setOpen={setMostChat} />
            </Menubar>
        </>)
}