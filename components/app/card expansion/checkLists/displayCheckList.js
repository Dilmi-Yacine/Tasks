import { useState, useEffect } from "react";
import { useSWRConfig } from "swr";
import axios from "axios";
import useCards from "../../../../lib/useCards";
import { styled } from "@mui/material/styles";
import { blueGrey } from "@mui/material/colors";
import Box from "@mui/system/Box";
import Stack from "@mui/material/Stack";
import Typography from "@mui/material/Typography";
import LinearProgressWithLabel from "./linearProgressWithLabel";
import FormGroup from "@mui/material/FormGroup";
import Checkbox from "@mui/material/Checkbox";
import EditCheckList from "./editChecklist";

const Item = styled("div")(({ theme }) => ({
  flexGrow: "1",
  paddingTop: theme.spacing(0.8),
  inlineSize: theme.spacing(48),
  overflowWrap: "break-word",
  color: blueGrey[900],
  cursor: "pointer",
  transition: " 0.2s",
  "&:hover": {
    backgroundColor: blueGrey[50],
  },
}));

const DisplayCheckList = ({ card }) => {
  const { mutate } = useSWRConfig();
  const { cards } = useCards(`/api/cards?boardID=${card.board}`);

  const [progress, setProgress] = useState(0);
  const [ItemID, setItemID] = useState("");
  const [itemIndex, setItemIndex] = useState();

  useEffect(() => {
    let checked = 0;
    cards[card._id].checklist.forEach((checkItem) =>
      checkItem.checked === true ? checked++ : checked
    );
    const value = (checked / cards[card._id].checklist.length) * 100;
    setProgress(value);
  }, [cards[card._id].checklist]);

  const handleChange = async (index) => {
    const updatedItem = {
      ...cards[card._id].checklist[index],
      checked: !cards[card._id].checklist[index].checked,
    };

    const cardCheckist = Array.from(cards[card._id].checklist);

    cardCheckist.splice(index, 1, updatedItem);

    const updatedCard = {
      ...cards[card._id],
      checklist: cardCheckist,
    };

    mutate(
      `/api/cards?boardID=${card.board}`,
      { ...cards, [card._id]: updatedCard },
      false
    );
    await axios.patch(`/api/cards?boardID=${card.board}`, {
      cardID: card._id,
      index: index + 1,
    });
    mutate(`/api/cards?boardID=${card.board}`);
  };

  return (
    <Box>
      {cards[card._id].checklist.length > 0 && (
        <LinearProgressWithLabel value={progress} />
      )}
      <FormGroup>
        {cards[card._id].checklist.map((checkItem, index) => (
          <Stack key={checkItem._id} direction="row" gap={0.5}>
            <Checkbox
              size="small"
              checked={checkItem.checked}
              onChange={() => handleChange(index)}
              sx={{ alignSelf: "flex-start" }}
            />
            {checkItem._id === ItemID ? (
              <EditCheckList
                card={card}
                listItem={checkItem.item}
                itemIndex={itemIndex}
                setItemID={setItemID}
              />
            ) : (
              <Item
                sx={{
                  textDecoration:
                    checkItem.checked === true ? "line-through" : "",
                }}
                onClick={() => {
                  setItemID(checkItem._id);
                  setItemIndex(index);
                }}
              >
                <Typography>{checkItem.item}</Typography>
              </Item>
            )}
          </Stack>
        ))}
      </FormGroup>
    </Box>
  );
};

export default DisplayCheckList;
