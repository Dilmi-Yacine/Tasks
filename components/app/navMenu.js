import { useState } from "react";
import { signOut } from "next-auth/client";
import { useRouter } from "next/router";
import useUser from "../../lib/useUser";
import Box from "@mui/material/Box";
import Menu from "@mui/material/Menu";
import MenuItem from "@mui/material/MenuItem";
import ListItemText from "@mui/material/ListItemText";
import ListItemIcon from "@mui/material/ListItemIcon";
import IconButton from "@mui/material/IconButton";
import Logout from "@mui/icons-material/Logout";
import AccountCircleOutlinedIcon from "@mui/icons-material/AccountCircleOutlined";
import UserAvatar from "./userAvatar";

const NavMenu = () => {
  const router = useRouter();
  const { user } = useUser("/api/user");

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
      <IconButton onClick={handleClick} size="small" sx={{ ml: 2 }}>
        <UserAvatar size="medium" user={user} />
      </IconButton>
      <Menu
        anchorEl={anchorEl}
        open={open}
        onClose={handleClose}
        onClick={handleClose}
      >
        <MenuItem onClick={() => router.push("/profile")}>
          <ListItemIcon>
            <AccountCircleOutlinedIcon fontSize="small" color="primary" />
          </ListItemIcon>
          <ListItemText>Profile</ListItemText>
        </MenuItem>
        <MenuItem onClick={() => signOut()}>
          <ListItemIcon>
            <Logout fontSize="small" color="primary" />
          </ListItemIcon>
          <ListItemText> Logout</ListItemText>
        </MenuItem>
      </Menu>
    </Box>
  );
};

export default NavMenu;
