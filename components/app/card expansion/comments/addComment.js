import { useState } from "react";
import { useSWRConfig } from "swr";
import useUser from "../../../../lib/useUser";
import axios from "axios";
import { Formik } from "formik";
import * as Yup from "yup";
import { grey, indigo } from "@mui/material/colors";
import Box from "@mui/system/Box";
import Stack from "@mui/material/Stack";
import Typography from "@mui/material/Typography";
import Button from "@mui/material/Button";
import IconButton from "@mui/material/IconButton";
import ClearIcon from "@mui/icons-material/Clear";
import TextField from "@mui/material/TextField";
import ModeCommentOutlinedIcon from "@mui/icons-material/ModeCommentOutlined";
import DisplayComments from "./displayComments";

const AddComment = ({ card }) => {
  const { mutate } = useSWRConfig();
  const { user } = useUser(`/api/user`);

  const [open, handleOpen] = useState(false);
  return (
    <Box>
      <Stack direction="row" alignItems="center" gap={1}>
        <ModeCommentOutlinedIcon sx={{ color: indigo[300] }} />
        <Typography variant="h6" sx={{ color: grey[800] }}>
          Comments
        </Typography>
      </Stack>
      <Formik
        initialValues={{ comment: "" }}
        validationSchema={Yup.object().shape({
          comment: Yup.string().trim().min(5).max(200).label("Comment"),
        })}
        onSubmit={async (values) => {
          await axios.patch(`/api/cards?boardID=${card.board}`, {
            cardID: card._id,
            comment: values.comment,
            user: user._id,
          });
          mutate(`/api/cards?boardID=${card.board}`);
          values.comment = "";
        }}
      >
        {({ values, isValid, handleChange, handleBlur, handleSubmit }) => (
          <form onSubmit={handleSubmit}>
            <TextField
              id="comment"
              name="comment"
              variant="outlined"
              multiline
              rows={2}
              fullWidth
              onClick={() => handleOpen(true)}
              onChange={handleChange}
              onBlur={handleBlur}
              value={values.comment}
            />
            {open && (
              <Box>
                <Button
                  disabled={!values.comment.length ? true : false || !isValid}
                  variant="contained"
                  color="primary"
                  onClick={handleSubmit}
                  size="small"
                >
                  Save
                </Button>
                <IconButton color="primary" onClick={() => handleOpen(false)}>
                  <ClearIcon />
                </IconButton>
              </Box>
            )}
          </form>
        )}
      </Formik>
      <DisplayComments card={card} />
    </Box>
  );
};

export default AddComment;
