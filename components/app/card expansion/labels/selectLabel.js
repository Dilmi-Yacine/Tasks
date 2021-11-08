import { useSWRConfig } from "swr";
import { useState, useEffect } from "react";
import useCards from "../../../../lib/useCards";
import Stack from "@mui/material/Stack";
import Box from "@mui/system/Box";
import Typography from "@mui/material/Typography";
import Chip from "@mui/material/Chip";
import { blueGrey } from "@mui/material/colors";
import axios from "axios";

const SelectLabel = ({ card, labels }) => {
  const { mutate } = useSWRConfig();

  const { cards } = useCards(`/api/cards?boardID=${card.board}`);
  const [availableLabelIDs, setAvailableLabelIDs] = useState([]);

  useEffect(() => {
    const filtredLabels = Object.keys(labels).filter(
      (label) => !cards[card._id].labels.includes(label)
    );
    setAvailableLabelIDs(filtredLabels);
  }, [cards[card._id].labels]);

  const chooseLabel = async (labelID, labelIndex) => {
    const updatedAvailableLabelIDs = Array.from(availableLabelIDs);
    updatedAvailableLabelIDs.splice(labelIndex, 1);
    setAvailableLabelIDs(updatedAvailableLabelIDs);

    let cardLabels = Array.from(card.labels);
    cardLabels.push(labelID);
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
      label: labelID,
    });

    mutate(`/api/cards?boardID=${card.board}`);
  };

  return (
    availableLabelIDs.length > 0 && (
      <Box>
        <Typography
          sx={{ mb: 1, color: blueGrey[700], fontWeight: "fontWeightMedium" }}
        >
          Choose label
        </Typography>
        <Stack
          direction="row"
          gap={0.5}
          sx={{ width: "240px", flexFlow: "row wrap" }}
        >
          {availableLabelIDs.map((labelID, labelIndex) => (
            <Chip
              key={labelID}
              size="small"
              label={labels[labelID].label}
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
              onClick={() => chooseLabel(labelID, labelIndex)}
            />
          ))}
        </Stack>
      </Box>
    )
  );
};

export default SelectLabel;
