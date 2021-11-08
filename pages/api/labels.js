import dbConnect from "../../lib/dbConnect";
import { getSession } from "next-auth/client";
import Card from "../../models/Card";
import Label from "../../models/Label";
import Board from "../../models/Board";

export default async function handler(req, res) {
  const session = await getSession({ req });
  const { method } = req;
  const { boardID, labelID } = req.query;

  await dbConnect();

  switch (method) {
    case "GET":
      if (session) {
        try {
          const labels = await Label.find({ board: boardID });

          let i;
          const labelObject = {};

          const labelIDs = labels.map((label) => {
            return label._id;
          });

          for (i = 0; i < labelIDs.length; i++) {
            labelObject[labelIDs[i]] = labels[i];
          }

          res.send(labelObject);
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
          const { label, color, cardID } = req.body;
          const newLabel = await Label.create({
            label,
            color,
            board: boardID,
          });

          newLabel.cardIDs.push(cardID);
          await newLabel.save();

          await Card.findByIdAndUpdate(
            cardID,
            { $push: { labels: newLabel._id } },
            { new: true }
          );

          await Board.findByIdAndUpdate(
            boardID,
            { $push: { labels: newLabel._id } },
            { new: true }
          );

          res.send(newLabel);
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
          //Change Label title and/or color
          if (req.body.label && req.body.color) {
            const labelEdited = await Label.findByIdAndUpdate(
              req.body.labelID,
              { label: req.body.label, color: req.body.color },
              { new: true }
            );
            res.send(labelEdited);
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

    case "DELETE":
      if (session) {
        try {
          //Remove Label
          const deletedLabel = await Label.findByIdAndRemove(labelID);
          //Remove Label from cards
          deletedLabel.cardIDs.forEach(async (cardID) => {
            const card = await Card.findById(cardID);
            const labelIndex = card.labels.indexOf(deletedLabel._id);
            card.labels.splice(labelIndex, 1);
            await card.save();
          });

          //Remove Label from board
          const board = await Board.findById(deletedLabel.board);
          const labelIndex = board.labels.indexOf(deletedLabel._id);
          board.labels.splice(labelIndex, 1);
          await board.save();

          res.send(deletedLabel);
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
