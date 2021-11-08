import { styled } from "@mui/material/styles";
import { blueGrey, grey, indigo } from "@mui/material/colors";
import MenuIcon from "@mui/icons-material/Menu";
import IconButton from "@mui/material/IconButton";
import NavMenu from "./navMenu";

const AuthNav = styled("nav")(({ theme }) => ({
  display: "flex",
  alignItems: "center",
  justifyContent: "space-between",
  backgroundColor: grey[50],
  borderBottom: `1px solid ${indigo[50]}`,
  minHeight: theme.spacing(8),
  padding: theme.spacing(0, 2),
  marginBottom: theme.spacing(4),
}));

const AppNav = () => {
  return (
    <header>
      <AuthNav>
        <IconButton>
          <MenuIcon color="primary" />
        </IconButton>
        <NavMenu />
      </AuthNav>
    </header>
  );
};

export default AppNav;
