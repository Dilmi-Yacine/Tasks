import { useEffect, useState } from "react";
import { useSWRConfig } from "swr";
import useUsers from "../../../../lib/useUsers";
import useCards from "../../../../lib/useCards";
import axios from "axios";
import Box from "@mui/system/Box";
import Typography from "@mui/material/Typography";
import Menu from "@mui/material/Menu";
import List from "@mui/material/List";
import ListItem from "@mui/material/ListItem";
import ListItemButton from "@mui/material/ListItemButton";
import ListItemAvatar from "@mui/material/ListItemAvatar";
import ListItemText from "@mui/material/ListItemText";
import PersonOutlineIcon from "@mui/icons-material/PersonOutline";
import { blueGrey, grey, indigo } from "@mui/material/colors";
import { AddBox } from "../addBox";
import UserAvatar from "../../userAvatar";

const AddMember = ({ card }) => {
  const { mutate } = useSWRConfig();
  const { users } = useUsers(`/api/boardUsers?boardID=${card.board}`);
  const { cards } = useCards(`/api/cards?boardID=${card.board}`);

  const [availableUsers, setAvailableUsers] = useState([]);
  const [anchorEl, setAnchorEl] = useState(null);
  const open = Boolean(anchorEl);

  useEffect(() => {
    if (Object.keys(users).length) {
      const availableUsers = Object.keys(users).filter(
        (user) => !cards[card._id].members.includes(users[user]._id)
      );
      setAvailableUsers(availableUsers);
    }
  }, [cards[card._id].members, users]);

  const handleClick = (event) => {
    setAnchorEl(event.currentTarget);
  };
  const handleClose = () => {
    setAnchorEl(null);
  };

  const asignMember = async (memberID, memberIndex) => {
    const updatedAvailableUsers = Array.from(availableUsers);
    updatedAvailableUsers.splice(memberIndex, 1);
    setAvailableUsers(updatedAvailableUsers);

    let cardMembers = Array.from(cards[card._id].members);
    cardMembers.push(memberID);
    const updatedCardMembers = {
      ...cards[card._id],
      members: cardMembers,
    };
    mutate(
      `/api/cards?boardID=${card.board}`,
      { ...cards, [card._id]: updatedCardMembers },
      false
    );

    await axios.patch(`/api/cards?boardID=${card.board}`, {
      cardID: card._id,
      member: memberID,
    });
    mutate(`/api/cards?boardID=${card.board}`);
  };

  return (
    <Box>
      <AddBox onClick={handleClick}>
        <PersonOutlineIcon sx={{ color: indigo[300] }} fontSize="small" />
        <Typography variant="subtitle2" sx={{ color: grey[700] }}>
          Members
        </Typography>
      </AddBox>
      <Menu
        id="asign-members-menu"
        anchorEl={anchorEl}
        open={open}
        onClose={handleClose}
      >
        <Box sx={{ width: "256px" }}>
          {Object.keys(users).length ? (
            availableUsers.length ? (
              <Box>
                <Typography
                  sx={{
                    ml: 1,
                    color: blueGrey[700],
                    fontWeight: "fontWeightMedium",
                  }}
                >
                  Board members
                </Typography>
                <List>
                  {availableUsers.map((userID, userIndex) => (
                    <ListItem key={userID} disablePadding dense>
                      <ListItemButton
                        onClick={() => asignMember(userID, userIndex)}
                      >
                        <ListItemAvatar>
                          <UserAvatar user={users[userID]} size="small" />
                        </ListItemAvatar>
                        <ListItemText
                          sx={{
                            whiteSpace: "nowrap",
                            overflow: "hidden",
                            textOverflow: "ellipsis",
                          }}
                          primary={users[userID].name}
                        />
                      </ListItemButton>
                    </ListItem>
                  ))}
                </List>
              </Box>
            ) : (
              <Typography sx={{ color: blueGrey[900], p: 1 }}>
                All users have been assigned to this card.
              </Typography>
            )
          ) : (
            <Typography sx={{ color: blueGrey[900], p: 1 }}>
              You didn't share this board yet.
            </Typography>
          )}
        </Box>{" "}
      </Menu>
    </Box>
  );
};

export default AddMember;
