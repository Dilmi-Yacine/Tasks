import { DragDropContext, Droppable } from "react-beautiful-dnd";
import { getSession } from "next-auth/client";
import { SWRConfig, useSWRConfig } from "swr";
import dbConnect from "../../lib/dbConnect";
import Board from "../../models/Board";
import List from "../../models/List";
import Card from "../../models/Card";
import Label from "../../models/Label";
import User from "../../models/User";
import Head from "next/head";
import axios from "axios";
import { styled } from "@mui/material/styles";
import Stack from "@mui/material/Stack";
import LoadingPage from "../../components/app/loadingPage";
import AppNav from "../../components/app/appNav";
import useBoard from "../../lib/useBoard";
import useLists from "../../lib/useLists";
import useCards from "../../lib/useCards";
import useLabels from "../../lib/useLabels";
import useUsers from "../../lib/useUsers";
import useUser from "../../lib/useUser";
import BoardTitle from "../../components/app/boardTitle";
import ListComp from "../../components/app/list";
import AddList from "../../components/app/addList";

const WorkFlow = styled("div")(({ theme }) => ({
  display: "flex",
  flexDirection: "row",
  padding: theme.spacing(0, 2),
  overflowX: "auto",
  overflowY: "hidden",
  position: "absolute",
  top: theme.spacing(20),
  bottom: 0,
  left: 0,
  right: 0,
}));

const Details = ({ boardID, fallback }) => {
  const { mutate } = useSWRConfig();

  const { board, loadingBoard } = useBoard(`/api/boards/${boardID}`);
  const { lists, loadingLists } = useLists(`/api/lists?boardID=${boardID}`);
  const { cards, loadingCards } = useCards(`/api/cards?boardID=${boardID}`);
  const { loadingLabels } = useLabels(`/api/labels?boardID=${boardID}`);
  const { loadingUsers } = useUsers(`/api/boardUsers?boardID=${boardID}`);
  const { loadingUser } = useUser(`/api/user`);

  const onDragEnd = async (result) => {
    const { destination, source, draggableId, type } = result;

    if (!destination) {
      return;
    }

    if (
      destination.droppableId === source.droppableId &&
      destination.index === source.index
    ) {
      return;
    }

    if (type === "list") {
      let newlistOrder = Array.from(board.listsOrder);
      newlistOrder.splice(source.index, 1);
      newlistOrder.splice(destination.index, 0, draggableId);
      mutate(
        `/api/boards/${boardID}`,
        { ...board, listsOrder: newlistOrder },
        false
      );
      await axios.patch(`/api/boards/${boardID}`, {
        newOrder: newlistOrder,
      });
      mutate(`/api/boards/${boardID}`);
      return;
    }

    const start = lists[source.droppableId];
    const finish = lists[destination.droppableId];

    if (start === finish) {
      const newCardsOrder = Array.from(start.taskIDs);
      newCardsOrder.splice(source.index, 1);
      newCardsOrder.splice(destination.index, 0, draggableId);

      const updatedCardsOrder = {
        ...lists[start._id],
        taskIDs: newCardsOrder,
      };
      mutate(
        `/api/lists?boardID=${boardID}`,
        { ...lists, [start._id]: updatedCardsOrder },
        false
      );

      await axios.patch(`/api/lists?boardID=${boardID}&listID=${start._id}`, {
        newOrder: newCardsOrder,
      });
      mutate(`/api/lists?boardID=${boardID}`);
      return;
    }

    const startCardsOrder = Array.from(start.taskIDs);
    startCardsOrder.splice(source.index, 1);

    const finishCardsOrder = Array.from(finish.taskIDs);
    finishCardsOrder.splice(destination.index, 0, draggableId);

    const updatedStartCardsOrder = {
      ...lists[start._id],
      taskIDs: startCardsOrder,
    };
    const updatedFinishCardsOrder = {
      ...lists[finish._id],
      taskIDs: finishCardsOrder,
    };
    mutate(
      `/api/lists?boardID=${boardID}`,
      {
        ...lists,
        [finish._id]: updatedFinishCardsOrder,
        [start._id]: updatedStartCardsOrder,
      },
      false
    );

    await axios.patch(`/api/lists?boardID=${boardID}&listID=${start._id}`, {
      newOrder: startCardsOrder,
    });
    await axios.patch(`/api/lists?boardID=${boardID}&listID=${finish._id}`, {
      newOrder: finishCardsOrder,
    });
    mutate(`/api/lists?boardID=${boardID}`);
  };

  return (
    <SWRConfig value={{ fallback }}>
      {loadingBoard ||
      loadingLists ||
      loadingCards ||
      loadingLabels ||
      loadingUsers ||
      loadingUser ? (
        <>
          <Head>
            <title>Board</title>
            <meta
              name="viewport"
              content="initial-scale=1.0, width=device-width"
            />
          </Head>
          <LoadingPage />
        </>
      ) : (
        <div>
          <Head>
            <title>{board.title}</title>
            <meta
              name="viewport"
              content="initial-scale=1.0, width=device-width"
            />
          </Head>
          <AppNav />
          <BoardTitle />
          <WorkFlow>
            <DragDropContext onDragEnd={onDragEnd}>
              <Droppable
                droppableId="all-lists"
                direction="horizontal"
                type="list"
              >
                {(provided) => (
                  <Stack
                    direction="row"
                    {...provided.droppableProps}
                    ref={provided.innerRef}
                  >
                    {board.listsOrder.map((listID, index) => {
                      return (
                        <ListComp
                          key={lists[listID]._id}
                          list={lists[listID]}
                          cards={cards}
                          index={index}
                        />
                      );
                    })}
                    {provided.placeholder}
                  </Stack>
                )}
              </Droppable>
            </DragDropContext>
            <AddList boardID={boardID} />
          </WorkFlow>
        </div>
      )}
    </SWRConfig>
  );
};

