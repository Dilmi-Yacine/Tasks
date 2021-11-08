import dbConnect from "../../../lib/dbConnect";
import { getSession } from "next-auth/client";
import Board from "../../../models/Board";
import List from "../../../models/List";

export default async function handler(req, res) {
  const session = await getSession({ req });
  const { method } = req;

  await dbConnect();

  switch (method) {
    case "GET":
      if (session) {
        try {
          const userBoards = await Board.find().or([
            { user: session.user.id },
            { sharedWith: `${session.user.email}` },
          ]);

          res.send(userBoards);
        } catch (error) {
          res.status(400).json({ success: false, error: error.message });
        }
      } else {
        res
          .status(401)
          .json({ success: false, error: "Access denied. Signin." });
      }

      break;

    case "POST":
      if (session) {
        try {
          const newBoard = await Board.create({
            user: session.user.id,
            title: req.body.title,
          });

          const done = new List({
            title: "Done",
            user: session.user.id,
            board: newBoard._id,
          });
          const doing = new List({
            title: "Doing",
            user: session.user.id,
            board: newBoard._id,
          });
          const todo = new List({
            title: "To Do",
            user: session.user.id,
            board: newBoard._id,
          });

          await done.save();
          await doing.save();
          await todo.save();

          let IDs = [done._id, doing._id, todo._id];
          newBoard.listsOrder = IDs;
          newBoard.save();
          IDs = [];
          res.send(newBoard);
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
