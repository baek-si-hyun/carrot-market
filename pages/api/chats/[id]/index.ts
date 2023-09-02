import { NextApiRequest, NextApiResponse } from "next";
import withHandler, { ResponseType } from "@/libs/server/withHandler";
import client from "@/libs/server/client";
import { withApiSession } from "@/libs/server/withSession";

async function handler(
  req: NextApiRequest,
  res: NextApiResponse<ResponseType>
) {
  const {
    query: { id },
  } = req;
  const chatMessage = await client.chatRoom.findUnique({
    where: {
      id: +id!,
    },
    include: {
      chatMessage: {
        select: {
          createdAt: true,
          chat: true,
          userId: true,
        },
      },
      host: {
        select: {
          id: true,
          avatar: true,
          name: true,
        },
      },
      guest: {
        select: {
          id: true,
          avatar: true,
          name: true,
        },
      },
    },
  });
  res.json({
    ok: true,
    chatMessage,
  });
}

export default withApiSession(
  withHandler({
    methods: ["GET"],
    handler,
  })
);
