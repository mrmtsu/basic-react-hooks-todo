import { ChangeEvent, useState, VFC } from 'react'
import { ListItem, TextField, Grid} from "@material-ui/core";
import DeleteOutlineOutlinedIcon from "@material-ui/icons/DeleteOutlineOutlined";
import EditOutlinedIcon from "@material-ui/icons/EditOutlined";
import { db } from "./firebase";
import styles from "./TaskItem.module.css";

interface Props {
  id: string;
  title: string;
}

export const TaskItem: VFC<Props> = (props) => {
  const { id, title } = props;
  const [inputTitle, setInputTitle] = useState(props.title);

  const onChangeTitle = (e: ChangeEvent<HTMLInputElement>) => setInputTitle(e.target.value);
  const editTask = () => {
    db.collection("tasks").doc(id).set({ title: inputTitle }, { merge: true });
  };
  const deleteTask = () => {
    db.collection("tasks").doc(id).delete();
  }

  return (
    <ListItem>
      <h2>{title}</h2>
      <Grid container justify="flex-end">
        <TextField
        InputLabelProps = {{
          shrink: true,
        }}
          label="Edit task"
          value={inputTitle}
          onChange={onChangeTitle}
        />
      </Grid>
      <button className={styles.taskitem__icon} onClick={editTask}>
        <EditOutlinedIcon />
      </button>
      <button className={styles.taskitem__icon} onClick={deleteTask}>
        <DeleteOutlineOutlinedIcon />
      </button>
    </ListItem>
  )
}
