import { useState } from "react";
import { useSWRConfig } from "swr";
import useCards from "../../../../lib/useCards";
import axios from "axios";
import "date-fns";
import isValid from "date-fns/isValid";
import differenceInDays from "date-fns/differenceInDays";
import isBefore from "date-fns/isBefore";
import DateAdapter from "@mui/lab/AdapterDateFns";
import LocalizationProvider from "@mui/lab/LocalizationProvider";
import DateTimePicker from "@mui/lab/DateTimePicker";
import Box from "@mui/system/Box";
import Stack from "@mui/material/Stack";
import Menu from "@mui/material/Menu";
import Typography from "@mui/material/Typography";
import TextField from "@mui/material/TextField";
import Button from "@mui/material/Button";
import DateRangeIcon from "@mui/icons-material/DateRange";
import { blueGrey, grey, red, yellow, indigo } from "@mui/material/colors";
import { AddBox } from "../addBox";

const AddDueDate = ({ card }) => {
  const { mutate } = useSWRConfig();
  const { cards } = useCards(`/api/cards?boardID=${card.board}`);

  const [date, setDate] = useState(new Date());

  const [anchorEl, setAnchorEl] = useState(null);
  const open = Boolean(anchorEl);
  const handleClick = (event) => {
    setAnchorEl(event.currentTarget);
  };
  const handleClose = () => {
    setAnchorEl(null);
  };

  const setDueDate = async () => {
    let state, stateColor;
    var daysDiffrence = differenceInDays(Date.parse(date), Date.now());

    if (daysDiffrence <= 0 && isBefore(Date.parse(date), Date.now())) {
      stateColor = red[200];
      state = "overdue";
    }

    if (daysDiffrence === 0 && !isBefore(Date.parse(date), Date.now())) {
      stateColor = yellow[200];
      state = "due soon";
    }

    if (daysDiffrence > 0) {
      stateColor = "";
      state = "";
    }

    const dueDate = {
      date: date,
      checked: false,
      state,
      stateColor,
    };

    const updatedCard = {
      ...cards[card._id],
      dueDate: dueDate,
    };

    mutate(
      `/api/cards?boardID=${card.board}`,
      { ...cards, [card._id]: updatedCard },
      false
    );

    await axios.patch(
      `${process.env.NEXT_PUBLIC_Base_URL}/api/cards?boardID=${card.board}`,
      {
        cardID: card._id,
        date,
        dueDateChecked: false,
        state,
        color: stateColor,
      }
    );
    mutate(`/api/cards?boardID=${card.board}`);
  };

  return (
    <Box>
      <AddBox onClick={handleClick}>
        <DateRangeIcon sx={{ color: indigo[300] }} fontSize="small" />
        <Typography variant="subtitle2" sx={{ color: grey[700] }}>
          Due date
        </Typography>
      </AddBox>
      <Menu
        id="Duedate-menu"
        anchorEl={anchorEl}
        open={open}
        onClose={handleClose}
      >
        <Stack sx={{ p: "0px 8px 0px 8px", width: "256px" }} gap={1}>
          <Typography
            sx={{
              mb: 0.5,
              color: blueGrey[700],
              fontWeight: "fontWeightMedium",
            }}
          >
            Due date
          </Typography>

          <LocalizationProvider dateAdapter={DateAdapter}>
            <DateTimePicker
              renderInput={(props) => <TextField {...props} />}
              label="DateTimePicker"
              value={date}
              onChange={(newValue) => {
                setDate(newValue);
              }}
            />
          </LocalizationProvider>
          <Button
            disabled={isValid(date) ? false : true}
            size="small"
            variant="contained"
            sx={{ alignSelf: "flex-end" }}
            onClick={setDueDate}
          >
            Save
          </Button>
        </Stack>
      </Menu>
    </Box>
  );
};

export default AddDueDate;
