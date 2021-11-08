import dbConnect from "../../lib/dbConnect";
import { getSession } from "next-auth/client";
import List from "../../models/List";
import Board from "../../models/Board";

export default async function handler(req, res) {
  const session = await getSession({ req });
  const { method } = req;
  const { boardID, listID } = req.query;
  await dbConnect();

  switch (method) {
    case "GET":
      if (session) {
        try {
          const lists = await List.find({ board: boardID });

          const boardLists = {};
          const listsID = lists.map((list) => {
            return list._id;
          });
          listsID.forEach((id, index) => (boardLists[id] = lists[index]));

          res.send(boardLists);
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
          const newList = await List.create({
            title: req.body.title,
            board: req.body.board,
            user: session.user.id,
          });

          await Board.findByIdAndUpdate(
            req.body.board,
            { $push: { listsOrder: newList._id } },
            { new: true }
          );
          res.send(newList);
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
          if (req.body.title) {
            const updateTitle = await List.findByIdAndUpdate(
              listID,
              { title: req.body.title },
              { new: true }
            );
            res.send(updateTitle);
          }
          if (req.body.newOrder) {
            const updateTasksOrder = await List.findByIdAndUpdate(
              listID,
              { taskIDs: req.body.newOrder },
              { new: true }
            );
            res.send(updateTasksOrder);
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
