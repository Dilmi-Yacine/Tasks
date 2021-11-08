import { useState } from "react";
import { useSWRConfig } from "swr";
import axios from "axios";
import { Formik } from "formik";
import * as Yup from "yup";
import { styled } from "@mui/material/styles";
import { blueGrey, grey, indigo } from "@mui/material/colors";
import Box from "@mui/system/Box";
import Stack from "@mui/material/Stack";
import Typography from "@mui/material/Typography";
import Paper from "@mui/material/Paper";
import Button from "@mui/material/Button";
import IconButton from "@mui/material/IconButton";
import ClearIcon from "@mui/icons-material/Clear";
import TextField from "@mui/material/TextField";
import CheckCircleOutlineIcon from "@mui/icons-material/CheckCircleOutline";
import DisplayCheckList from "./displayCheckList";

const ChecklistBox = styled(Paper)(({ theme }) => ({
  padding: theme.spacing(1),
  background: blueGrey[50],
  borderRadius: theme.shape.borderRadius,
  cursor: "pointer",
  transition: " 0.3s",
  "&:hover": {
    backgroundColor: blueGrey[100],
  },
}));

const AddChecklist = ({ card }) => {
  const { mutate } = useSWRConfig();
  const [open, handleOpen] = useState(false);

  return (
    <Box>
      <Stack direction="row" alignItems="center" gap={1}>
        <CheckCircleOutlineIcon sx={{ color: indigo[300] }} />
        <Typography variant="h6" sx={{ color: grey[800] }}>
          Checklist
        </Typography>
      </Stack>
      {open ? (
        <Formik
          initialValues={{ item: "" }}
          validationSchema={Yup.object().shape({
            item: Yup.string().trim().min(5).max(150).label("Check item"),
          })}
          onSubmit={async (values) => {
            await axios.patch(`/api/cards?boardID=${card.board}`, {
              cardID: card._id,
              item: values.item,
            });
            mutate(`/api/cards?boardID=${card.board}`);
            handleOpen(false);
            values.item = "";
          }}
        >
          {({ values, isValid, handleChange, handleBlur, handleSubmit }) => (
            <form onSubmit={handleSubmit}>
              <TextField
                id="item"
                name="item"
                variant="outlined"
                size="small"
                fullWidth={true}
                autoFocus
                onChange={handleChange}
                onBlur={handleBlur}
                value={values.item}
              />
              <Button
                disabled={!values.item.length ? true : false || !isValid}
                size="small"
                variant="contained"
                color="primary"
                type="submit"
                onClick={handleSubmit}
              >
                Add
              </Button>
              <IconButton
                size="small"
                color="primary"
                onClick={() => handleOpen(false)}
              >
                <ClearIcon />
              </IconButton>
            </form>
          )}
        </Formik>
      ) : (
        <ChecklistBox elevation={0} onClick={() => handleOpen(!open)}>
          <Typography sx={{ color: grey[800] }}>
            Add a subtask or item
          </Typography>
        </ChecklistBox>
      )}
      <DisplayCheckList card={card} />
    </Box>
  );
};

export default AddChecklist;
