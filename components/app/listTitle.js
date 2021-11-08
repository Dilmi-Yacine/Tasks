import { useState } from "react";
import { useSWRConfig } from "swr";
import useLists from "../../lib/useLists";
import { Formik } from "formik";
import * as Yup from "yup";
import axios from "axios";
import Box from "@mui/material/Box";
import TextField from "@mui/material/TextField";
import Typography from "@mui/material/Typography";
import { blueGrey } from "@mui/material/colors";

const ListTitle = ({ list }) => {
  const { mutate } = useSWRConfig();
  const { lists } = useLists(`/api/lists?boardID=${list.board}`);

  const [open, handleOpen] = useState(false);

  return open ? (
    <Formik
      initialValues={{ listTitle: list.title }}
      validationSchema={Yup.object().shape({
        listTitle: Yup.string().trim().max(50).required().label("Title"),
      })}
      onSubmit={async (values) => {
        const listsCopy = { ...lists };
        const updatedList = { ...listsCopy[list._id], title: values.listTitle };
        mutate(
          `/api/lists?boardID=${list.board}`,
          { ...listsCopy, [list._id]: updatedList },
          false
        );

        handleOpen(false);

        await axios.patch(
          `/api/lists?boardID=${list.board}&listID=${list._id}`,
          { title: values.listTitle }
        );
        mutate(`/api/lists?boardID=${list.board}`);
      }}
    >
      {({
        values,
        errors,
        touched,
        handleChange,
        handleBlur,
        handleSubmit,
      }) => (
        <Box onBlur={() => handleOpen(false)}>
          <form onSubmit={handleSubmit}>
            <TextField
              id="listTitle"
              name="listTitle"
              label="Title"
              variant="outlined"
              fullWidth
              autoFocus
              size="small"
              onChange={handleChange}
              onBlur={handleBlur}
              value={values.listTitle}
              error={errors.listTitle && touched.listTitle}
              helperText={
                errors.listTitle && touched.listTitle && errors.listTitle
              }
            />
          </form>
        </Box>
      )}
    </Formik>
  ) : (
    <Typography
      sx={{ fontWeight: "fontWeightMedium", color: blueGrey[800] }}
      onClick={() => handleOpen(!open)}
    >
      {list.title}
    </Typography>
  );
};

export default ListTitle;
