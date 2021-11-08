import { useState } from "react";
import { useSWRConfig } from "swr";
import axios from "axios";
import { styled } from "@mui/material/styles";
import { Formik } from "formik";
import * as Yup from "yup";
import Paper from "@mui/material/Paper";
import Box from "@mui/system/Box";
import TextField from "@mui/material/TextField";
import Typography from "@mui/material/Typography";
import Button from "@mui/material/Button";
import IconButton from "@mui/material/IconButton";
import ClearIcon from "@mui/icons-material/Clear";
import { blueGrey } from "@mui/material/colors";

const AddListBox = styled(Paper)(({ theme }) => ({
  width: theme.spacing(35),
  padding: theme.spacing(1),
  color: "#5e6c87",
  background: blueGrey[50],
  borderRadius: theme.shape.borderRadius,
  cursor: "pointer",
  transition: " 0.3s",
  "&:hover": {
    backgroundColor: blueGrey[100],
  },
}));

const Form = styled("form")(({ theme }) => ({
  width: theme.spacing(35),
  padding: theme.spacing(1),
  background: blueGrey[50],
  borderRadius: theme.shape.borderRadius,
}));

const AddList = ({ boardID }) => {
  const { mutate } = useSWRConfig();
  const [open, handleOpen] = useState(false);
  return (
    <Box>
      {open ? (
        <Formik
          initialValues={{ listTitle: "" }}
          validationSchema={Yup.object().shape({
            listTitle: Yup.string().trim().max(50).required().label("Title"),
          })}
          onSubmit={async (values) => {
            await axios.post(`/api/lists`, {
              board: boardID,
              title: values.listTitle,
            });

            await mutate(`/api/lists?boardID=${boardID}`);
            await mutate(`/api/boards/${boardID}`);

            handleOpen(false);
          }}
        >
          {({
            values,
            errors,
            touched,
            isValid,
            handleSubmit,
            handleChange,
            handleBlur,
          }) => (
            <Form onSubmit={handleSubmit}>
              <TextField
                id="listTitle"
                name="listTitle"
                label="List"
                variant="outlined"
                size="small"
                autoFocus
                fullWidth
                onChange={handleChange}
                onBlur={handleBlur}
                value={values.listTitle}
                error={errors.listTitle && touched.listTitle}
                helperText={
                  errors.listTitle && touched.listTitle && errors.listTitle
                }
              />
              <div>
                <Button
                  disabled={!values.listTitle.length ? true : false || !isValid}
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
              </div>
            </Form>
          )}
        </Formik>
      ) : (
        <AddListBox elevation={0} onClick={() => handleOpen(!open)}>
          <Typography>+ Add a List</Typography>
        </AddListBox>
      )}
    </Box>
  );
};

export default AddList;
