import { useState } from "react";
import { useSWRConfig } from "swr";
import axios from "axios";
import { styled } from "@mui/material/styles";
import { Formik } from "formik";
import * as Yup from "yup";
import Paper from "@mui/material/Paper";
import Typography from "@mui/material/Typography";
import TextField from "@mui/material/TextField";
import Button from "@mui/material/Button";
import IconButton from "@mui/material/IconButton";
import ClearIcon from "@mui/icons-material/Clear";
import { blueGrey } from "@mui/material/colors";

const AddCardBox = styled(Paper)(({ theme }) => ({
  padding: theme.spacing(1),
  color: "#5e6c87",
  background: "#ecf0f1",
  borderRadius: theme.shape.borderRadius,
  cursor: "pointer",
  transition: " 0.3s",
  "&:hover": {
    backgroundColor: blueGrey[100],
  },
}));

const AddCard = ({ list }) => {
  const { mutate } = useSWRConfig();

  const [open, handleOpen] = useState(false);

  return open ? (
    <Formik
      initialValues={{ cardTitle: "" }}
      validationSchema={Yup.object().shape({
        cardTitle: Yup.string().trim().required().max(50).label("Card Title"),
      })}
      onSubmit={async (values) => {
        await axios.post(`/api/cards`, {
          board: list.board,
          list: list._id,
          title: values.cardTitle,
        });

        await mutate(`/api/cards?boardID=${list.board}`);
        await mutate(`/api/lists?boardID=${list.board}`);
        handleOpen(false);
      }}
    >
      {({
        values,
        errors,
        touched,
        isValid,
        handleChange,
        handleBlur,
        handleSubmit,
      }) => (
        <form onSubmit={handleSubmit}>
          <TextField
            id="cardTitle"
            name="cardTitle"
            label="Card"
            variant="outlined"
            autoFocus
            fullWidth
            size="small"
            onChange={handleChange}
            onBlur={handleBlur}
            value={values.cardTitle}
            error={errors.cardTitle && touched.cardTitle}
            helperText={
              errors.cardTitle && touched.cardTitle && errors.cardTitle
            }
          />
          <Button
            disabled={!values.cardTitle.length ? true : false || !isValid}
            size="small"
            variant="contained"
            color="primary"
            onClick={handleSubmit}
          >
            Add
          </Button>
          <IconButton
            edge="end"
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
    <AddCardBox elevation={0} onClick={() => handleOpen(!open)}>
      <Typography>+ Add a card</Typography>
    </AddCardBox>
  );
};

export default AddCard;
