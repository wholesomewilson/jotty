import React from 'react';
import PropTypes from 'prop-types';
import { Link } from 'react-router-dom';
import moment from 'moment';
import Post from './Post';
import TextField from '@material-ui/core/TextField';
import SearchIcon from '@material-ui/icons/Search';
import InputAdornment from '@material-ui/core/InputAdornment';

class PostList extends React.Component {
  constructor(props){
    super(props);
    this.state = {
      searchTerm: ''
    };
    this.updateSearchTerm = this.updateSearchTerm.bind(this);
  }

  updateSearchTerm(e) {
    this.setState({ searchTerm: e.target.value });
  }

  renderPosts() {
    const { posts } = this.props;
    const filteredPosts = posts
    .filter( post => this.matchSearchTerm(post))
    .sort((a, b) => new Date(b.date) - new Date(a.date));
    return filteredPosts.map( post => (
      <li key={post.id}><Post post={post} current_user = {this.props.current_user} onDelete={this.props.onDelete} updatePost={this.props.updatePost}/></li>
    ));
  }

  matchSearchTerm(obj) {
    const {
      alarm, created_at, date, id, poster_id, recipient_id, status, timezone_offset, updated_at, poster, recipient, job_id, ...body
    } = obj;
    const { searchTerm } = this.state;
    const values = Object.assign({},body,poster,recipient)
    return Object.values(values).some(
      value => value.toLowerCase().indexOf(searchTerm.toLowerCase()) > -1,
    );
  }

  render() {
    return(
      <div>
      <TextField onKeyUp={this.updateSearchTerm}
        InputProps={{ endAdornment: ( <InputAdornment position="end"><SearchIcon style={{color: '#b2b2b2'}}/></InputAdornment>)}}
        InputLabelProps={{ style:{ color: '#b2b2b2' } }}
        id="outlined-search" label="Search Jotty" type="search" margin="normal" variant="outlined" fullWidth
      />
        <ul>{this.renderPosts()}</ul>
      </div>
    )
  }
}

PostList.propTypes = {
  posts: PropTypes.arrayOf(PropTypes.object),
};

PostList.defaultProps = {
  posts: []
};

export default PostList;
