import { useState, useEffect } from "react";
import { styled } from "@mui/material/styles";
import Box from "@mui/system/Box";
import Typography from "@mui/material/Typography";
import Paper from "@mui/material/Paper";
import {
  blue,
  green,
  pink,
  purple,
  cyan,
  teal,
  blueGrey,
  red,
  orange,
  yellow,
  indigo,
} from "@mui/material/colors";

const Color = styled(Paper)(({ theme }) => ({
  width: theme.spacing(5),
  height: theme.spacing(4),
  margin: theme.spacing(0, 1, 1, 0),
  cursor: "pointer",
}));

const SelectColor = ({
  title,
  labels,
  card,
  selectedColor,
  setColor,
  setColorError,
}) => {
  const [availableColors, setAvailableColors] = useState([]);

  useEffect(() => {
    var colors = [
      green[500],
      yellow[700],
      orange[500],
      red[400],
      purple[300],
      blue[500],
      cyan[500],
      teal[500],
      pink[300],
      blueGrey[500],
    ];
    const labelIDs = Object.keys(labels);
    const removedColors = labelIDs.map((id) => labels[id].color);
    for (var i = 0; i < removedColors.length; i++) {
      colors.splice(colors.indexOf(removedColors[i]), 1);
    }
    setAvailableColors(colors);
  }, [labels, card.labels]);

  useEffect(() => {
    if (!selectedColor.length) setColorError("please Select a color");
    else {
      setColorError("");
    }
  }, [selectedColor]);

  return (
    <Box sx={{ my: 1 }}>
      <Typography
        sx={{ mb: 1, color: blueGrey[700], fontWeight: "fontWeightMedium" }}
      >
        {title}
      </Typography>
      <Box
        display="grid"
        justifyContent="center"
        gridTemplateColumns="repeat(5, 1fr)"
      >
        {availableColors.map((color) => (
          <Box key={color}>
            <Color
              onClick={() => setColor(color)}
              sx={{
                bgcolor: color,
                border:
                  selectedColor === color ? `2px solid ${indigo[500]}` : "",
              }}
            />
          </Box>
        ))}
      </Box>
    </Box>
  );
};

export default SelectColor;
