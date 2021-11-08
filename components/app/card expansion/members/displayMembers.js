import { useState } from "react";
import { useSWRConfig } from "swr";
import useUsers from "../../../../lib/useUsers";
import useCards from "../../../../lib/useCards";
import axios from "axios";
import Box from "@mui/system/Box";
import AvatarGroup from "@mui/material/AvatarGroup";
import Menu from "@mui/material/Menu";
import List from "@mui/material/List";
import ListItem from "@mui/material/ListItem";
import ListItemButton from "@mui/material/ListItemButton";
import ListItemAvatar from "@mui/material/ListItemAvatar";
import ListItemText from "@mui/material/ListItemText";
import UserAvatar from "../../userAvatar";
import { blueGrey } from "@mui/material/colors";

const DisplayMembers = ({ card }) => {
  const { mutate } = useSWRConfig();
  const { users } = useUsers(`/api/boardUsers?boardID=${card.board}`);
  const { cards } = useCards(`/api/cards?boardID=${card.board}`);

  const [anchorEl, setAnchorEl] = useState(null);
  const open = Boolean(anchorEl);

  const handleClick = (event) => {
    setAnchorEl(event.currentTarget);
  };
  const handleClose = () => {
    setAnchorEl(null);
  };

  const removeMember = async (memberID, memberIndex) => {
    const updatedCardMembers = Array.from(cards[card._id].members);
    updatedCardMembers.splice(memberIndex, 1);

    if (updatedCardMembers.length === 0) {
      handleClose();
    }

    const updatedCard = {
      ...cards[card._id],
      members: updatedCardMembers,
    };
    mutate(
      `/api/cards?boardID=${card.board}`,
      { ...cards, [card._id]: updatedCard },
      false
    );

    await axios.patch(`/api/cards?boardID=${card.board}`, {
      cardID: card._id,
      removedMember: memberID,
    });
    mutate(`/api/cards?boardID=${card.board}`);
  };

  return (
    <Box>
      <AvatarGroup max={2} onClick={handleClick} sx={{ cursor: "pointer" }}>
        {cards[card._id].members.map((memberID) => (
          <UserAvatar key={memberID} user={users[memberID]} size="small" />
        ))}
      </AvatarGroup>
      <Menu
        id="disply-members-menu"
        anchorEl={anchorEl}
        open={open}
        onClose={handleClose}
      >
        <List sx={{ width: "256px" }}>
          {cards[card._id].members.map((memberID, memberIndex) => (
            <ListItem key={memberID} disablePadding dense>
              <ListItemButton
                onClick={() => removeMember(memberID, memberIndex)}
              >
                <ListItemAvatar>
                  <UserAvatar user={users[memberID]} size="small" />
                </ListItemAvatar>
                <ListItemText
                  component="div"
                  sx={{
                    color: blueGrey[900],
                    whiteSpace: "nowrap",
                    overflow: "hidden",
                    textOverflow: "ellipsis",
                  }}
                  primary={users[memberID].name}
                />
              </ListItemButton>
            </ListItem>
          ))}
        </List>
      </Menu>
    </Box>
  );
};

export default DisplayMembers;
