import useUser from "@/libs/client/useUser";
import { cls } from "@/libs/client/utils";

interface MessageProps {
  message: string;
  name?: string;
  avatarUrl?: string | null;
  userId?: number;
}

export default function Message({
  message,
  name,
  avatarUrl,
  userId,
}: MessageProps) {
  const { user } = useUser();
  const isCurrentUser = userId === user?.id;
  return (
    <div
      className={cls(
        "flex items-start mb-2",
        isCurrentUser ? "flex-row-reverse" : "space-x-2"
      )}
    >
      {isCurrentUser ? null : (
        <div className="p-1 pt-3">
          <img
            src={`https://imagedelivery.net/4aEUbX05h6IovGOQjgkfSw/${avatarUrl}/avatar`}
            alt="avatar"
            className="w-8 h-8 rounded-full bg-slate-400"
          />
        </div>
      )}
      <div
        className={cls(
          "flex flex-col flex-1",
          isCurrentUser ? "items-end" : "items-start"
        )}
      >
        {!isCurrentUser ? (
          <div>
            <p>{name}</p>
          </div>
        ) : null}
        <div className="relative w-1/2 p-2 text-sm text-gray-700 border border-gray-300 rounded-md">
          <div>
            <p>{message}</p>
          </div>
        </div>
      </div>
    </div>
  );
}
