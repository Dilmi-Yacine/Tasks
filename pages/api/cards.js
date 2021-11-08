import dbConnect from "../../lib/dbConnect";
import { getSession } from "next-auth/client";
import Card from "../../models/Card";
import List from "../../models/List";
import Board from "../../models/Board";
import Label from "../../models/Label";

export default async function handler(req, res) {
  const session = await getSession({ req });
  const { method } = req;
  const { boardID } = req.query;

  await dbConnect();

  switch (method) {
    case "GET":
      if (session) {
        try {
          const boardCards = await Card.find({ board: boardID });
          let i;
          const cards = {};

          const tasksIDs = boardCards.map((task) => {
            return task._id;
          });

          for (i = 0; i < tasksIDs.length; i++) {
            cards[tasksIDs[i]] = boardCards[i];
          }

          res.send(cards);
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
          const newCard = await Card.create({
            title: req.body.title,
            board: req.body.board,
            list: req.body.list,
            user: session.user.id,
          });

          await List.findByIdAndUpdate(req.body.list, {
            $push: { taskIDs: newCard._id },
            new: true,
          });
          res.send(newCard);
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
          // Edit card title
          if (req.body.title) {
            const card = await Card.findByIdAndUpdate(
              req.body.cardID,
              { title: req.body.title },
              { new: true }
            );
            res.send(card);
          }
          // Add description
          if (req.body.description) {
            const card = await Card.findByIdAndUpdate(
              req.body.cardID,
              { description: req.body.description },
              { new: true }
            );
            res.send(card);
          }
          // Push Label into Board and Card
          if (req.body.label) {
            const card = await Card.findByIdAndUpdate(
              req.body.cardID,
              { $push: { labels: req.body.label } },
              { new: true }
            );

            await Label.findByIdAndUpdate(
              req.body.label,
              { $push: { cardIDs: req.body.cardID } },
              { new: true }
            );
            res.send(card);
          }
          // Remove Label from Card
          if (req.body.labelID) {
            const card = await Card.findById(req.body.cardID);
            const labelIndex = card.labels.indexOf(req.body.labelID);
            card.labels.splice(labelIndex, 1);
            await card.save();

            res.send(card);
          }
          // Add checklist item
          if (req.body.item) {
            const checklist = {
              checked: false,
              item: req.body.item,
            };
            const card = await Card.findById(req.body.cardID);
            card.checklist.push(checklist);
            await card.save();

            res.send(card);
          }
          // Edit checklist item
          if (req.body.itemIndex && req.body.editedItem) {
            const card = await Card.findById(req.body.cardID);

            card.checklist[req.body.itemIndex - 1].item = req.body.editedItem;

            await card.save();

            res.send(card);
          }
          //Check/Unchek item
          if (req.body.index) {
            const card = await Card.findById(req.body.cardID);

            card.checklist[req.body.index - 1].checked =
              !card.checklist[req.body.index - 1].checked;

            await card.save();

            res.send(card);
          }
          // Add due date
          if (req.body.date) {
            const card = await Card.findByIdAndUpdate(
              req.body.cardID,
              {
                "dueDate.date": Date.parse(req.body.date),
                "dueDate.checked": false,
                "dueDate.state": req.body.state,
                "dueDate.stateColor": req.body.color,
              },
              { new: true }
            );
            res.send(card);
          }
          // Check due date
          if (typeof req.body.checked !== "undefined") {
            const card = await Card.findById(req.body.cardID);
            card.dueDate = {
              checked: req.body.checked,
              date: card.dueDate.date,
              state: card.dueDate.checked ? req.body.state : "complete",
              stateColor: card.dueDate.checked ? req.body.color : "#a5d6a7",
            };
            await card.save();
            res.send(card);
          }
          // due Date state
          if (req.body.dueDateState && req.body.dueDateStateColor) {
            const card = await Card.findByIdAndUpdate(
              req.body.cardID,
              {
                "dueDate.state": req.body.dueDateState,
                "dueDate.stateColor": req.body.dueDateStateColor,
              },
              { new: true }
            );
            res.send(card);
          }
          // Add comment
          if (req.body.comment) {
            const comment = {
              user: req.body.user,
              date: Date.now(),
              comment: req.body.comment,
            };
            const card = await Card.findByIdAndUpdate(
              req.body.cardID,
              { $push: { comments: comment } },
              { new: true }
            );

            res.send(card);
          }
          // Edit comment
          if (req.body.editedComment && req.body.commentIndex) {
            const card = await Card.findById(req.body.cardID);
            card.comments[req.body.commentIndex - 1].comment =
              req.body.editedComment;

            await card.save();
            res.send(card);
          }

          // Asign member
          if (req.body.member) {
            const card = await Card.findByIdAndUpdate(
              req.body.cardID,
              {
                $push: {
                  members: req.body.member,
                },
              },
              { new: true }
            );

            res.send(card);
          }

          // Remove member
          if (req.body.removedMember) {
            const card = await Card.findById(req.body.cardID);
            const memberIndex = card.members.indexOf(req.body.removedMember);
            card.members.splice(memberIndex, 1);
            await card.save();

            res.send(card);
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
