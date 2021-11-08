import Box from "@mui/material/Box";
import Stack from "@mui/material/Stack";
import Card from "@mui/material/Card";
import CardActions from "@mui/material/CardActions";
import CardContent from "@mui/material/CardContent";
import Button from "@mui/material/Button";
import Typography from "@mui/material/Typography";
import { blueGrey, indigo } from "@mui/material/colors";
import Divider from "@mui/material/Divider";
import List from "@mui/material/List";
import ListItem from "@mui/material/ListItem";
import ListItemIcon from "@mui/material/ListItemIcon";
import ListItemText from "@mui/material/ListItemText";
import TimelineIcon from "@mui/icons-material/Timeline";
import TableViewIcon from "@mui/icons-material/TableView";
import EventIcon from "@mui/icons-material/Event";

const Price = () => {
  return (
    <section>
      <Stack justifyContent="center" alignItems="center" sx={{ my: "64px" }}>
        <header>
          <Box
            sx={{
              px: 2,
              mb: 4,
              width: { xs: "95vw", sm: "70ch", md: "75ch", lg: "80ch" },
            }}
          >
            <Typography
              component="h2"
              align="center"
              gutterBottom
              sx={{
                fontSize: { xs: "1.6rem", sm: "1.9rem", md: "2rem" },
                color: blueGrey[800],
              }}
            >
              Bring powerful new views to your team’s work{" "}
            </Typography>
            <Typography
              variant="subtitle1"
              sx={{
                fontSize: {
                  xs: "1.1rem",
                  sm: "1.2rem",
                  lg: "1.3rem",
                },
                textAlign: { xs: "left", sm: "center" },
              }}
            >
              Give a fresh perspective to the task at hand with Timeline, Table
              and Calendar. these additional views require a Premium membership.
            </Typography>
          </Box>
        </header>
        <Card sx={{ mx: 2, maxWidth: "800px" }}>
          <Stack direction={{ xs: "column", md: "row" }}>
            <CardContent>
              <Typography
                sx={{ fontSize: 14 }}
                color="text.secondary"
                gutterBottom
              >
                Premium membership
              </Typography>
              <Typography variant="h5" component="div">
                5$ / month
              </Typography>
              <Typography sx={{ mb: 1.5 }} color="text.secondary">
                (Comming soon)
              </Typography>
              <Divider textAlign="center">
                <Typography variant="body2">WHAT'S INCLUDED</Typography>{" "}
              </Divider>
              <List>
                <ListItem>
                  <ListItemIcon>
                    <TimelineIcon sx={{ color: `${indigo[400]}` }} />
                  </ListItemIcon>
                  <ListItemText
                    primary="Timeline"
                    secondary="Stay on track of every goal and see how all of the moving parts piece together over time.drag and drop dates to make adjustments on the fly. "
                  />
                </ListItem>
                <ListItem>
                  <ListItemIcon sx={{ color: `${indigo[400]}` }}>
                    <EventIcon />
                  </ListItemIcon>
                  <ListItemText
                    primary="Calendar"
                    secondary="Start each day without any surprises, Calender gives you  a clear vision of what work lies ahead"
                  />
                </ListItem>
                <ListItem>
                  <ListItemIcon>
                    <TableViewIcon sx={{ color: `${indigo[400]}` }} />
                  </ListItemIcon>
                  <ListItemText
                    primary="Table"
                    secondary=" Add, sort, and filter cards from team boards within Table to see exactly what you need to see"
                  />
                </ListItem>
              </List>
            </CardContent>
            <CardActions
              sx={{
                alignSelf: { xs: "center", md: "start" },
              }}
            >
              <Stack direction={{ xs: "row", md: "column" }} gap={1}>
                <Button disabled variant="contained">
                  Demo
                </Button>
                <Button disabled variant="outlined">
                  Upgrade
                </Button>
              </Stack>
            </CardActions>
          </Stack>
        </Card>
      </Stack>
    </section>
  );
};

export default Price;
