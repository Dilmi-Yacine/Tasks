import { useState } from "react";
import { useSession, signIn } from "next-auth/client";
import Head from "next/head";
import useUser from "../../lib/useUser";
import useBoards from "../../lib/useBoards";
import LinearProgress from "@mui/material/LinearProgress";
import AddBoard from "../../components/app/addBoard";
import DisplayBoards from "../../components/app/displayBoards";
import AppNav from "../../components/app/appNav";
import LoadingPage from "../../components/app/loadingPage";
import axios from "axios";

const Boards = () => {
  const [session, loading] = useSession();
  const { user, loadingUser } = useUser(`/api/user`);
  const { boards, boardsLoading } = useBoards("/api/boards");

  const [loadingBoard, setloadingBoard] = useState(false);

  if (loading || loadingUser || boardsLoading) return <LoadingPage />;

  if (!session) signIn(null, { callbackUrl: `/boards` });

  if (!loadingUser) {
    if (user.name === null) {
      axios.patch(`/api/user`, {
        name: user.email.split("@")[0],
      });
    }
  }

  if (typeof window !== "undefined" && loading) return null;

  return (
    session &&
    !loadingUser && (
      <div>
        <Head>
          <title>Boards</title>
          <meta
            name="viewport"
            content="initial-scale=1.0, width=device-width"
          />
        </Head>
        {loadingBoard && <LinearProgress />}
        <AppNav />
        <AddBoard />
        <DisplayBoards boards={boards} setloadingBoard={setloadingBoard} />
      </div>
    )
  );
};

export default Boards;
