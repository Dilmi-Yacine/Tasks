import { useSWRConfig } from "swr";
import axios from "axios";
import useCards from "../../../lib/useCards";
import { useState } from "react";
import { Formik } from "formik";
import * as Yup from "yup";
import { indigo, grey, blueGrey } from "@mui/material/colors";
import Stack from "@mui/material/Stack";
import Box from "@mui/system/Box";
import TextField from "@mui/material/TextField";
import Typography from "@mui/material/Typography";
import TitleIcon from "@mui/icons-material/Title";
import CloseIcon from "@mui/icons-material/Close";
import IconButton from "@mui/material/IconButton";

const EditCardTitle = ({ card, handleClose }) => {
  const { mutate } = useSWRConfig();
  const { cards } = useCards(`/api/cards?boardID=${card.board}`);
  const [open, handleOpen] = useState(false);

  return (
    <Box>
      {open ? (
        <Formik
          initialValues={{ cardTitle: card.title }}
          validationSchema={Yup.object().shape({
            cardTitle: Yup.string().trim().required().max(50).label("Title"),
          })}
          onSubmit={async (values) => {
            let updatedCard = { ...card, title: values.cardTitle };
            mutate(
              `/api/cards?boardID=${card.board}`,
              { ...cards, [card._id]: updatedCard },
              false
            );
            await axios.patch(`/api/cards?boardID=${card.board}`, {
              title: values.cardTitle,
              cardID: card._id,
            });
            mutate(`/api/cards?boardID=${card.board}`);
            handleOpen(false);
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
            <Box
              onBlur={() => {
                if (values.cardTitle.length) handleOpen(false);
              }}
              sx={{ flexGrow: "1", pr: 3 }}
            >
              <form onSubmit={handleSubmit}>
                <TextField
                  id="cardTitle"
                  name="cardTitle"
                  variant="standard"
                  autoFocus
                  fullWidth
                  onChange={handleChange}
                  onBlur={handleBlur}
                  value={values.cardTitle}
                  error={errors.cardTitle && touched.cardTitle}
                  helperText={
                    errors.cardTitle && touched.cardTitle && errors.cardTitle
                  }
                />
              </form>
            </Box>
          )}
        </Formik>
      ) : (
        <Stack
          direction="row"
          alignItems="center"
          gap={1}
          onClick={() => handleOpen(!open)}
          sx={{
            overflow: "hidden",
            textOverflow: "ellipsis",
            overflowWrap: "break-word",
            flexGrow: "1",
          }}
        >
          <TitleIcon sx={{ color: indigo[300] }} />
          <Typography variant="h5" sx={{ color: grey[800], flexGrow: "1" }}>
            {card.title}
          </Typography>
        </Stack>
      )}
      <IconButton
        onClick={handleClose}
        sx={{
          position: "absolute",
          top: 0,
          right: 0,
          // width: "28px",
          // height: "28px",
        }}
      >
        <CloseIcon sx={{ color: blueGrey[500] }} />
      </IconButton>
    </Box>
  );
};

export default EditCardTitle;
