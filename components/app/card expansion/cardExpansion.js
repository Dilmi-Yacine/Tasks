import Stack from "@mui/material/Stack";
import Box from "@mui/system/Box";
import Dialog from "@mui/material/Dialog";
import Typography from "@mui/material/Typography";
import Divider from "@mui/material/Divider";
import { indigo } from "@mui/material/colors";
import EditCardTitle from "./editCardTitle";
import InList from "./InList";
import AddDescription from "./addDescription";
import AddChecklist from "./checkLists/addCheckList";
import AddComment from "./comments/addComment";
import DisplayLabels from "./labels/displayLabels";
import AddMember from "./members/addMember";
import AddLabel from "./labels/addLabel";
import DisplayMembers from "./members/displayMembers";
import AddDueDate from "./due date/addDueDate";
import DisplayDueDate from "./due date/displayDueDate";

const CardExpansion = ({ card, list, open, handleClose }) => {
  return (
    <Dialog
      open={open}
      onClose={handleClose}
      scroll="body"
      fullWidth
      //maxWidth="sm"
    >
      <Box sx={{ p: 1.5 }}>
        <EditCardTitle card={card} handleClose={handleClose} />
        <Stack direction="row" gap={2}>
          <Stack gap={2} sx={{ flexGrow: "1" }}>
            <InList list={list} />
            <Stack
              direction="row"
              alignItems="center"
              gap={1}
              sx={{ flexFlow: "row wrap" }}
            >
              <DisplayLabels card={card} />
              <DisplayMembers card={card} />
            </Stack>
            <DisplayDueDate card={card} />
            <AddDescription card={card} />
            <AddChecklist card={card} />
            <AddComment card={card} />
          </Stack>
          <Stack justifyContent="space-between">
            <Stack gap={1}>
              <Divider textAlign="center" flexItem>
                <Typography variant="button" sx={{ color: indigo[400] }}>
                  Add to card
                </Typography>
              </Divider>
              <AddMember card={card} />
              <AddLabel card={card} />
              <AddDueDate card={card} />
            </Stack>
          </Stack>
        </Stack>
      </Box>
    </Dialog>
  );
};

export default CardExpansion;
