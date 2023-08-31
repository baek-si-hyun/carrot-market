import withHandler from "@/libs/server/withHandler";
import { withApiSession } from "@/libs/server/withSession";
import { NextApiRequest, NextApiResponse } from "next";

async function handler(req: NextApiRequest, res: NextApiResponse) {
  const {
    query: { id },
    session: { user },
    body,
  } = req;
  console.log(id, user, body);
}

export default withApiSession(
  withHandler({
    methods: ["POST"],
    handler,
  })
);