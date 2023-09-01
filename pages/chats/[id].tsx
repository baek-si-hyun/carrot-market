import type { NextPage } from "next";
import Layout from "@/components/layout";
import Message from "@/components/message";
import { useForm } from "react-hook-form";
import useMutation from "@/libs/client/useMutation";
import { ChatRoom, User, ChatMessage } from "@prisma/client";
import { useRouter } from "next/router";
import { useEffect } from "react";

interface UploadChatForm {
  chat: string;
}
interface ChatRoomWithMessages extends ChatRoom {
  chatMessages: ChatMessage[];
  host: User;
  invited: User;
}

const ChatDetail: NextPage = () => {
  const router = useRouter();
  const { register, handleSubmit, watch, reset } = useForm<UploadChatForm>();
  const [sendChat, { loading, data }] = useMutation(
    `/api/chats/${router.query.id}/chat`
  );
  const onVaild = ({ chat }: UploadChatForm) => {
    sendChat({ chat: chat });
  };

  return (
    <Layout canGoBack title="Steve">
      <div className="px-4 py-10 pb-16 space-y-4">
        <Message message="Hi how much are you selling them for?" />
        <Message message="I want ￦20,000" reversed />
        <Message message="미쳤어" />
        <form
          className="fixed inset-x-0 bottom-0 py-2 bg-white"
          onSubmit={handleSubmit(onVaild)}
        >
          <div className="relative flex items-center w-full max-w-md mx-auto">
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
  );
};

export default ChatDetail;
