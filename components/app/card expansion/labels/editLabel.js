import { useSWRConfig } from "swr";
import axios from "axios";
import useCards from "../../../../lib/useCards";
import { useEffect, useState } from "react";
import { Formik } from "formik";
import Stack from "@mui/material/Stack";
import * as Yup from "yup";
import Menu from "@mui/material/Menu";
import Typography from "@mui/material/Typography";
import TextField from "@mui/material/TextField";
import Button from "@mui/material/Button";
import SelectColor from "./selectColor";

const EditLabel = ({ card, labels, labelID, open, anchorEl, handleClose }) => {
  const { mutate } = useSWRConfig();
  const { cards } = useCards(`/api/cards?boardID=${card.board}`);

  const [selectedColor, setColor] = useState("");
  const [colorError, setColorError] = useState("");
  const [label, setLabel] = useState("");

  useEffect(() => {
    setLabel(labels[labelID]?.label);
  }, [labelID]);

  const deleteLabel = async (labelID) => {
    const filtredLabels = { ...labels };
    delete filtredLabels[labelID];
    mutate(`/api/labels?boardID=${card.board}`, { ...filtredLabels }, false);

    let cardLabels = Array.from(cards[card._id].labels);
    cardLabels.splice(cardLabels.indexOf(labelID), 1);
    const updatedCardLabels = {
      ...cards[card._id],
      labels: cardLabels,
    };
    mutate(
      `/api/cards?boardID=${card.board}`,
      { ...cards, [card._id]: updatedCardLabels },
      false
    );

    handleClose(false);

    await axios.delete(`/api/labels?labelID=${labelID}`);
    await mutate(`/api/cards?boardID=${card.board}`);
    await mutate(`/api/labels?boardID=${card.board}`);
  };

  return (
    <Menu
      id="editLabel-menu"
      anchorEl={anchorEl}
      open={open}
      onClose={handleClose}
    >
      <Formik
        initialValues={{ label: label }}
        validationSchema={Yup.object().shape({
          label: Yup.string().trim().max(25).required().label("Label"),
        })}
        onSubmit={async (values) => {
          const updatedLabel = {
            ...labels[labelID],
            label: values.label || labels[labelID].label,
            color: selectedColor || labels[labelID].color,
          };

          mutate(
            `/api/labels?boardID=${card.board}`,
            { ...labels, [labelID]: updatedLabel },
            false
          );

          await axios.patch(`/api/labels`, {
            labelID,
            label: values.label || labels[labelID].label,
            color: selectedColor || labels[labelID].color,
          });

          mutate(`/api/labels?boardID=${card.board}`);
          setColor("");
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
          <form onSubmit={handleSubmit} style={{ padding: "0px 8px 0px 8px" }}>
            <Typography variant="subtitle2" sx={{ mb: 1 }}>
              Edit label
            </Typography>
            <Stack direction="column">
              <TextField
                id="label"
                name="label"
                variant="outlined"
                size="small"
                fullWidth
                onChange={handleChange}
                onBlur={handleBlur}
                value={values.label}
                error={errors.label && touched.label}
                helperText={errors.label && touched.label && errors.label}
              />
              <SelectColor
                title="Select new color"
                card={card}
                labels={labels}
                setColor={setColor}
                selectedColor={selectedColor}
                setColorError={setColorError}
              />
              <Stack direction="row" justifyContent="space-between">
                <Button
                  variant="outlined"
                  size="small"
                  color="error"
                  onClick={() => deleteLabel(labelID)}
                >
                  Delete
                </Button>
                <Button
                  disabled={!isValid}
                  variant="outlined"
                  size="small"
                  onClick={handleSubmit}
                >
                  Save
                </Button>
              </Stack>
            </Stack>
          </form>
        )}
      </Formik>
    </Menu>
  );
};

export default EditLabel;
