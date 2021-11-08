import { useState } from "react";
import { signIn, useSession } from "next-auth/client";
import { useRouter } from "next/router";
import { styled } from "@mui/material/styles";
import Typography from "@mui/material/Typography";
import Button from "@mui/material/Button";
import { indigo } from "@mui/material/colors";
import NavDrawer from "./navBarDrawer";
import TaskAltIcon from "@mui/icons-material/TaskAlt";
import ArrowForwardIcon from "@mui/icons-material/ArrowForward";
import CircularProgress from "@mui/material/CircularProgress";

const Nav = styled("nav")(({ theme }) => ({
  display: "flex",
  alignItems: "center",
  justifyContent: "space-around",
  borderBottom: `1px solid ${indigo[50]}`,
  minHeight: theme.spacing(8),
  [theme.breakpoints.down("sm")]: {
    padding: theme.spacing(0, 2),
    justifyContent: "space-between",
  },
}));

const AlignItems = styled("div")({
  display: "flex",
  alignItems: "center",
});

const TextLogo = styled(Typography)(({ theme }) => ({
  color: indigo[500],
  fontSize: 24,
  fontWeight: "medium",
  [theme.breakpoints.down("sm")]: {
    display: "none",
  },
}));

const NavList = styled("ul")(({ theme }) => ({
  listStyle: "none",
  display: "flex",
  [theme.breakpoints.down("sm")]: {
    display: "none",
  },
}));

const NavListItem = styled("li")(({ theme }) => ({
  marginRight: theme.spacing(4),
}));

const NavBar = () => {
  const router = useRouter();
  const [session, loading] = useSession();
  const [open, setOpen] = useState(false);

  const handleDrawerOpen = () => {
    setOpen(true);
  };

  const handleDrawerClose = () => {
    setOpen(false);
  };

  return (
    <header>
      <Nav>
        <AlignItems>
          <AlignItems>
            <TaskAltIcon color="primary" sx={{ fontSize: 40, mr: 1 }} />
            <TextLogo>Tasks</TextLogo>
          </AlignItems>

          <NavList>
            <NavListItem>Features</NavListItem>
            <NavListItem>Pricing</NavListItem>
            <NavListItem>Blog</NavListItem>
          </NavList>
        </AlignItems>
        <AlignItems>
          {loading ? (
            <CircularProgress size={25} />
          ) : !session ? (
            <Button
              sx={{ textTransform: "none" }}
              variant="outlined"
              onClick={() =>
                signIn(null, {
                  callbackUrl: `/boards`,
                })
              }
              endIcon={<ArrowForwardIcon />}
            >
              Get Started
            </Button>
          ) : (
            <Button
              sx={{ textTransform: "none" }}
              variant="outlined"
              onClick={() => {
                router.push("/boards");
              }}
            >
              Open Boards
            </Button>
          )}

          <NavDrawer
            open={open}
            handleDrawerOpen={handleDrawerOpen}
            handleDrawerClose={handleDrawerClose}
          />
        </AlignItems>
      </Nav>
    </header>
  );
};

export default NavBar;
