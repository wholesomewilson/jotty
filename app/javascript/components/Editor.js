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

class Editor extends React.Component {
  constructor(props){
    super(props);
    this.state = {
      ownPosts: null,
      otherPosts: null,
      current_user: null,
      showOwnPost: true,
      userSetup: null,
      postFilterMyColor: "primary",
      postFilterOtherColor: "default"
    };
  this.addPost = this.addPost.bind(this);
  this.deletePost = this.deletePost.bind(this);
  this.updatePost = this.updatePost.bind(this);
  this.onClickPostFilterMy = this.onClickPostFilterMy.bind(this);
  this.onClickPostFilterOther = this.onClickPostFilterOther.bind(this);
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
        //console.log(response.data)
      })
      .catch(handleAjaxError);
    axios
      .get('/api/getotherposts.json')
      .then(response => {
        this.setState({
          otherPosts: response.data,
        })
        //console.log(response.data)
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
          this.setState(prevState => ({
            otherPosts: [...prevState.otherPosts, savedPost],
          }));
        }
        //const { history } = this.props;
        //history.push(`/posts/${savedPost.id}`);
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
      /*
      const { posts } = this.state;
      const idx = posts.findIndex(post => post.id === updatedPost.id);
      posts[idx] = updatedPost;
      const { history } = this.props;
      history.push(`/posts/${updatedPost.id}`);
      this.setState( { posts });
      */
    })
    .catch(handleAjaxError);
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
          this.setState({
            ownPosts: posts.filter( post => post.id !== postId),
            otherPosts: posts.filter( post => post.id !== postId)
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
      showOwnPost: true,
      postFilterMyColor: "primary",
      postFilterOtherColor: "default",
    })
  }

  onClickPostFilterOther(){
    this.setState({
      showOwnPost: false,
      postFilterMyColor: "default",
      postFilterOtherColor: "primary",
    })
  }

  render(){
    const { ownPosts } = this.state;
    if (ownPosts === null) return null;
    const { otherPosts } = this.state;
    if (otherPosts === null) return null;
    //const setup = this.state.current_user.setup;
    //const { match } = this.props;
    //const postId = match.params.id;
    //const post = ownPosts.find(x => x.id === Number(postId))
    return(
      <div style={{padding: '0px 15px'}}>
        <Header />
        { this.state.userSetup ?
          <SubApp
            onClickPostFilterMy = {this.onClickPostFilterMy}
            onClickPostFilterOther = {this.onClickPostFilterOther}
            postFilterMyColor={this.state.postFilterMyColor}
            postFilterOtherColor={this.state.postFilterOtherColor}
            current_user = {this.state.current_user}
            deletePost = {this.deletePost}
            updatePost = {this.updatePost}
            addPost= {this.addPost}
            showAddCircle= {true}
            showOwnPost = {this.state.showOwnPost}
            ownPosts = {ownPosts}
            otherPosts = {otherPosts}
          />
        :
          <Setup current_user = {this.state.current_user}/>
        }
      </div>
    );
  }
}

Editor.propTypes = {
  match: PropTypes.shape(),
  //history: PropTypes.shape({ push: PropTypes.func }).isRequired
};

export default Editor;
