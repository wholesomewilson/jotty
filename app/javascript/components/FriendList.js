import React from 'react';
import Friend from './Friend';
import axios from 'axios';
import Typography from '@material-ui/core/Typography';
import FaceIcon from '@material-ui/icons/Face';
import Chip from '@material-ui/core/Chip';
import FriendFilter from './FriendFilter';

class FriendList extends React.Component{
  constructor(props){
    super(props);
    this.state = {
      list: this.props.list,
      colorFriends: "primary",
      colorBans: "default",
      showList: "friends"
    };
    this.removeFriend = this.removeFriend.bind(this);
    this.onClickFriends = this.onClickFriends.bind(this);
    this.onClickBan = this.onClickBan.bind(this);
  }

  renderFriends(){
    const { list } = this.state;
    const sortFriends = list.filter( x => !x.ban).sort( (a,b) => a.friend.first_name === b.friend.first_name ? 0 : a.friend.first_name > b.friend.first_name ? 1 : -1);
    return sortFriends.map( x => {
      let fullname = x.friend.first_name + " " + x.friend.last_name;
      return <li key={x.id}><Friend fullname = {fullname} friendId = {x.id} removeFriend = {this.removeFriend} buttonLabel="Ban" ban ='true'/></li>
    });
  }

  renderBans(){
    const { list } = this.state;
    const sortBans = list.filter( x => x.ban).sort( (a,b) => a.friend.first_name === b.friend.first_name ? 0 : a.friend.first_name > b.friend.first_name ? 1 : -1);;
    return sortBans.map( x => {
      let fullname = x.friend.first_name + " " + x.friend.last_name;
      return <li key={x.id}><Friend fullname = {fullname} friendId = {x.id} removeFriend = {this.removeFriend} buttonLabel="Unban" ban ='false'/></li>
    });
  }

  removeFriend(id, choice) {
    if(choice === "true"){
      var ban = true;
    }else{
      var ban = false;
    }
    axios
    .put(`/api/permissions/${id}.json`, {
        ban: ban,
    })
    .then( () => {
      const { list } = this.state;
      const idx = list.findIndex( permission => permission.id === id);
      list[idx].ban = ban;
      this.setState({list}, () => {
        console.log(this.state);
      });
    })
  }

  onClickFriends(){
    this.setState({
      showList: "friends",
      colorFriends: "primary",
      colorBans: "default",
    })
  }

  onClickBan(){
    this.setState({
      showList: "bans",
      colorFriends: "default",
      colorBans: "primary",
    })
  }

  render(){
    return(
      <div style={{padding: "0px 10px"}}>
        <FriendFilter onClickFriends={this.onClickFriends} onClickBan={this.onClickBan} colorFriends={this.state.colorFriends} colorBans={this.state.colorBans}/>
        {
          this.state.showList === "friends" ? this.renderFriends() : this.renderBans()
        }
      </div>
    )
  }

}

export default FriendList;
