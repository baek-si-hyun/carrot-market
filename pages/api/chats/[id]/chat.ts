import withHandler from "@/libs/server/withHandler";
import { withApiSession } from "@/libs/server/withSession";
import { NextApiRequest, NextApiResponse } from "next";
import client from "@/libs/server/client";

async function handler(req: NextApiRequest, res: NextApiResponse) {
  const {
    query: { id },
    session: { user },
    body: { chat },
  } = req;
  const chatMessage = await client.chatMessage.create({
    data: {
      user: {
        connect: {
          id: user?.id,
        },
      },
      chat,
      chatRoom: {
        connect: {
          id: Number(id),
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
    methods: ["POST"],
    handler,
  })
);
