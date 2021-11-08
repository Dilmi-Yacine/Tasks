import { useSWRConfig } from "swr";
import useCards from "../../../../lib/useCards";
import { useState } from "react";
import useLabels from "../../../../lib/useLabels";
import Stack from "@mui/material/Stack";
import Box from "@mui/system/Box";
import Chip from "@mui/material/Chip";
import axios from "axios";
import EditLabel from "./editLabel";

const DisplayLabels = ({ card }) => {
  const { mutate } = useSWRConfig();
  const { cards } = useCards(`/api/cards?boardID=${card.board}`);
  const { labels } = useLabels(`/api/labels?boardID=${card.board}`);
  const [openedLabel, setOpenedLabel] = useState("");

  const [anchorEl, setAnchorEl] = useState(null);
  const open = Boolean(anchorEl);

  const handleClick = (event) => {
    setAnchorEl(event.currentTarget);
  };
  const handleClose = () => {
    setAnchorEl(null);
  };

  const removeLabelFromCard = async (labelID) => {
    let cardLabels = Array.from(card.labels);
    cardLabels.splice(cardLabels.indexOf(labelID), 1);
    const updatedCardLabels = {
      ...cards[card._id],
      labels: cardLabels,
    };
    mutate(
      `/api/cards?boardID=${card.board}`,
      { ...cards, [card._id]: updatedCardLabels },
      false
    );
    await axios.patch(`/api/cards?boardID=${card.board}`, {
      cardID: card._id,
      labelID,
    });
    mutate(`/api/cards?boardID=${card.board}`);
  };

  return (
    cards[card._id].labels.length > 0 && (
      <Stack direction="row" gap={0.5} sx={{ flexFlow: "row wrap" }}>
        {cards[card._id].labels.map((labelID) => (
          <Box key={labelID}>
            <Chip
              sx={{
                bgcolor: labels[labelID].color,
                color: "white",
                fontWeight: "bold",
                opacity: 1,
                transition: "0.3s",
                ":hover": {
                  bgcolor: labels[labelID].color,
                  opacity: 0.8,
                },
              }}
              label={labels[labelID].label}
              size="small"
              onClick={(event) => {
                handleClick(event);
                setOpenedLabel(labelID);
              }}
              onDelete={() => removeLabelFromCard(labelID)}
            />
            <EditLabel
              card={card}
              labelID={openedLabel}
              labels={labels}
              open={open}
              anchorEl={anchorEl}
              handleClose={handleClose}
            />
          </Box>
        ))}
      </Stack>
    )
  );
};

export default DisplayLabels;
