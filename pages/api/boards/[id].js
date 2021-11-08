import dbConnect from "../../../lib/dbConnect";
import { getSession } from "next-auth/client";
import Board from "../../../models/Board";
import User from "../../../models/User";

export default async function handler(req, res) {
  const session = await getSession({ req });
  const { method } = req;
  const { id } = req.query;
  await dbConnect();

  switch (method) {
    case "GET":
      if (session) {
        try {
          const targetBoard = await Board.findById(id);

          res.send(targetBoard);
        } catch (error) {
          res.status(400).json({ success: false, error: error.message });
        }
      } else {
        res
          .status(401)
          .json({ success: false, error: "Access denied. Signin." });
      }
      break;

    case "PATCH":
      if (session) {
        try {
          // Edit board title
          if (req.body.title) {
            const updateTitle = await Board.findByIdAndUpdate(
              id,
              { title: req.body.title },
              { new: true }
            );
            res.send(updateTitle);
          }
          // Edit lists order
          if (req.body.newOrder) {
            const board = await Board.findById(id);

            for (let i = 0; i < board.listsOrder.length; i++) {
              board.listsOrder.set(i, req.body.newOrder[i]);
            }

            await board.save();

            res.send(board);
          }
          // Share board
          if (req.body.email) {
            const user = await User.findOne({ email: req.body.email });
            // Check if email belongs to a user
            if (!user) {
              return res.send({ success: false, error: "User doesn't exist." });
            }
            // Check if user put his own email
            const board = await Board.findById(id);
            const boardOwner = await User.findById(board.user);
            if (user.email === boardOwner.email) {
              return res.send({
                success: false,
                error: "You can't share the board with yourself",
              });
            }
            // Check if user share already this board with that user
            const isSharedWithExist = board.sharedWith.find(
              (userEmail) => userEmail === req.body.email
            );

            if (isSharedWithExist) {
              return res.send({
                success: false,
                error: "You already shared the board with this user.",
              });
            }

            //Share the board
            await Board.findByIdAndUpdate(id, {
              $push: { sharedWith: req.body.email },
              new: true,
            });

            res.send(board);
          }
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
