import { styled } from "@mui/material/styles";
import Typography from "@mui/material/Typography";
import Stack from "@mui/material/Stack";
import Box from "@mui/system/Box";
import FacebookIcon from "@mui/icons-material/Facebook";
import TwitterIcon from "@mui/icons-material/Twitter";
import YouTubeIcon from "@mui/icons-material/YouTube";
import { grey } from "@mui/material/colors";

const FooterSection = styled("footer")(({ theme }) => ({
  backgroundColor: "#f5f5f5",
  borderTop: `1px solid ${grey[300]}`,
  padding: theme.spacing(6, 2),
  display: "flex",
  flexDirection: "row",
  justifyContent: "center",
  [theme.breakpoints.down("md")]: {
    gap: theme.spacing(4),
    flexDirection: "column",
    alignItems: "center",
    justifyContent: "center",
  },
}));

const Footer = () => {
  return (
    <FooterSection>
      <Box sx={{ width: { xs: "90%", md: "50ch" } }}>
        <Typography variant="subtitle1">
          Organize work and life with Tasks.
        </Typography>
        <Stack direction="row" gap={1}>
          <FacebookIcon />
          <TwitterIcon />
          <YouTubeIcon />
        </Stack>
      </Box>
      <Box sx={{ width: { xs: "90%", md: "55ch" } }}>
        <Stack direction="row" justifyContent="space-between">
          <Box>
            <Typography variant="button" sx={{ mb: 1 }}>
              Views
            </Typography>
            <Stack direction="column" gap={1} sx={{ mt: 1 }}>
              <Typography variant="subtitle1">Calender</Typography>
              <Typography variant="subtitle1">Timeline</Typography>
              <Typography variant="subtitle1">Table</Typography>
            </Stack>
          </Box>
          <Box>
            <Typography variant="button" sx={{ mb: 1 }}>
              Resources
            </Typography>
            <Stack direction="column" gap={1} sx={{ mt: 1 }}>
              <Typography variant="subtitle1"> Download Apps</Typography>
              <Typography variant="subtitle1">Integrations</Typography>
              <Typography variant="subtitle1">Developer API</Typography>
            </Stack>
          </Box>
          <Box>
            <Typography variant="button">Company</Typography>
            <Stack direction="column" gap={1} sx={{ mt: 1 }}>
              <Typography variant="subtitle1"> About Us</Typography>
              <Typography variant="subtitle1">We are hiring!</Typography>
              <Typography variant="subtitle1"> Blog</Typography>
            </Stack>
          </Box>
        </Stack>
      </Box>
    </FooterSection>
  );
};

export default Footer;
