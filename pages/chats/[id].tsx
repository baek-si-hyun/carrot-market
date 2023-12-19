import type { NextPage } from "next";
import Layout from "@/components/layout";
import Message from "@/components/message";
import { useForm } from "react-hook-form";
import useMutation from "@/libs/client/useMutation";
import { ChatRoom, User, ChatMessage } from "@prisma/client";
import { useRouter } from "next/router";
import useSWR from "swr";
import useUser from "@/libs/client/useUser";
import { useEffect, useState } from "react";

interface UploadChatForm {
  chat: string;
}
interface ChatRoomWithMessages extends ChatRoom {
  chatMessage: ChatMessage[];
  host: User;
  guest: User;
}
interface ResponseChatMessage {
  ok: boolean;
  chatMessage: ChatRoomWithMessages;
}
const ChatDetail: NextPage = () => {
  const { user } = useUser();
  const router = useRouter();
  const { register, handleSubmit, reset } = useForm<UploadChatForm>();
  const [sendChat, { loading }] = useMutation(
    `/api/chats/${router.query.id}/chat`
  );
  const [chatData, setChatData] = useState<ResponseChatMessage>();
  const { data: fetchChatData, mutate } = useSWR<ResponseChatMessage>(
    `/api/chats/${router.query.id}`
  );
  const onVaild = ({ chat }: UploadChatForm) => {
    if (loading) return;
    sendChat({ chat: chat });
    if (!fetchChatData) return;
    reset();
    mutate(
      (prev) =>
        prev &&
        ({
          ...fetchChatData,
          chatRoom: {
            ...fetchChatData.chatMessage,
            chatMessages: [
              ...fetchChatData.chatMessage.chatMessage,
              {
                id: Date.now(),
                chat: chat,
                userId: user?.id,
              },
            ],
          },
        } as any),
      false
    );
  };
  useEffect(() => {
    setChatData(() => fetchChatData);
  }, [fetchChatData, chatData, sendChat]);
  return (
    <>
      {chatData && (
        <Layout
          canGoBack
          title={
            user?.id === chatData.chatMessage.guest.id
              ? chatData.chatMessage.host.name
              : chatData.chatMessage.guest.name
          }
        >
          <div className="h-[clac(100vh-64px)] px-4 py-10 pb-16 space-y-4">
            <form
              className="h-full py-2 bg-white"
              onSubmit={handleSubmit(onVaild)}
            >
              <>
                {chatData.chatMessage?.chatMessage.map((data) => (
                  <Message
                    key={data.id}
                    userId={data.userId}
                    message={data.chat}
                    name={
                      data.userId === chatData.chatMessage.host.id
                        ? chatData.chatMessage.host.name
                        : chatData.chatMessage.guest.name
                    }
                    avatarUrl={
                      data.userId === chatData.chatMessage.host.id
                        ? chatData.chatMessage.host.avatar
                        : chatData.chatMessage.guest.avatar
                    }
                  />
                ))}
              </>
              <div className="absolute inset-x-0 flex items-center max-w-md mx-auto bottom-2">
                <input
                  type="text"
                  {...register("chat", { required: true })}
                  className="w-full p-2 pr-12 text-sm border border-gray-300 rounded-full shadow-sm focus:ring-orange-500 focus:outline-none focus:border-orange-500"
                />
                <div className="absolute inset-y-0 flex py-1.5 pr-1.5 right-0">
                  <button className="flex items-center px-3 text-sm text-white bg-orange-500 rounded-full focus:ring-2 focus:ring-offset-2 focus:ring-orange-500 hover:bg-orange-600">
                    &rarr;
                  </button>
                </div>
              </div>
            </form>
          </div>
        </Layout>
      )}
    </>
  );
};

export default ChatDetail;
