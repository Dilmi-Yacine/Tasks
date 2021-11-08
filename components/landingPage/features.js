import Stack from "@mui/material/Stack";
import Typography from "@mui/material/Typography";
import { grey, blueGrey, indigo } from "@mui/material/colors";
import Box from "@mui/system/Box";
import LabelOutlinedIcon from "@mui/icons-material/LabelOutlined";
import PeopleAltOutlinedIcon from "@mui/icons-material/PeopleAltOutlined";
import ScheduleIcon from "@mui/icons-material/Schedule";
import CheckCircleOutlineOutlinedIcon from "@mui/icons-material/CheckCircleOutlineOutlined";
import ChatOutlinedIcon from "@mui/icons-material/ChatOutlined";
import Image from "next/image";

const Features = () => {
  return (
    <section>
      <Stack
        direction="column"
        justifyContent="center"
        alignItems="center"
        gap={6}
      >
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
              See the big picture with boards
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
              Invite your teammates to join in, drag tasks between sections and
              expand them with labels, checklists, due date, and a lot more.
            </Typography>
          </Box>
        </header>
        <article>
          <Stack
            direction={{ xs: "column-reverse", md: "row" }}
            gap={4}
            sx={{ px: 2 }}
          >
            <Box>
              <Image
                src="/lists.png"
                alt="lists"
                width="579"
                height="283"
                quality={100}
              />
            </Box>
            <Box
              sx={{
                width: { xs: "90vw", sm: "55ch" },
              }}
            >
              <Typography variant="h4" component="h3">
                Lists
              </Typography>
              <Typography
                variant="subtitle1"
                sx={{
                  fontSize: {
                    xs: "1.1rem",
                    sm: "1.2rem",
                    lg: "1.3rem",
                  },
                  textAlign: "left",
                }}
              >
                Organize your projects with an easy-to-understand layout that
                can be as simple, or as in-depth, as you need.
              </Typography>
            </Box>
          </Stack>
        </article>
        <article>
          <Stack direction={{ xs: "column", md: "row" }} gap={4} sx={{ px: 2 }}>
            <Box
              sx={{
                width: { xs: "90vw", sm: "55ch" },
              }}
            >
              <Stack direction="column" gap={4}>
                <Box>
                  <Typography variant="h4" component="h3">
                    Cards
                  </Typography>
                  <Typography
                    variant="subtitle1"
                    sx={{
                      fontSize: {
                        xs: "1.1rem",
                        sm: "1.2rem",
                        lg: "1.3rem",
                      },
                      textAlign: "left",
                    }}
                  >
                    Uncover an ecosystem of checklists, due dates,
                    conversations, and more. every single part of your task can
                    be managed, tracked, and assigned to a teammate.
                  </Typography>
                </Box>

                <Box>
                  <Stack direction="row" alignItems="center" gap={1}>
                    <LabelOutlinedIcon sx={{ color: `${indigo[400]}` }} />
                    <Typography variant="h6" component="h4">
                      Labels
                    </Typography>
                  </Stack>

                  <Typography
                    variant="subtitle1"
                    sx={{
                      fontSize: {
                        xs: "1.1rem",
                        sm: "1.2rem",
                        lg: "1.3rem",
                      },
                      textAlign: "left",
                    }}
                  >
                    Group tasks together in ways that make sense for your
                    workflow.
                  </Typography>
                </Box>
                <Box>
                  <Stack direction="row" alignItems="center" gap={1}>
                    <PeopleAltOutlinedIcon sx={{ color: `${indigo[400]}` }} />
                    <Typography variant="h6" component="h4">
                      Members
                    </Typography>
                  </Stack>
                  <Typography
                    variant="subtitle1"
                    sx={{
                      fontSize: {
                        xs: "1.1rem",
                        sm: "1.2rem",
                        lg: "1.3rem",
                      },
                      textAlign: "left",
                    }}
                  >
                    Keep everyone accountable and see who is doing what.
                  </Typography>
                </Box>
                <Box>
                  <Stack direction="row" alignItems="center" gap={1}>
                    <ScheduleIcon sx={{ color: `${indigo[400]}` }} />
                    <Typography variant="h6" component="h4">
                      Due Date
                    </Typography>
                  </Stack>

                  <Typography
                    variant="subtitle1"
                    sx={{
                      fontSize: {
                        xs: "1.1rem",
                        sm: "1.2rem",
                        lg: "1.3rem",
                      },
                      textAlign: "left",
                    }}
                  >
                    Make sure you never miss a deadline.
                  </Typography>
                </Box>
                <Box>
                  <Stack direction="row" alignItems="center" gap={1}>
                    <CheckCircleOutlineOutlinedIcon
                      sx={{ color: `${indigo[400]}` }}
                    />
                    <Typography variant="h6" component="h4">
                      Checklists
                    </Typography>
                  </Stack>

                  <Typography
                    variant="subtitle1"
                    sx={{
                      fontSize: {
                        xs: "1.1rem",
                        sm: "1.2rem",
                        lg: "1.3rem",
                      },
                      textAlign: "left",
                    }}
                  >
                    Break big tasks into small ones, check things off the list,
                    and watch that status bar go to 100% complete.
                  </Typography>
                </Box>
                <Box>
                  <Stack direction="row" alignItems="center" gap={1}>
                    <ChatOutlinedIcon sx={{ color: `${indigo[400]}` }} />
                    <Typography variant="h6" component="h4">
                      Comments
                    </Typography>
                  </Stack>
                  <Typography
                    variant="subtitle1"
                    sx={{
                      fontSize: {
                        xs: "1.1rem",
                        sm: "1.2rem",
                        lg: "1.3rem",
                      },
                      textAlign: "left",
                    }}
                  >
                    Engage and discuss details with your coworkers.
                  </Typography>
                </Box>
              </Stack>
            </Box>
            <Box
              sx={{
                boxShadow: 1,
                borderRadius: "4px",
                borderTop: `1px solid ${grey[200]}`,
              }}
            >
              <Image
                src="/card.png"
                alt="card"
                width="597"
                height="864"
                quality={100}
              />
            </Box>
          </Stack>
        </article>
      </Stack>
    </section>
  );
};

export default Features;
