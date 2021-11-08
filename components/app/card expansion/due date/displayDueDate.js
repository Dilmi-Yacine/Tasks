import { useState, useEffect } from "react";
import { useSWRConfig } from "swr";
import format from "date-fns/format";
import useCards from "../../../../lib/useCards";
import axios from "axios";
import differenceInDays from "date-fns/differenceInDays";
import isBefore from "date-fns/isBefore";
import isToday from "date-fns/isToday";
import isTomorrow from "date-fns/isTomorrow";
import isYesterday from "date-fns/isYesterday";
import isThisYear from "date-fns/isThisYear";
import { styled } from "@mui/material/styles";
import Checkbox from "@mui/material/Checkbox";
import Typography from "@mui/material/Typography";
import { blueGrey, green, red, yellow } from "@mui/material/colors";

export const DisplayDate = styled("div")(({ theme }) => ({
  display: "flex",
  alignItems: "center",
  width: "fit-content",
  paddingRight: theme.spacing(1),
  borderRadius: theme.shape.borderRadius,
  background: blueGrey[50],
}));

export const DueDateState = styled(Typography)(({ theme }) => ({
  padding: "0 2px 0px 2px",
  marginLeft: theme.spacing(1),
  borderRadius: "2px",
}));

const DisplayDueDate = ({ card }) => {
  const { mutate } = useSWRConfig();
  const { cards } = useCards(`/api/cards?boardID=${card.board}`);

  const [day, setDay] = useState("");
  const [time, setTime] = useState("");

  const dueDate =
    typeof cards[card._id].dueDate === "undefined"
      ? false
      : cards[card._id].dueDate;

  useEffect(() => {
    if (dueDate) {
      const date = Date.parse(dueDate.date);
      // set date
      if (isToday(date)) setDay("Today");
      else if (isTomorrow(date)) setDay("Tomorrow");
      else if (isYesterday(date)) setDay("Yesterday");
      else {
        setDay(
          format(new Date(date), `dd MMM${isThisYear(date) ? "" : "yyyy"}`)
        );
      }
      // set time
      setTime(format(new Date(dueDate.date), `h:mm a`));
    }
  }, [dueDate]);

  const checkCard = async () => {
    let state, color;
    const date = Date.parse(dueDate.date);

    // set due date state and color
    var daysDiffrence = differenceInDays(date, Date.now());

    if (daysDiffrence <= 0 && isBefore(date, Date.now())) {
      color = red[200];
      state = "overdue";
    }

    if (daysDiffrence === 0 && !isBefore(date, Date.now())) {
      color = yellow[200];
      state = "due soon";
    }

    if (daysDiffrence > 0) {
      color = "";
      state = "";
    }

    const updatedDueDate = {
      ...cards[card._id].dueDate,
      checked: !cards[card._id].dueDate.checked,
      state: cards[card._id].dueDate.checked ? state : "complete",
      stateColor: cards[card._id].dueDate.checked ? color : green[200],
    };

    const updatedCard = {
      ...cards[card._id],
      dueDate: updatedDueDate,
    };

    mutate(
      `/api/cards?boardID=${card.board}`,
      { ...cards, [card._id]: updatedCard },
      false
    );
    await axios.patch(`/api/cards?boardID=${card.board}`, {
      cardID: card._id,
      checked: !dueDate.checked,
      state,
      color,
    });

    mutate(`/api/cards?boardID=${card.board}`);
  };

  return (
    typeof cards[card._id].dueDate !== "undefined" && (
      <DisplayDate>
        <Checkbox
          size="small"
          color="primary"
          onChange={checkCard}
          checked={cards[card._id].dueDate.checked}
        />
        <Typography sx={{ color: blueGrey[900] }}>
          {`${day},`} at {time}
        </Typography>
        <DueDateState
          variant="caption"
          sx={{
            bgcolor: cards[card._id].dueDate.stateColor,
            color: blueGrey[900],
          }}
        >
          {cards[card._id].dueDate.state}
        </DueDateState>
      </DisplayDate>
    )
  );
};

export default DisplayDueDate;
