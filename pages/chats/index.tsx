import type { NextPage } from "next";
import Link from "next/link";
import Layout from "@/components/layout";
import useSWR from "swr";
import { ChatRoom, ChatMessage, User } from "@prisma/client";
import useUser from "@/libs/client/useUser";
import { useEffect, useState } from "react";

interface chatRoomData extends ChatRoom {
  chatMessage: ChatMessage[];
  host: User;
  guest: User;
}

interface ChatRoomsResponse {
  ok: boolean;
  chatRooms: chatRoomData[];
}

const Chats: NextPage = () => {
  const { user } = useUser();
  const { data } = useSWR<ChatRoomsResponse>("/api/chats/");
  return (
    <Layout hasTabBar title="채팅">
      <div className="divide-y-[1px] ">
        {data?.chatRooms.map((chatRoom, index) => (
          <Link
            href={`/chats/${chatRoom.id}`}
            key={chatRoom.id}
            className="flex items-center px-4 py-3 space-x-3 cursor-pointer"
          >
            <img
              src={`https://imagedelivery.net/4aEUbX05h6IovGOQjgkfSw/${
                user?.id === chatRoom.guest.id
                  ? chatRoom.host.avatar
                  : chatRoom.guest.avatar
              }/avatar`}
              className="w-12 h-12 rounded-full bg-slate-300"
            />
            <div>
              <p className="text-gray-700">
                {user?.id === chatRoom.guest.id
                  ? chatRoom.host.name
                  : chatRoom.guest.name}
              </p>
              <p className="text-sm text-gray-500">
                {chatRoom.chatMessage[chatRoom.chatMessage.length - 1]?.chat}
              </p>
            </div>
          </Link>
        ))}
      </div>
    </Layout>
  );
};

export default Chats;
