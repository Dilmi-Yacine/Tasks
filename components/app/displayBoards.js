import { useState, useEffect } from "react";
import useUser from "../../lib/useUser";
import Link from "next/link";
import Image from "next/image";
import { styled } from "@mui/material/styles";
import Box from "@mui/material/Box";
import Stack from "@mui/material/Stack";
import Typography from "@mui/material/Typography";
import IconButton from "@mui/material/IconButton";
import { blueGrey } from "@mui/material/colors";

const Board = styled(IconButton)({
  width: "200px",
  height: "80px",
  overflow: "hidden",
  textOverflow: "ellipsis",
  overflowWrap: "break-word",
  border: `1px solid ${blueGrey[50]}`,
  borderRadius: "8px",
  background: blueGrey[50],
  padding: "8px",
  marginRight: "16px",
});

const DisplayBoards = ({ boards, setloadingBoard }) => {
  const { user } = useUser(`/api/user`);

  const [yourBoards, setYourBoards] = useState([]);
  const [sharedWith, setSharedWith] = useState([]);

  useEffect(() => {
    if (boards.length) {
      const noneSharedBoards = boards.filter(
        (board) => !board.sharedWith.length
      );
      const sharedBoards = boards.filter((board) => board.sharedWith.length);

      const boardsYouShare = sharedBoards.filter(
        (sharedBoard) => !sharedBoard.sharedWith.includes(user.email)
      );

      const yourBoards = noneSharedBoards.concat(boardsYouShare);
      setYourBoards(yourBoards);

      const sharedWithYou = sharedBoards.filter((sharedBoard) =>
        sharedBoard.sharedWith.includes(user.email)
      );
      setSharedWith(sharedWithYou);
    }
  }, [boards, user.email]);

  return boards.length ? (
    <Stack direction="column" gap={3} sx={{ px: 3 }}>
      {yourBoards.length > 0 && (
        <Box>
          <Typography
            sx={{
              color: blueGrey[800],
              fontSize: 18,
              fontWeight: "fontWeightMedium",
              mb: 2,
            }}
          >
            Yours
          </Typography>
          <Stack
            direction="row"
            alignItems="center"
            gap={1}
            sx={{ flexFlow: "row wrap" }}
          >
            {yourBoards.map((board) => {
              return (
                <Link key={board._id} href={"/boards/" + board._id}>
                  <Board
                    onClick={() => {
                      setloadingBoard(true);
                    }}
                  >
                    <Typography
                      sx={{
                        color: blueGrey[800],
                        fontWeight: "fontWeightMedium",
                        fontSize: 16,
                      }}
                    >
                      {board.title}
                    </Typography>
                  </Board>
                </Link>
              );
            })}
          </Stack>
        </Box>
      )}

      {sharedWith.length > 0 && (
        <Box>
          <Typography
            sx={{
              color: blueGrey[800],
              fontSize: 18,
              fontWeight: "fontWeightMedium",
              mb: 2,
            }}
          >
            Shared with you
          </Typography>
          <Stack
            direction="row"
            alignItems="center"
            gap={1}
            sx={{ flexFlow: "row wrap" }}
          >
            {sharedWith.map((board) => {
              return (
                <Link key={board._id} href={"/boards/" + board._id}>
                  <Board
                    onClick={() => {
                      setloadingBoard(true);
                    }}
                  >
                    <Typography
                      sx={{
                        color: blueGrey[800],
                        fontWeight: "fontWeightMedium",
                        fontSize: 16,
                      }}
                    >
                      {board.title}
                    </Typography>
                  </Board>
                </Link>
              );
            })}
          </Stack>
        </Box>
      )}
    </Stack>
  ) : (
    <Stack justifyContent="center" alignItems="center">
      <Box>
        <Image src="/scrum.svg" alt="Kanban board" width="500" height="500" />
      </Box>
    </Stack>
  );
};

export default DisplayBoards;
