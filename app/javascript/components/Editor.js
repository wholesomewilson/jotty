import React from 'react';
import axios from 'axios';
import PropTypes from 'prop-types';
import PropsRoute from './PropsRoute';
import Header from './Header';
import PostList from './PostList';
import { Switch } from 'react-router-dom';
import { success } from '../helpers/notifications';
import { handleAjaxError } from '../helpers/helpers';
import PostForm from './PostForm';
import AddCircle from '@material-ui/icons/AddCircle';
//import PromptInstall from './PromptInstall';
import Button from '@material-ui/core/Button';
import moment from 'moment';
import PostFilter from './PostFilter';
import SubApp from './SubApp';
import Setup from './Setup';
import BottomNav from './BottomNav';
import FriendList from './FriendList';

class Editor extends React.Component {
  constructor(props){
    super(props);
    this.state = {
      ownPosts: null,
      otherPosts: null,
      pendingPosts: null,
      current_user: null,
      showWhichPost: 'own',
      userSetup: null,
      postFilterMyColor: "primary",
      postFilterOtherColor: "default",
      postFilterPendingColor: "default",
      showJotty: "jotties",
      userPermissions: null,
    };
  this.addPost = this.addPost.bind(this);
  this.updatePost = this.updatePost.bind(this);
  this.acceptPost = this.acceptPost.bind(this);
  this.declinePost = this.declinePost.bind(this);
  this.onClickPostFilterMy = this.onClickPostFilterMy.bind(this);
  this.onClickPostFilterOther = this.onClickPostFilterOther.bind(this);
  this.onClickPostFilterPending = this.onClickPostFilterPending.bind(this);
  this.deletePost = this.deletePost.bind(this);
  this.onClickBtmNav = this.onClickBtmNav.bind(this);
  }

  componentDidMount(){
    const csrfToken = document.querySelector("meta[name=csrf-token]").content;
    axios.defaults.headers.common["X-CSRF-Token"] = csrfToken;
    axios
      .get(`/api/currentusers.json`)
      .then( response => {
        if (response.data == null){
          window.location.reload()
        }else{
          this.setState({
            current_user: response.data,
            userSetup: response.data.setup
          })
        }
      })
      .catch(handleAjaxError);
    axios
      .get('/api/getownposts.json')
      .then(response => {
        this.setState({
          ownPosts: response.data,
        })
         // console.log(response.data)
      })
      .catch(handleAjaxError);
    axios
      .get('/api/getotherposts.json')
      .then(response => {
        this.setState({
          otherPosts: response.data,
        })
         // console.log(response.data)
      })
      .catch(handleAjaxError);
    axios
      .get('/api/pending_posts.json')
      .then(response => {
        this.setState({
          pendingPosts: response.data,
        })
        // console.log(response.data)
      })
      .catch(handleAjaxError);
    axios
      .get('/api/permissions.json')
      .then(response => {
        this.setState({
          userPermissions: response.data,
        })
        // console.log(response.data)
      })
      .catch(handleAjaxError);
  }

  addPost(newPost) {
    axios
      .post('/api/posts.json', newPost)
      .then((response) => {
        success('Post Added!');
        const savedPost = response.data;
        //console.log(response)
        if (newPost.recipient_id == this.state.current_user.id){
          this.setState(prevState => ({
            ownPosts: [...prevState.ownPosts, savedPost],
          }));
        }else{
          if(savedPost.approved){
            this.setState(prevState => ({
              otherPosts: [...prevState.otherPosts, savedPost],
            }));
          }
          else{
            this.setState(prevState => ({
              pendingPosts: [...prevState.pendingPosts, savedPost],
            }));
          }
        }
        //const { history } = this.props;
        //history.push(`/posts/${savedPost.id}`);
        // console.log(response);
      })
      .catch(handleAjaxError);
  }

  updatePost(updatedPost){
    axios
    .put(`/api/posts/${updatedPost.id}.json`, updatedPost)
    .then( () => {
      success('Post Updated!');
      if (updatedPost.recipient_id == this.state.current_user.id){
        const { ownPosts } = this.state;
        const idx = ownPosts.findIndex(post => post.id === updatedPost.id);
        ownPosts[idx] = updatedPost;
        this.setState( { ownPosts });
      }else{
        const { otherPosts } = this.state;
        const idx = otherPosts.findIndex(post => post.id === updatedPost.id);
        otherPosts[idx] = updatedPost;
        this.setState( { otherPosts });
      }
    })
    .catch(handleAjaxError);
  }

