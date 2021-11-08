import { signIn, csrfToken, getSession } from "next-auth/client";
import Head from "next/head";
import { useFormik } from "formik";
import * as Yup from "yup";
import { styled } from "@mui/material/styles";
import Card from "@mui/material/Card";
import CardContent from "@mui/material/CardContent";
import TextField from "@mui/material/TextField";
import Button from "@mui/material/Button";
import TableChartIcon from "@mui/icons-material/TableChart";
import Stack from "@mui/material/Stack";
import Typography from "@mui/material/Typography";
import { indigo } from "@mui/material/colors";
import GoogleIcon from "@mui/icons-material/Google";
import Divider from "@mui/material/Divider";

const LoginPage = styled("div")({
  height: "100vh",
  backgroundColor: "#fafafa",
  display: "flex",
  justifyContent: "center",
  alignItems: "center",
});

const GoogleButton = styled(Button)({
  textTransform: "none",
  backgroundColor: "#EA4335",
  ":hover": {
    backgroundColor: "#bb362a",
  },
});

export default function Auth({ csrfToken }) {
  const formik = useFormik({
    initialValues: {
      email: "",
    },
    validationSchema: Yup.object({
      email: Yup.string().email("Invalid email address").required("Required"),
    }),
  });

  return (
    <LoginPage>
      <Head>
        <title>Log in to Tasks</title>
        <meta name="viewport" content="initial-scale=1.0, width=device-width" />
        <link rel="shortcut icon" href="/public/favicon.ico" />
      </Head>
      <Card sx={{ maxWidth: "350px", width: "90%" }}>
        <CardContent>
          <Stack direction="column" alignItems="center" gap={2}>
            <Stack
              direction="row"
              justifyContent="center"
              alignItems="center"
              gap={1}
            >
              <TableChartIcon color="primary" sx={{ fontSize: 40 }} />
              <Typography variant="h4" sx={{ color: indigo[500] }}>
                Tasks
              </Typography>
            </Stack>
            <form method="post" action="/api/auth/signin/email">
              <input name="csrfToken" type="hidden" defaultValue={csrfToken} />
              <TextField
                id="email"
                label="email"
                {...formik.getFieldProps("email")}
                error={
                  formik.touched.email && formik.errors.email ? true : false
                }
                helperText={
                  formik.touched.email && formik.errors.email
                    ? formik.errors.email
                    : ""
                }
                placeholder="johndoe@example.com"
                variant="outlined"
                fullWidth
                sx={{ mb: 2 }}
              />
              <Button
                type="submit"
                variant="outlined"
                size="large"
                sx={{ textTransform: "none" }}
                fullWidth
              >
                Sign In with Email
              </Button>
            </form>
            <Divider textAlign="center" flexItem>
              <Typography variant="body2">OR</Typography>
            </Divider>
            <GoogleButton
              onClick={() => signIn("google")}
              variant="contained"
              size="large"
              fullWidth
              startIcon={<GoogleIcon />}
            >
              Contenu with Google
            </GoogleButton>
          </Stack>
        </CardContent>
      </Card>
    </LoginPage>
  );
}

export async function getServerSideProps(context) {
  const { req } = context;
  const session = await getSession({ req });

  if (session) {
    return {
      redirect: { destination: "/boards" },
    };
  }

  return {
    props: {
      csrfToken: await csrfToken(context),
    },
  };
}
