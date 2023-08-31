import { NextApiRequest, NextApiResponse } from "next";
import withHandler, { ResponseType } from "@/libs/server/withHandler";
import client from "@/libs/server/client";
import { withApiSession } from "@/libs/server/withSession";

async function handler(
  req: NextApiRequest,
  res: NextApiResponse<ResponseType>
) {
//   if (req.method === "POST") {
//     const {
//       query,
//       session: { user },
//     } = req;
// console.log(query)
//     const chatRoom = await client.chatRoom.create({
//       data: {
//         product: {
//           id: productId,
//         },
//         host: {
//           connect: { id: user?.id },
//         },
//         guest: {
//           connect: { id: user?.id },
//         },
//         chatMessage: {
//           create: [
//             {
//               user: {
//                 connect: { id: user?.id },
//               },
//               message: "Hello, this is the initial message!",
//             },
//           ],
//         },
//       },
//       include: {
//         chatMessage: true,
//       },
//     });
//     res.json({ ok: true, chatRoom });
  // }
}

export default withApiSession(
  withHandler({
    methods: ["POST"],
    handler,
  })
);
