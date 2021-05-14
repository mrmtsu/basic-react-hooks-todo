import { FormControl, List, TextField } from '@material-ui/core';
import AddToPhotosIcon from '@material-ui/icons/AddToPhotos';
import { ChangeEvent, useEffect, useState, VFC } from 'react';
import styles from './App.module.css';
import { db } from "./firebase";
import { TaskItem } from './TaskItem';
import { makeStyles } from '@material-ui/styles';
import { auth } from './firebase';
import ExitToAppIcon from '@material-ui/icons/ExitToApp';

const useStyles = makeStyles({
  field: {
    marginTop: 30,
    marginBottom: 20,
  },
  list: {
    margin: "auto",
    width: "40%",
  },
});

type User = {
  id: string;
  title: string;
}

const App: VFC = (props: any) => {
  const [tasks, setTasks] = useState<User[]>([]);
  const [input, setInput] = useState("");
  const classes = useStyles();

  const onChangeValue = (e: ChangeEvent<HTMLInputElement>) => setInput(e.target.value);
  const newTask = (e: React.MouseEvent<HTMLButtonElement>) => {
    db.collection("tasks").add({title: input});
    setInput("");
  };

  useEffect(() => {
    const unSub = auth.onAuthStateChanged((user) => {
      !user && props.history.push("login")
    });
    return () => unSub();
  })

  useEffect(() => {
    const unSub = db.collection("tasks").onSnapshot((snapshot) => {
      setTasks(
        snapshot.docs.map((doc) => ({ id: doc.id, title: doc.data().title }))
      );
    });
    // unmount時に停止
    return () => unSub();
  }, []);

  return (
    <div className={styles.app__root}>
      <h1>TODO App by React/Firebase</h1>
      <button className={styles.app__logout} onClick={ async () => {
        try {await auth.signOut();
        props.history.push("login");
      } catch (error) {
        alert(error.message);
      }
      }}
      >
        <ExitToAppIcon />
      </button>
      <br />
      <FormControl>
        <TextField
          className={classes.field}
          InputLabelProps = {{
            shrink: true,
          }}
          label="New task ?"
          value={input}
          onChange={onChangeValue}
        />
      </FormControl>
      <button className={styles.app__icon} disabled={!input} onClick={newTask}>
        <AddToPhotosIcon />
      </button>


      <List className={classes.list}>
        {tasks.map((task) => (
          <TaskItem key={task.id} id={task.id} title={task.title} />
        ))}
      </List>
    </div>
  );
}

export default App;
