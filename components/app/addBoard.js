import { useSWRConfig } from "swr";
import { styled } from "@mui/material/styles";
import { Formik } from "formik";
import * as Yup from "yup";
import axios from "axios";
import Button from "@mui/material/Button";
import TextField from "@mui/material/TextField";

const Form = styled("form")(({ theme }) => ({
  display: "flex",
  justifyContent: "center",
  alignItems: "center",
  marginBottom: theme.spacing(3),
}));

function AddBoard() {
  const { mutate } = useSWRConfig();

  return (
    <div>
      <Formik
        initialValues={{ board: "" }}
        validationSchema={Yup.object().shape({
          board: Yup.string().trim().required().max(50).label("Board Title"),
        })}
        onSubmit={async (values) => {
          await axios.post(`/api/boards`, { title: values.board });
          values.board = "";
          mutate("/api/boards");
        }}
      >
        {({ values, isValid, handleSubmit, handleChange, handleBlur }) => (
          <Form onSubmit={handleSubmit}>
            <TextField
              id="board"
              name="board"
              label="New Board"
              placeholder={"Board Title"}
              variant="outlined"
              size="small"
              onChange={handleChange}
              onBlur={handleBlur}
              autoFocus
              value={values.board}
            />
            <Button
              disabled={!values.board.length ? true : false || !isValid}
              variant="contained"
              color="primary"
              type="submit"
              sx={{ ml: 1 }}
              onClick={handleSubmit}
            >
              Add
            </Button>
          </Form>
        )}
      </Formik>
    </div>
  );
}

export default AddBoard;