  acceptPost(postId, posterfullname) {
    let sure = window.confirm(`${posterfullname} will be allowed to send you Jotties. Do you want to continue?`);
    if (sure){
      axios
        .post('/api/permissions.json', {
            post_id: postId
        })
        .then((response) => {
          success('Jotty Accepted!');
          let { pendingPosts } = this.state;
          let idx = pendingPosts.findIndex(post => post.id === postId);
          let newPost = pendingPosts[idx];
          newPost.approved = true;
          pendingPosts.splice(idx, 1);
          this.setState( prevState => ({
            ownPosts: [...prevState.ownPosts, newPost],
            pendingPosts: pendingPosts
          }));
        })
        .catch(handleAjaxError);
    }
  }

  declinePost(postId, posterfullname) {
      let sure = window.confirm(`${posterfullname} will not be allowed to send you any Jotties. Do you want to continue?`);
      if (sure){
        axios.delete(`/api/posts/${postId}.json`, {
          params: {
            ban: true
          }
        })
        .then( response => {
          if (response.status === 204){
            success('Jotty Declined!');
            let { pendingPosts } = this.state;
            this.setState({
              pendingPosts: pendingPosts.filter( post => post.id !== postId)
            });
          }
        })
        .catch(handleAjaxError);
      }
  }


  pushNotty(){
    axios.get(`/api/alarm`).then( response => {
      //console.log(response)
    })
    .catch(handleAjaxError);
  }

  onClickPostFilterMy(){
    this.setState({
      showWhichPost: 'own',
      postFilterMyColor: "primary",
      postFilterOtherColor: "default",
      postFilterPendingColor: "default"
    })
  }

  onClickPostFilterOther(){
    this.setState({
      showWhichPost: 'other',
      postFilterMyColor: "default",
      postFilterOtherColor: "primary",
      postFilterPendingColor: "default"
    })
  }

  onClickPostFilterPending(){
    this.setState({
      showWhichPost: 'pending',
      postFilterMyColor: "default",
      postFilterOtherColor: "default",
      postFilterPendingColor: "primary"
    })
  }

  onClickBtmNav(e, v){
    this.setState({
      showJotty: v,
    });
  }

  deletePost(postId) {
    const sure = window.confirm('Are you sure?');
    if (sure){
      axios.delete(`/api/posts/${postId}.json`)
      .then( response => {
        if (response.status === 204){
          success('Post deleted!');
          const { ownPosts } = this.state;
          const { otherPosts } = this.state;
          const { pendingPosts } = this.state;
          this.setState({
            ownPosts: ownPosts.filter( post => post.id !== postId),
            otherPosts: otherPosts.filter( post => post.id !== postId),
            pendingPosts: pendingPosts.filter( post => post.id !== postId)
          });
        }
      })
      .catch(handleAjaxError);
    }
  }

  render(){
    const { ownPosts } = this.state;
    if (ownPosts === null) return null;
    const { otherPosts } = this.state;
    if (otherPosts === null) return null;
    const { pendingPosts } = this.state;
    if (pendingPosts === null) return null;
    if(this.state.userSetup){
      var mainPage =
        <div>
          <BottomNav onClickBtmNav = {this.onClickBtmNav} addPost={this.addPost} showAddCircle={true} current_user = {this.state.current_user}/>
          { this.state.showJotty == 'jotties' ?
            <SubApp
              onClickPostFilterMy = {this.onClickPostFilterMy}
              onClickPostFilterPending = {this.onClickPostFilterPending}
              onClickPostFilterOther = {this.onClickPostFilterOther}
              postFilterMyColor={this.state.postFilterMyColor}
              postFilterOtherColor={this.state.postFilterOtherColor}
              postFilterPendingColor={this.state.postFilterPendingColor}
              current_user = {this.state.current_user}
              updatePost = {this.updatePost}
              addPost = {this.addPost}
              deletePost = {this.deletePost}
              acceptPost = {this.acceptPost}
              declinePost = {this.declinePost}
              showAddCircle= {true}
              showWhichPost = {this.state.showWhichPost}
              ownPosts = {ownPosts}
              otherPosts = {otherPosts}
              pendingPosts = {pendingPosts}
            />
            :
              <FriendList list = {this.state.userPermissions}/>
          }
        </div>
    }else{
      var mainPage = <Setup current_user = {this.state.current_user}/>
    }

    return(
      <div>
        <Header />
        {mainPage}
      </div>


    );
  }
}

Editor.propTypes = {
  match: PropTypes.shape(),
  //history: PropTypes.shape({ push: PropTypes.func }).isRequired
};

export default Editor;
