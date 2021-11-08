import { useSWRConfig } from "swr";
import axios from "axios";
import { useState } from "react";
import { Formik } from "formik";
import * as Yup from "yup";
import useLabels from "../../../../lib/useLabels";
import Box from "@mui/system/Box";
import Stack from "@mui/material/Stack";
import Menu from "@mui/material/Menu";
import Typography from "@mui/material/Typography";
import TextField from "@mui/material/TextField";
import Button from "@mui/material/Button";
import LabelOutlinedIcon from "@mui/icons-material/LabelOutlined";
import { blueGrey, grey, indigo } from "@mui/material/colors";
import { AddBox } from "../addBox";
import SelectColor from "./selectColor";
import SelectLabel from "./selectLabel";

const AddLabel = ({ card }) => {
  const { labels } = useLabels(`/api/labels?boardID=${card.board}`);
  const { mutate } = useSWRConfig();

  const [selectedColor, setColor] = useState("");
  const [colorError, setColorError] = useState("");

  const [anchorEl, setAnchorEl] = useState(null);
  const open = Boolean(anchorEl);
  const handleClick = (event) => {
    setAnchorEl(event.currentTarget);
  };
  const handleClose = () => {
    setAnchorEl(null);
  };

  return (
    <Box>
      <AddBox onClick={handleClick}>
        <LabelOutlinedIcon sx={{ color: indigo[300] }} fontSize="small" />
        <Typography variant="subtitle2" sx={{ color: grey[700] }}>
          Labels
        </Typography>
      </AddBox>
      <Menu
        id="label-menu"
        anchorEl={anchorEl}
        open={open}
        onClose={handleClose}
      >
        <Box sx={{ width: "256px" }}>
          <Formik
            initialValues={{ label: "" }}
            validationSchema={Yup.object().shape({
              label: Yup.string().trim().max(25).required().label("Label"),
            })}
            onSubmit={async (values, errors) => {
              if (colorError.length) errors.setFieldError("label", colorError);
              else {
                await axios.post(`/api/labels?boardID=${card.board}`, {
                  label: values.label,
                  cardID: card._id,
                  color: selectedColor,
                });
                await mutate(`/api/labels?boardID=${card.board}`);
                await mutate(`/api/cards?boardID=${card.board}`);
                await mutate(`/api/boards/${card.board}`);

                values.label = "";
              }
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
              <form
                onSubmit={handleSubmit}
                style={{ padding: "0px 8px 0px 8px" }}
              >
                <Typography
                  sx={{
                    color: blueGrey[700],
                    fontWeight: "fontWeightMedium",
                    mb: 1,
                  }}
                >
                  Create label
                </Typography>
                <Stack direction="column">
                  <TextField
                    id="label"
                    name="label"
                    placeholder="Name"
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
                    title="Select color"
                    card={card}
                    labels={labels}
                    setColor={setColor}
                    selectedColor={selectedColor}
                    setColorError={setColorError}
                  />
                  <SelectLabel card={card} labels={labels} />
                  <Button
                    disabled={!selectedColor.length ? true : false || !isValid}
                    type="submit"
                    variant="contained"
                    size="small"
                    color="primary"
                    sx={{ alignSelf: "flex-end", mt: 1 }}
                  >
                    Save
                  </Button>
                </Stack>
              </form>
            )}
          </Formik>
        </Box>
      </Menu>
    </Box>
  );
};

export default AddLabel;
