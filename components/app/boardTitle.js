import { useState } from "react";
import { useSWRConfig } from "swr";
import { useRouter } from "next/router";
import useBoard from "../../lib/useBoard";
import axios from "axios";
import { Formik } from "formik";
import * as Yup from "yup";
import Stack from "@mui/material/Stack";
import Box from "@mui/material/Box";
import IconButton from "@mui/material/IconButton";
import Typography from "@mui/material/Typography";
import EditIcon from "@mui/icons-material/Edit";
import TextField from "@mui/material/TextField";
import { blueGrey } from "@mui/material/colors";
import ShareBoards from "./shareBoard";

const BoardTitle = () => {
  const router = useRouter();
  const { mutate } = useSWRConfig();
  const { id } = router.query;
  const { board } = useBoard(`/api/boards/${id}`);
  const [open, handleOpen] = useState(false);

  return (
    <Stack direction="row" alignItems="flex-start" sx={{ mx: 3 }}>
      {open ? (
        <Formik
          initialValues={{ boardTitle: board.title }}
          validationSchema={Yup.object().shape({
            boardTitle: Yup.string()
              .trim()
              .required()
              .max(50)
              .label("Board Title"),
          })}
          onSubmit={async (values) => {
            mutate(
              `/api/boards/${id}`,
              { ...board, title: values.boardTitle },
              false
            );
            handleOpen(false);
            await axios.patch(`/api/boards/${id}`, {
              title: values.boardTitle,
            });
            mutate(`/api/boards/${id}`);
          }}
        >
          {({
            values,
            errors,
            touched,
            handleSubmit,
            handleChange,
            handleBlur,
          }) => (
            <Box onBlur={() => handleOpen(false)}>
              <form onSubmit={handleSubmit}>
                <TextField
                  id="boardTitle"
                  name="boardTitle"
                  label="Title"
                  variant="outlined"
                  size="small"
                  autoFocus
                  onChange={handleChange}
                  onBlur={handleBlur}
                  value={values.boardTitle}
                  error={errors.boardTitle && touched.boardTitle}
                  helperText={
                    errors.boardTitle && touched.boardTitle && errors.boardTitle
                  }
                />
              </form>
            </Box>
          )}
        </Formik>
      ) : (
        <Stack direction="row" alignItems="center" gap={1}>
          <Typography
            variant="h6"
            sx={{
              fontSize: 19,
              color: blueGrey[800],
            }}
          >
            {board.title}
          </Typography>
          <IconButton onClick={() => handleOpen(!open)}>
            <EditIcon color="primary" sx={{ fontSize: 22 }} />
          </IconButton>
        </Stack>
      )}
      <ShareBoards board={board} />
    </Stack>
  );
};

export default BoardTitle;
