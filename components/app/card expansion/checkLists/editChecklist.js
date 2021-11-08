import { useSWRConfig } from "swr";
import useCards from "../../../../lib/useCards";
import { Formik } from "formik";
import * as Yup from "yup";
import { styled } from "@mui/material/styles";
import IconButton from "@mui/material/IconButton";
import ClearIcon from "@mui/icons-material/Clear";
import TextField from "@mui/material/TextField";
import axios from "axios";

const Form = styled("form")({
  display: "flex",
  alignItems: "flex-start",
  flex: "1",
});

const EditChecklist = ({ card, listItem, itemIndex, setItemID }) => {
  const { mutate } = useSWRConfig();
  const { cards } = useCards(`/api/cards?boardID=${card.board}`);

  return (
    <Formik
      initialValues={{ item: listItem }}
      validationSchema={Yup.object().shape({
        item: Yup.string().trim().required().min(5).max(150).label("Item"),
      })}
      onSubmit={async (values) => {
        const updatedItem = {
          ...cards[card._id].checklist[itemIndex],
          item: values.item,
        };

        const cardCheckist = Array.from(cards[card._id].checklist);
        cardCheckist.splice(itemIndex, 1, updatedItem);

        const updatedCard = {
          ...cards[card._id],
          checklist: cardCheckist,
        };

        mutate(
          `/api/cards?boardID=${card.board}`,
          { ...cards, [card._id]: updatedCard },
          false
        );

        await axios.patch(`/api/cards?boardID=${card.board}`, {
          cardID: card._id,
          itemIndex: itemIndex + 1,
          editedItem: values.item,
        });

        mutate(`/api/cards?boardID=${card.board}`);

        setItemID(itemIndex);
      }}
    >
      {({
        values,
        errors,
        touched,
        handleSubmit,
        handleChange,
        handleBlur,
      }) => (
        <Form onSubmit={handleSubmit}>
          <TextField
            id="item"
            name="item"
            variant="outlined"
            size="small"
            fullWidth
            autoFocus
            onChange={handleChange}
            onBlur={handleBlur}
            value={values.item}
            error={errors.item && touched.item}
            helperText={errors.item && touched.item && errors.item}
          />
          <IconButton
            size="small"
            color="primary"
            onClick={setItemID}
            sx={{ mt: 0.25 }}
          >
            <ClearIcon />
          </IconButton>
        </Form>
      )}
    </Formik>
  );
};

export default EditChecklist;
