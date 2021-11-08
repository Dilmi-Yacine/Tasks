import { useState, useEffect } from "react";
import { useSWRConfig } from "swr";
import { Draggable } from "react-beautiful-dnd";
import useCards from "../../lib/useCards";
import axios from "axios";
import differenceInDays from "date-fns/differenceInDays";
import isBefore from "date-fns/isBefore";
import { styled } from "@mui/material/styles";
import { blueGrey, red, yellow } from "@mui/material/colors";
import Paper from "@mui/material/Paper";
import Box from "@mui/system/Box";
import Typography from "@mui/material/Typography";
import CardExpansion from "./card expansion/cardExpansion";
import CardIndicators from "./cardIndicators";
import CardLabels from "./cardLabels";

const CardBox = styled(Paper)(({ theme }) => ({
  padding: theme.spacing(1),
  borderBottom: `1px solid ${blueGrey[200]}`,
  marginBottom: theme.spacing(1),
}));

const Card = ({ card, index, list }) => {
  const { cards } = useCards(`/api/cards?boardID=${card.board}`);
  const { mutate } = useSWRConfig();
  var [timer, setTimer] = useState(Date.now());

  const [open, setOpen] = useState(false);
  const handleClickOpen = () => {
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
  };

  const dueDate =
    typeof cards[card._id].dueDate === "undefined"
      ? false
      : cards[card._id].dueDate;

  useEffect(() => {
    var time = setInterval(() => setTimer(new Date()), 1000);

    const setDueDateState = () => {
      const date = Date.parse(dueDate.date);
      // set due date state and color
      var daysDiffrence = differenceInDays(date, Date.now());
      if (!dueDate.checked) {
        if (
          daysDiffrence <= 0 &&
          isBefore(date, Date.now()) &&
          dueDate.state !== "overdue"
        ) {
          axios.patch(`/api/cards?boardID=${card.board}`, {
            cardID: card._id,
            dueDateState: "overdue",
            dueDateStateColor: red[200],
          });
          mutate(`/api/cards?boardID=${card.board}`);
        }

        if (
          daysDiffrence === 0 &&
          !isBefore(date, Date.now()) &&
          dueDate.state !== "due soon"
        ) {
          axios.patch(`/api/cards?boardID=${card.board}`, {
            cardID: card._id,
            dueDateState: "due soon",
            dueDateStateColor: yellow[200],
          });
          mutate(`/api/cards?boardID=${card.board}`);
        }

        if (daysDiffrence > 0 && dueDate.state !== "") {
          axios.patch(`/api/cards?boardID=${card.board}`, {
            cardID: card._id,
            dueDateState: "",
            dueDateStateColor: "",
          });
          mutate(`/api/cards?boardID=${card.board}`);
        }
      }
    };

    if (dueDate) {
      setDueDateState();
    }

    return () => {
      clearInterval(time);
    };
  }, [dueDate, timer]);

  return (
    <Box>
      <Draggable draggableId={card._id} index={index}>
        {(provided) => (
          <CardBox
            {...provided.draggableProps}
            {...provided.dragHandleProps}
            ref={provided.innerRef}
            onClick={handleClickOpen}
            sx={{ overflowWrap: "break-word" }}
            elevation={0}
          >
            <CardLabels card={card} />
            <Typography sx={{ my: 0.5, color: blueGrey[800] }}>
              {card.title}
            </Typography>
            <CardIndicators card={card} />
          </CardBox>
        )}
      </Draggable>
      <CardExpansion
        card={card}
        list={list}
        open={open}
        handleClose={handleClose}
      />
    </Box>
  );
};

export default Card;