export default Details;

export async function getServerSideProps(context) {
  const { req, params } = context;
  const session = await getSession({ req });

  if (session) {
    await dbConnect();
    const board = await Board.findById(params.id);
    if (!board) {
      return {
        notFound: true,
      };
    }
    // board lists
    const lists = await List.find({ board: board._id });
    const listsID = lists.map((list) => {
      return list._id;
    });
    const boardLists = {};
    listsID.forEach((id, index) => (boardLists[id] = lists[index]));

    // board cards
    const cards = await Card.find({ board: board._id });
    const cardsID = cards.map((card) => {
      return card._id;
    });
    const boardCards = {};
    cardsID.forEach((id, index) => (boardCards[id] = cards[index]));

    // board labels
    const labels = await Label.find({ board: board._id });
    const labelsID = labels.map((label) => {
      return label._id;
    });
    const boardLabels = {};
    labelsID.forEach((id, index) => (boardLabels[id] = labels[index]));

    // board users
    const users = await User.find().or([
      { _id: board.user },
      { email: { $in: board.sharedWith } },
    ]);
    const usersID = users.map((user) => {
      return user._id;
    });
    const boardUsers = {};
    usersID.forEach((id, index) => (boardUsers[id] = users[index]));

    return {
      props: {
        boardID: JSON.parse(JSON.stringify(params.id)),
        fallback: {
          [`/api/boards/${params.id}`]: JSON.parse(JSON.stringify(board)),
          [`/api/lists?boardID=${board._id}`]: JSON.parse(
            JSON.stringify(boardLists)
          ),
          [`/api/cards?boardID=${board._id}`]: JSON.parse(
            JSON.stringify(boardCards)
          ),
          [`/api/labels?boardID=${board._id}`]: JSON.parse(
            JSON.stringify(boardLabels)
          ),
          [`/api/boardUsers?boardID=${board._id}`]: JSON.parse(
            JSON.stringify(boardUsers)
          ),
        },
      },
    };
  } else {
    return {
      redirect: { destination: "/auth" },
    };
  }
}
