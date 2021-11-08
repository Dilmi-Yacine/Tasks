import { useSWRConfig } from "swr";
import useCards from "../../../../lib/useCards";
import { Formik } from "formik";
import * as Yup from "yup";
import Button from "@mui/material/Button";
import IconButton from "@mui/material/IconButton";
import ClearIcon from "@mui/icons-material/Clear";
import TextField from "@mui/material/TextField";
import axios from "axios";

const EditComment = ({ card, comment, index, setSelectedComment }) => {
  const { mutate } = useSWRConfig();
  const { cards } = useCards(`/api/cards?boardID=${card.board}`);

  return (
    <Formik
      initialValues={{ comment: comment.comment }}
      validationSchema={Yup.object().shape({
        comment: Yup.string()
          .trim()
          .required()
          .min(5)
          .max(200)
          .label("Comment"),
      })}
      onSubmit={async (values) => {
        const comment = {
          ...cards[card._id].comments[index],
          comment: values.comment,
        };

        const cardComments = Array.from(cards[card._id].comments);
        cardComments.splice(index, 1, comment);

        const updatedCard = {
          ...cards[card._id],
          comments: cardComments,
        };

        mutate(
          `/api/cards?boardID=${card.board}`,
          { ...cards, [card._id]: updatedCard },
          false
        );

        await axios.patch(`/api/cards?boardID=${card.board}`, {
          cardID: card._id,
          editedComment: values.comment,
          commentIndex: index + 1,
        });
        mutate(`/api/cards?boardID=${card.board}`);
      }}
    >
      {({ values, isValid, handleSubmit, handleChange, handleBlur }) => (
        <form onSubmit={handleSubmit}>
          <TextField
            id="comment"
            name="comment"
            variant="outlined"
            multiline
            rows={2}
            fullWidth
            onChange={handleChange}
            onBlur={handleBlur}
            value={values.comment}
          />
          <Button
            disabled={!values.comment.length ? true : false || !isValid}
            variant="contained"
            color="primary"
            onClick={handleSubmit}
            size="small"
          >
            Save
          </Button>
          <IconButton color="primary" onClick={setSelectedComment}>
            <ClearIcon />
          </IconButton>
        </form>
      )}
    </Formik>
  );
};

export default EditComment;
