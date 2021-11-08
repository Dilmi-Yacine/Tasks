import useCards from "../../lib/useCards";
import useLabels from "../../lib/useLabels";
import Stack from "@mui/material/Stack";
import Paper from "@mui/material/Paper";

const CardLabels = ({ card }) => {
  const { cards } = useCards(`/api/cards?boardID=${card.board}`);
  const { labels } = useLabels(`/api/labels?boardID=${card.board}`);

  return (
    <Stack direction="row" alignItems="center" gap={1}>
      {cards[card._id].labels.map((labelID) => (
        <Paper
          elevation={0}
          key={labelID}
          sx={{
            width: "40px",
            height: "5px",
            bgcolor: labels[labelID].color,
            mb: 0.5,
          }}
        ></Paper>
      ))}
    </Stack>
  );
};

export default CardLabels;
