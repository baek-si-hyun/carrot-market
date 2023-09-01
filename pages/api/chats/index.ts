import { NextApiRequest, NextApiResponse } from "next";
import withHandler, { ResponseType } from "@/libs/server/withHandler";
import client from "@/libs/server/client";
import { withApiSession } from "@/libs/server/withSession";

async function handler(
  req: NextApiRequest,
  res: NextApiResponse<ResponseType>
) {
  if (req.method === "POST") {
    const {
      query: { productId, guestId },
      session: { user },
    } = req;
    const alreadyExists = await client.chatRoom.findFirst({
      where: {
        productId: +productId!,
        guestId: +guestId!,
        hostId: user?.id!,
      },
    });
    if (alreadyExists) {
      res.json({
        ok: true,
        chatRoomId: alreadyExists.id,
      });
    } else {
      const createChatRoom = await client.chatRoom.create({
        data: {
          product: {
            connect: {
              id: +productId!,
            },
          },
          host: {
            connect: {
              id: user?.id,
            },
          },
          guest: {
            connect: { id: +guestId! },
          },
        },
      });
      res.json({
        ok: true,
        chatRoomId: createChatRoom.id,
      });
    }
  }
  if (req.method === "GET") {
    const {
      session: { user },
    } = req;
    const chatRooms = await client.chatRoom.findMany({
      where: {
        OR: [{ hostId: user?.id }, { guestId: user?.id }],
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
      chatRooms,
    });
  }
}

export default withApiSession(
  withHandler({
    methods: ["GET", "POST"],
    handler,
  })
);
