import { useState } from "react";
import { useSession, signIn } from "next-auth/client";
import { useSWRConfig } from "swr";
import Head from "next/head";
import useUser from "../lib/useUser";
import { Formik } from "formik";
import * as Yup from "yup";
import { styled } from "@mui/material/styles";
import Box from "@mui/system/Box";
import Stack from "@mui/material/Stack";
import TextField from "@mui/material/TextField";
import Typography from "@mui/material/Typography";
import IconButton from "@mui/material/IconButton";
import EditIcon from "@mui/icons-material/Edit";
import ClearIcon from "@mui/icons-material/Clear";
import { blueGrey } from "@mui/material/colors";
import LoadingPage from "../components/app/loadingPage";
import AppNav from "../components/app/appNav";
import UserAvatar from "../components/app/userAvatar";
import axios from "axios";

export const Description = styled("dl")({
  width: "500px",
  display: "grid",
  gridTemplateColumns: "150px 350px",
});

const ProfileSetup = () => {
  const { mutate } = useSWRConfig();
  const [session, loading] = useSession();
  const { user, loadingUser } = useUser(`/api/user`);

  const [open, handleOpen] = useState(false);

  if (loading || loadingUser) return <LoadingPage />;

  if (!session) signIn(null, { callbackUrl: `/boards` });

  if (typeof window !== "undefined" && loading) return null;

  return (
    session &&
    !loadingUser && (
      <Box>
        <Head>
          <title>Profile</title>
          <meta
            name="viewport"
            content="initial-scale=1.0, width=device-width"
          />
        </Head>
        <AppNav />
        <Box sx={{ width: "600px", m: "auto" }}>
          <Typography variant="h5" sx={{ color: blueGrey[900] }}>
            Profile
          </Typography>
          <Stack direction="row" gap={2} alignItems="center">
            <UserAvatar user={user} size="large" />
            <Description>
              <dt>
                <Typography
                  sx={{ color: blueGrey[900], fontWeight: "fontWeightMedium" }}
                >
                  Username
                </Typography>
              </dt>
              <dd>
                {open ? (
                  <Formik
                    initialValues={{ username: user.name }}
                    validationSchema={Yup.object().shape({
                      username: Yup.string()
                        .trim()
                        .required()
                        .min(5)
                        .max(50)
                        .label("Username"),
                    })}
                    onSubmit={async (values) => {
                      const updatedUser = { ...user, name: values.username };
                      mutate(`/api/user`, updatedUser, false);
                      await axios.patch(`/api/user`, {
                        name: values.username,
                      });
                      mutate(`/api/user`);
                      handleOpen(false);
                    }}
                  >
                    {({
                      errors,
                      touched,
                      values,
                      handleChange,
                      handleBlur,
                      handleSubmit,
                    }) => (
                      <form onSubmit={handleSubmit}>
                        <Stack direction="row" justifyContent="space-between">
                          <TextField
                            id="username"
                            name="username"
                            variant="standard"
                            size="small"
                            fullWidth
                            onChange={handleChange}
                            onBlur={handleBlur}
                            value={values.username}
                            error={errors.username && touched.username}
                            helperText={
                              errors.username &&
                              touched.username &&
                              errors.username
                            }
                          />
                          <IconButton
                            size="small"
                            onClick={() => handleOpen(!open)}
                          >
                            <ClearIcon color="primary" />
                          </IconButton>
                        </Stack>
                      </form>
                    )}
                  </Formik>
                ) : (
                  <Stack
                    direction="row"
                    justifyContent="space-between"
                    alignItems="center"
                  >
                    <Typography sx={{ color: blueGrey[900] }}>
                      {user.name}
                    </Typography>
                    <IconButton size="small" onClick={() => handleOpen(!open)}>
                      <EditIcon color="primary" />
                    </IconButton>
                  </Stack>
                )}
              </dd>
              <dt>
                <Typography
                  sx={{ color: blueGrey[900], fontWeight: "fontWeightMedium" }}
                >
                  email
                </Typography>
              </dt>
              <dd>
                <Typography sx={{ color: blueGrey[900] }}>
                  {user.email}
                </Typography>
              </dd>
            </Description>
          </Stack>
        </Box>
      </Box>
    )
  );
};

export default ProfileSetup;
