import dbConnect from "../../lib/dbConnect";
import { getSession } from "next-auth/client";
import User from "../../models/User";
import Board from "../../models/Board";

export default async function handler(req, res) {
  const session = await getSession({ req });
  const { method } = req;
  const { boardID } = req.query;

  await dbConnect();

  switch (method) {
    case "GET":
      if (session) {
        try {
          const board = await Board.findById(boardID);
          const users = await User.find().or([
            { _id: board.user },
            { email: { $in: board.sharedWith } },
          ]);
          const usersID = users.map((user) => {
            return user._id;
          });
          const boardUsers = {};
          usersID.forEach((id, index) => (boardUsers[id] = users[index]));
          res.send(boardUsers);
        } catch (error) {
          res.status(400).json({ success: false, error: error.message });
        }
      } else {
        res
          .status(401)
          .json({ success: false, error: "Access denied. Signin." });
      }
      break;

    default:
      break;
  }
}
