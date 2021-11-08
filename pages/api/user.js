import dbConnect from "../../lib/dbConnect";
import { getSession } from "next-auth/client";
import User from "../../models/User";

export default async function handler(req, res) {
  const session = await getSession({ req });
  const { method } = req;

  await dbConnect();

  switch (method) {
    case "GET":
      if (session) {
        try {
          const user = await User.findById(session.user.id);
          res.send(user);
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
          const user = await User.findByIdAndUpdate(
            session.user.id,
            { name: req.body.name },
            { new: true }
          );
          res.send(user);
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
