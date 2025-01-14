import ChatList from "@/components/views/list/chat-list";
import GiftList from "@/components/views/list/gift-list";
import LikeList from "@/components/views/list/like-list";
import ViewList from "@/components/views/list/view-list";
import RoomInfoComponent from "@/components/views/room-info";

export default function Home() {
  return (
    <div className="grid grid-cols-1 lg:grid-cols-4 gap-2 w-full justify-items-stretch h-full p-2">
      <div className="w-full lg:col-span-4">
        <RoomInfoComponent />
      </div>
      <ChatList />
      <GiftList />
      <LikeList />
      <ViewList />
      <div className="h-screen">
        test
      </div>
      <div className="h-screen">
        test
      </div>
    </div>
  );
}
