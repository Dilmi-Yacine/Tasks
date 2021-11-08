import { styled } from "@mui/material/styles";
import { blueGrey } from "@mui/material/colors";
import IconButton from "@mui/material/IconButton";

export const AddBox = styled(IconButton)(({ theme }) => ({
  width: theme.spacing(16),
  border: `1px solid ${blueGrey[50]}`,
  borderRadius: theme.shape.borderRadius,
  background: blueGrey[50],
  display: "flex",
  justifyContent: "start",
  alignItems: "center",
  gap: 4,
}));
