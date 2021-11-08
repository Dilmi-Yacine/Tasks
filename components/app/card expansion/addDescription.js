import { useSWRConfig } from "swr";
import useCards from "../../../lib/useCards";
import { useState } from "react";
import { Formik } from "formik";
import * as Yup from "yup";
import { styled } from "@mui/material/styles";
import { indigo, blueGrey, grey } from "@mui/material/colors";
import Stack from "@mui/material/Stack";
import Box from "@mui/system/Box";
import TextField from "@mui/material/TextField";
import Typography from "@mui/material/Typography";
import Paper from "@mui/material/Paper";
import Button from "@mui/material/Button";
import IconButton from "@mui/material/IconButton";
import ClearIcon from "@mui/icons-material/Clear";
import SubjectIcon from "@mui/icons-material/Subject";
import axios from "axios";

const DescriptionBox = styled(Paper)(({ theme }) => ({
  padding: theme.spacing(1),
  background: blueGrey[50],
  borderRadius: theme.shape.borderRadius,
  cursor: "pointer",
  transition: " 0.3s",
  "&:hover": {
    backgroundColor: blueGrey[100],
  },
}));

const AddDescription = ({ card }) => {
  const { mutate } = useSWRConfig();
  const { cards } = useCards(`/api/cards?boardID=${card.board}`);

  const [open, handleOpen] = useState(false);
  return (
    <Box>
      <Stack direction="row" alignItems="center" gap={1}>
        <SubjectIcon sx={{ color: indigo[300] }} />
        <Typography variant="h6" sx={{ color: grey[800] }}>
          Description
        </Typography>
        {card.description && (
          <Button
            size="small"
            sx={{ textTransform: "none" }}
            onClick={() => handleOpen(true)}
          >
            edit
          </Button>
        )}
      </Stack>
      {open ? (
        <Formik
          initialValues={{ description: card.description }}
          validationSchema={Yup.object().shape({
            description: Yup.string()
              .trim()
              .min(5)
              .max(400)
              .required()
              .label("Description"),
          })}
          onSubmit={async (values) => {
            const updatedCard = { ...card, description: values.description };
            mutate(
              `/api/cards?boardID=${card.board}`,
              { ...cards, [card._id]: updatedCard },
              false
            );
            await axios.patch(`/api/cards?boardID=${card.board}`, {
              cardID: card._id,
              description: values.description,
            });
            mutate(`/api/cards?boardID=${card.board}`);
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
                id="description"
                name="description"
                variant="outlined"
                multiline
                rows={2}
                autoFocus
                fullWidth
                onChange={handleChange}
                onBlur={handleBlur}
                value={values.description}
                error={errors.description && touched.description}
                helperText={
                  errors.description &&
                  touched.description &&
                  errors.description
                }
              />
              <Stack direction="row" alignItems="center">
                <Button
                  disabled={!isValid}
                  size="small"
                  variant="contained"
                  color="primary"
                  type="submit"
                  onClick={handleSubmit}
                >
                  save
                </Button>
                <IconButton
                  edge="end"
                  size="small"
                  color="primary"
                  onClick={() => handleOpen(false)}
                >
                  <ClearIcon />
                </IconButton>
              </Stack>
            </form>
          )}
        </Formik>
      ) : card.description ? (
        <Typography sx={{ color: blueGrey[900] }}>
          {card.description}
        </Typography>
      ) : (
        <DescriptionBox elevation={0} onClick={() => handleOpen(!open)}>
          <Typography sx={{ color: grey[800] }}>
            Add detailed description...
          </Typography>
        </DescriptionBox>
      )}
    </Box>
  );
};

export default AddDescription;
