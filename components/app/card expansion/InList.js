import Typography from "@mui/material/Typography";
import { indigo } from "@mui/material/colors";

const InList = ({ list }) => {
  return (
    <Typography variant="subtitle1">
      in list{" "}
      <span
        style={{
          color: indigo[400],
        }}
      >
        {list.title}
      </span>
    </Typography>
  );
};

export default InList;
