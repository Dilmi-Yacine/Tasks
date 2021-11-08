import { styled } from "@mui/material/styles";
import Typography from "@mui/material/Typography";
import Stack from "@mui/material/Stack";
import Image from "next/image";
import { indigo, blueGrey } from "@mui/material/colors";
import Box from "@mui/system/Box";
import CheckCircleOutlineIcon from "@mui/icons-material/CheckCircleOutline";

const Section = styled("section")({
  background: `rgb(232,234,246)`,
  background: `linear-gradient(180deg, rgba(245,245,245,1) 0%, rgba(250,250,250,1) 100%)`,
  padding: "48px 0 64px 0",
});

const Hero = () => {
  return (
    <Section>
      <Stack
        spacing={6}
        direction="column"
        justifyContent="center"
        alignItems="center"
      >
        <header>
          <Stack
            direction="column"
            alignItems="center"
            sx={{ alignItems: { xs: "start", sm: "center" } }}
          >
            <Box sx={{ px: 1, width: { xs: "95vw", sm: "60ch", lg: "70ch" } }}>
              <Typography
                component="h1"
                textAlign="center"
                gutterBottom
                sx={{
                  fontSize: {
                    xs: "1.8rem",
                    sm: "2.2rem",
                    md: "2.6rem",
                    lg: "3rem",
                  },
                  color: blueGrey[900],
                }}
              >
                Get your <span style={{ color: indigo[500] }}>Tasks</span> done{" "}
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
                Tasks is a project management tool designed to help visualize
                the state of every piece of work at any time.
              </Typography>
            </Box>
          </Stack>
        </header>
        <Box
          sx={{
            boxShadow: 3,
            width: "90vw",
            maxWidth: "1100px",
          }}
        >
          <Image
            src="/board.png"
            alt="Kanban board"
            width="1389"
            height="915"
            layout="responsive"
            quality={100}
            priority
          />
        </Box>
      </Stack>
    </Section>
  );
};

export default Hero;
