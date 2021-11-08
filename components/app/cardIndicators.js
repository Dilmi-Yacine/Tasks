import { useState, useEffect } from "react";
import useCards from "../../lib/useCards";
import useUsers from "../../lib/useUsers";
import format from "date-fns/format";
import isThisYear from "date-fns/isThisYear";
import Stack from "@mui/material/Stack";
import Paper from "@mui/material/Paper";
import Typography from "@mui/material/Typography";
import AvatarGroup from "@mui/material/AvatarGroup";
import { blueGrey } from "@mui/material/colors";
import AccessTimeIcon from "@mui/icons-material/AccessTime";
import SubjectIcon from "@mui/icons-material/Subject";
import CheckCircleOutlineIcon from "@mui/icons-material/CheckCircleOutline";
import ModeCommentOutlinedIcon from "@mui/icons-material/ModeCommentOutlined";
import UserAvatar from "./userAvatar";

const CardIndicators = ({ card }) => {
  const { cards } = useCards(`/api/cards?boardID=${card.board}`);
  const { users } = useUsers(`/api/boardUsers?boardID=${card.board}`);

  const [checked, setChecked] = useState(0);

  useEffect(() => {
    let checkedItem = 0;
    cards[card._id].checklist.forEach((checkItem) => {
      if (checkItem.checked) {
        checkedItem++;
        setChecked(checkedItem);
      } else {
        setChecked(checkedItem);
      }
    });
  }, [cards[card._id].checklist]);

  return (
    <Stack
      direction="row"
      alignItems="center"
      justifyContent="flex-end"
      gap={0.5}
      sx={{ flexFlow: "row wrap" }}
    >
      <Stack direction="row" gap={1} sx={{ flexGrow: 1 }}>
        {/* Due Date */}
        {typeof cards[card._id].dueDate !== "undefined" && (
          <Paper
            elevation={0}
            sx={{ bgcolor: cards[card._id].dueDate.stateColor, px: 0.5 }}
          >
            <Stack direction="row" alignItems="center" gap={0.5}>
              <AccessTimeIcon
                fontSize="small"
                sx={{
                  color: blueGrey[600],
                }}
              />
              <Typography
                variant="caption"
                sx={{
                  color: blueGrey[700],
                }}
              >
                {format(
                  new Date(Date.parse(cards[card._id].dueDate.date)),
                  `dd MMM${
                    isThisYear(Date.parse(cards[card._id].dueDate.date))
                      ? ""
                      : "yyyy"
                  }`
                )}
              </Typography>
            </Stack>
          </Paper>
        )}
        {/* Description */}
        {cards[card._id].description && (
          <SubjectIcon
            fontSize="small"
            sx={{
              color: blueGrey[700],
            }}
          />
        )}
        {/* Description */}
        {cards[card._id].checklist.length > 0 && (
          <Stack direction="row" alignItems="center" gap={0.5}>
            <CheckCircleOutlineIcon
              fontSize="small"
              sx={{
                color: blueGrey[700],
              }}
            />
            <Typography
              variant="caption"
              sx={{
                color: blueGrey[800],
              }}
            >{`${checked}/${cards[card._id].checklist.length}`}</Typography>
          </Stack>
        )}
        {/* Comments */}
        {cards[card._id].comments.length > 0 && (
          <Stack direction="row" alignItems="center" gap={0.5}>
            <ModeCommentOutlinedIcon
              fontSize="small"
              sx={{
                color: blueGrey[700],
              }}
            />
            <Typography
              variant="caption"
              sx={{
                color: blueGrey[800],
              }}
            >
              {cards[card._id].comments.length}
            </Typography>
          </Stack>
        )}
      </Stack>
      {/* Members */}
      {cards[card._id].members.length > 0 && (
        <Stack direction="row" alignItems="center" gap={0.5}>
          <AvatarGroup max={2} sx={{ cursor: "pointer" }}>
            {cards[card._id].members.map((memberID) => (
              <UserAvatar
                key={memberID}
                user={users[memberID]}
                size="extraSmall"
              />
            ))}
          </AvatarGroup>
        </Stack>
      )}
    </Stack>
  );
};

export default CardIndicators;
