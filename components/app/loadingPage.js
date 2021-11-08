import { styled } from "@mui/material/styles";
import CircularProgress from "@mui/material/CircularProgress";

const CenterLoadingIndicator = styled("div")({
  height: "100vh",
  backgroundColor: "#fafafa",
  display: "flex",
  justifyContent: "center",
  alignItems: "center",
});

const LoadingPage = () => {
  return (
    <CenterLoadingIndicator>
      <CircularProgress />
    </CenterLoadingIndicator>
  );
};

export default LoadingPage;
