import Avatar from "@mui/material/Avatar";
import Typography from "@mui/material/Typography";
import { indigo } from "@mui/material/colors";

const UserAvatar = ({ user, size, color }) => {
  const dimension = { extraSmall: 24, small: 28, medium: 40, large: 52 };

  return user.image === null ? (
    <Avatar
      sx={{
        bgcolor: color || indigo[400],
        width: dimension[size],
        height: dimension[size],
      }}
    >
      <Typography variant={size === "extraSmall" ? "caption" : "body1"}>
        {user.name.substr(0, 2)}
      </Typography>
    </Avatar>
  ) : (
    <Avatar
      src={`${user.image}`}
      sx={{
        bgcolor: color || indigo[400],
        width: dimension[size],
        height: dimension[size],
      }}
    />
  );
};

export default UserAvatar;
