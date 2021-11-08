import { Droppable, Draggable } from "react-beautiful-dnd";
import { styled } from "@mui/material/styles";
import Box from "@mui/system/Box";
import { blueGrey } from "@mui/material/colors";
import ListTitle from "../app/listTitle";
import Card from "./card";
import AddCard from "../app/addCard";

const ListContainer = styled("div")(({ theme }) => ({
  width: theme.spacing(35),
  marginRight: theme.spacing(2),
  display: "flex",
  flexDirection: "column",
  border: "1px solid #ebecf0",
  borderRadius: theme.shape.borderRadius,
  background: blueGrey[50],
  padding: theme.spacing(1),
}));

const List = ({ list, cards, index }) => {
  return (
    <Draggable draggableId={list._id} index={index}>
      {(provided) => (
        <Box {...provided.draggableProps} ref={provided.innerRef}>
          <ListContainer>
            <Box
              sx={{ overflowWrap: "break-word" }}
              {...provided.dragHandleProps}
            >
              <ListTitle list={list} />
            </Box>
            <Droppable droppableId={list._id} type="card">
              {(provided) => (
                <Box
                  {...provided.droppableProps}
                  ref={provided.innerRef}
                  sx={{ flexGrow: 1, pt: 1 }}
                >
                  {Object.keys(cards).length > 0 &&
                    list.taskIDs.map((taskID, index) => (
                      <Card
                        key={taskID}
                        list={list}
                        card={cards[taskID]}
                        index={index}
                      />
                    ))}
                  {provided.placeholder}
                </Box>
              )}
            </Droppable>
            <AddCard list={list} />
          </ListContainer>
        </Box>
      )}
    </Draggable>
  );
};

export default List;
