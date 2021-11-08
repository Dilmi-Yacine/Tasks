import { useState } from "react";
import useUser from "../../lib/useUser";
import axios from "axios";
import { Formik } from "formik";
import * as Yup from "yup";
import Box from "@mui/system/Box";
import Stack from "@mui/material/Stack";
import Typography from "@mui/material/Typography";
import Dialog from "@mui/material/Dialog";
import Alert from "@mui/material/Alert";
import Button from "@mui/material/Button";
import TextField from "@mui/material/TextField";
import ShareIcon from "@mui/icons-material/Share";
import IconButton from "@mui/material/IconButton";
import { blueGrey, grey } from "@mui/material/colors";

const ShareBoards = ({ board }) => {
  const { user } = useUser(`/api/user`);

  const [open, setOpen] = useState(false);
  const [error, setError] = useState();

  const handleClickOpen = () => {
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
  };

  return (
    user._id === board.user && (
      <Box>
        <IconButton onClick={handleClickOpen}>
          <ShareIcon color="primary" sx={{ fontSize: 22 }} />
        </IconButton>
        <Dialog open={open} onClose={handleClose}>
          <Box sx={{ p: 2 }}>
            <Typography variant="h5" sx={{ color: grey[800] }}>
              Invite a member
            </Typography>
            {error && (
              <Alert severity="error" sx={{ my: 1 }}>
                {error}
              </Alert>
            )}
            <Typography sx={{ color: blueGrey[900] }}>
              Share the board and collaborate with others. (you need their
              <br />
              account email).
            </Typography>
            <Formik
              initialValues={{ email: "" }}
              validationSchema={Yup.object().shape({
                email: Yup.string()
                  .email()
                  .trim()
                  .required()
                  .max(50)
                  .label("Email"),
              })}
              onSubmit={async (values) => {
                const response = await axios.patch(`/api/boards/${board._id}`, {
                  email: values.email,
                });
                if (!response.data.success) setError(response.data.error);
                else {
                  setError("");
                  await mutate("/api/boards");
                  await mutate(`/api/boards/${board._id}`);
                }
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
                <form onSubmit={handleSubmit}>
                  <TextField
                    id="email"
                    name="email"
                    type="email"
                    label="Email"
                    autoFocus
                    variant="standard"
                    fullWidth
                    margin="dense"
                    onChange={handleChange}
                    onBlur={handleBlur}
                    value={values.email}
                    error={errors.email && touched.email}
                    helperText={errors.email && touched.email && errors.email}
                  />
                  <Stack
                    direction="row"
                    justifyContent="flex-end"
                    gap={1}
                    sx={{ mt: 1 }}
                  >
                    <Button variant="outlined" onClick={handleClose}>
                      Cancel
                    </Button>
                    <Button
                      disabled={
                        values.email.length === 0 ? true : false || !isValid
                      }
                      variant="contained"
                      onClick={handleClose}
                    >
                      Share
                    </Button>
                  </Stack>
                </form>
              )}
            </Formik>
          </Box>
        </Dialog>
      </Box>
    )
  );
};

export default ShareBoards;
