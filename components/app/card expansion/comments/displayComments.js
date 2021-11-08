import { useState } from "react";
import useCards from "../../../../lib/useCards";
import useUsers from "../../../../lib/useUsers";
import useUser from "../../../../lib/useUser";
import format from "date-fns/format";
import isThisYear from "date-fns/isThisYear";
import { styled } from "@mui/material/styles";
import Stack from "@mui/material/Stack";
import Box from "@mui/system/Box";
import Typography from "@mui/material/Typography";
import Button from "@mui/material/Button";
import { blueGrey, grey } from "@mui/material/colors";
import UserAvatar from "../../userAvatar";
import EditComment from "./editComment";

export const Comment = styled("div")(({ theme }) => ({
  width: "fit-content",
  border: `1px solid ${grey[300]}`,
  padding: theme.spacing(1),
  color: blueGrey[900],
  borderRadius: theme.shape.borderRadius,
}));

const DisplayComments = ({ card }) => {
  const { cards } = useCards(`/api/cards?boardID=${card.board}`);
  const { user } = useUser(`/api/user`);
  const { users, loadingUsers } = useUsers(
    `/api/boardUsers?boardID=${card.board}`
  );
  const [selectedComment, setSelectedComment] = useState("");
  const [commentIndex, setCommentIndex] = useState();

  return (
    !loadingUsers &&
    cards[card._id].comments.map((comment, index) => (
      <Box key={comment._id} sx={{ mt: 1.5 }}>
        {comment !== selectedComment ? (
          <Box>
            <Stack direction="row" alignItems="center" sx={{ mb: 1 }}>
              <Stack direction="row" alignItems="center" gap={1}>
                <UserAvatar size="small" user={users[comment.user]} />
                <Typography
                  sx={{ fontWeight: "fontWeightMedium", color: blueGrey[900] }}
                >
                  {users[comment.user].name}
                </Typography>
                <Typography variant="caption" sx={{ color: blueGrey[700] }}>
                  {format(
                    new Date(Date.parse(comment.date)),
                    `dd MMM, ${
                      isThisYear(Date.parse(comment.date)) ? "h:mm a" : "yyyy"
                    }`
                  )}
                </Typography>
              </Stack>
              {users[comment.user]._id === user._id && (
                <Button
                  size="small"
                  onClick={() => {
                    setSelectedComment(comment);
                    setCommentIndex(index);
                  }}
                >
                  edit
                </Button>
              )}
            </Stack>

            <Comment>
              <Typography>{comment.comment}</Typography>
            </Comment>
          </Box>
        ) : (
          <EditComment
            card={card}
            comment={comment}
            index={index}
            setSelectedComment={setSelectedComment}
          />
        )}
      </Box>
    ))
  );
};

export default DisplayComments;
