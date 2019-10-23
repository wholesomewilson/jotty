import React from 'react';
import { makeStyles } from '@material-ui/core/styles';
import BottomNavigation from '@material-ui/core/BottomNavigation';
import BottomNavigationAction from '@material-ui/core/BottomNavigationAction';
import PeopleAltRoundedIcon from '@material-ui/icons/PeopleAltRounded';
import LibraryBooksIcon from '@material-ui/icons/LibraryBooks';
import PostForm from './PostForm';

const useStyles = makeStyles({
  root: {
    width: '100%',
    position: 'fixed',
    bottom: 0,
    zIndex: 2,
  },
});

export default function BottomNav({onClickBtmNav, addPost, showAddCircle, current_user}) {
  const classes = useStyles();
  const [value, setValue] = React.useState('jotties');

  const handleChange = (event, newValue) => {
    setValue(newValue);
  };

  return (
    <BottomNavigation
      value={value}
      onChange={ (e, v) => {
        onClickBtmNav(e, v);
        handleChange(e,v);
      }}
      className={classes.root}
    >
      <BottomNavigationAction label="Jotties" value="jotties" icon={<LibraryBooksIcon />} />
      <BottomNavigationAction label="Friends" value="friends" icon={<PeopleAltRoundedIcon />} />
      <PostForm path="/posts/new" onSubmit={addPost} showAddCircle={showAddCircle} current_user = {current_user}/>
    </BottomNavigation>
  );
}
