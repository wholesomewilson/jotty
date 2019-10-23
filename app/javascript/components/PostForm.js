import React, { useState } from "react";
import PropTypes from 'prop-types';
import PostNotFound from './PostNotFound';
import BasicDateTimePicker from './DateTimePicker';
import { DateTimePicker, MuiPickersUtilsProvider } from "@material-ui/pickers";
import axios from 'axios';
import { handleAjaxError } from '../helpers/helpers';
import { handleFormError } from '../helpers/helpers';
import Button from '@material-ui/core/Button';
import TextField from '@material-ui/core/TextField';
import Grid from '@material-ui/core/Grid';
import Paper from '@material-ui/core/Paper';
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogTitle from '@material-ui/core/DialogTitle';
import Typography from '@material-ui/core/Typography';
import AddCircle from '@material-ui/icons/AddCircle';
import AlarmIcon from '@material-ui/icons/Alarm';
import EditIcon from '@material-ui/icons/Edit';
import DeletePost from './DeletePost';
import moment from 'moment';
import Chip from '@material-ui/core/Chip';
import SuggestedList from './SuggestedList';
import FaceIcon from '@material-ui/icons/Face';
import DoneIcon from '@material-ui/icons/Done';

class PostForm extends React.Component {
  constructor(props){
    super(props);
    this.state = {
      post: props.post,
      errors: {},
      showAlarm: props.post.alarm ? true : props.showAlarm ? props.showAlarm : false,
      searchedUser: {},
      suggestedList: [],
      showSearchedUser: false,
      showRecipientName: false,
      hideRecipientInput: true,
      showSuggestedList: true,
      formOpen: false,
      validateRecipient: true,
      validateDate: true,
      validateBody: true,
      validateAlarmPassed: true,
      validateAlarmOver: true,
      enterMobileChipColor: "default",
      enterMobileChipVariant: "outlined",
      current_user: this.props.current_user
    };
    this.handleSubmit = this.handleSubmit.bind(this);
    this.handleInputChangeBody = this.handleInputChangeBody.bind(this);
    this.handleInputChangeName = this.handleInputChangeName.bind(this);
    this.handleDate = this.handleDate.bind(this);
    this.handleAlarm = this.handleAlarm.bind(this);
    this.onClickAlarm = this.onClickAlarm.bind(this);
    this.selectSearchUser = this.selectSearchUser.bind(this);
    this.handleOpenNew = this.handleOpenNew.bind(this);
    this.handleOpenEdit = this.handleOpenEdit.bind(this);
    this.handleClose = this.handleClose.bind(this);
    this.handleSuggestedRecipient = this.handleSuggestedRecipient.bind(this);
    this.onClickOpenMobile = this.onClickOpenMobile.bind(this);
    this.removeRecipient = this.removeRecipient.bind(this);
  }

  componentDidUpdate({ post }) {
    //this.setState({post});
  }

  componentDidMount(){
    axios.get('/api/suggestedusers.json')
    .then( response => {
      this.setState({
        suggestedList: response.data,
      });
    })
    .catch(handleAjaxError);
  }

  validatePost(post) {
    const errors = {};
    if (post.recipient_id.length == 0){
      this.setState({
        validateRecipient: false
      })
      errors.recipient_id = true
    }else{
      this.setState({
        validateRecipient: true
      })
      delete errors.recipient_id
    }
    if (post.date - moment().seconds(0).milliseconds(0) < 0){
      this.setState({
        validateDate: false
      })
      errors.date = true;
    }else{
      this.setState({
        validateDate: true
      })
      delete errors.date
    }
    if( this.state.showAlarm ){
      if ( post.alarm - moment().seconds(0).milliseconds(0) < 0){
        this.setState({
          validateAlarmPassed: false
        })
        errors.alarm = true;
      }else{
        this.setState({
          validateAlarmPassed: true
        })
        delete errors.alarm
      }
      if ( post.alarm - post.date > 0 ){
        this.setState({
          validateAlarmOver: false
        })
        errors.alarm = true;
      }else{
        this.setState({
          validateAlarmOver: true
        })
        delete errors.alarm
      }
    }else{
      this.setState({
        validateAlarmPassed: true,
        validateAlarmOver: true
      })
      delete errors.alarm
    }
    if (post.body.length == 0){
      this.setState({
        validateBody: false
      })
      errors.body = true;
    }else{
      this.setState({
        validateBody: true
      })
      delete errors.body
    }
    return errors;
  }

  handleSubmit(e) {
    e.preventDefault();
    const { post } = this.state;
    const errors = this.validatePost(post);
    if (!this.isEmptyObject(errors)) {
      this.setState({ errors });
    } else {
      const { onSubmit } = this.props;
      onSubmit(post)
      this.handleClose();
    }
  }

  handleInputChangeBody(post) {
    const { target } = post;
    const { name } = target;
    const value = target.type === 'checkbox' ? target.checked : target.value;
    this.updatePost(name, value)
    value.length == 0 ? this.setState({ validateBody: false }) : this.setState({ validateBody: true });
  }

  handleInputChangeName(e) {
    let contact_number = e.target.value
    if (contact_number.length >= 8){
      axios.get(`/api/searchusers.json`,{
        params: {
          contact_number: contact_number
        }
      })
      .then( response => {
        // console.log(response)
        response.data == 'null' ? null : this.setState({ searchedUser: response.data, showSearchedUser: true })
      })
      .catch(handleAjaxError);
    }
  }

  handleSuggestedRecipient(id) {
    const { searchedUser } = this.state;
    axios.get(`/api/searchusers/${id}.json`)
    .then( response => {
      response.data == 'null' ?
          null
        :
          this.setState( prevState => ({
            searchedUser: response.data,
            post: {
              ...prevState.post,
              recipient_id: response.data.id
            },
            showSearchedUser: false,
            hideRecipientInput: true,
            validateRecipient: true,
            showRecipientName: true,
            showSuggestedList: false,
          }));
    })
    .catch(handleAjaxError);
  }

  handleDate(post) {
    this.updatePost('date', post);
  };

  handleAlarm(post) {
    this.updatePost('alarm', post);
  };

  updatePost(key, value){
    this.setState( prevState => ({
      post: {
        ...prevState.post,
        [key]: value
      }
    }));
  }

  onClickAlarm(e) {
    e.preventDefault();
    this.setState({
      showAlarm: !this.state.showAlarm,
    }, () => {
      if(!this.state.showAlarm){
        this.setState({
          validateAlarmPassed: true,
          validateAlarmOver: true
        });
      }
      const alarm = this.state.showAlarm ? moment().seconds(0).milliseconds(0) : ''
      this.setState( prevState => ({
        post: {
          ...prevState.post,
          ['alarm']: alarm
        }
      }));
    })
  }

  onClickOpenMobile(){
    this.setState({
      hideRecipientInput: !this.state.hideRecipientInput,
      enterMobileChipColor: this.state.enterMobileChipColor === "default" ? "secondary" : "default",
      enterMobileChipVariant: this.state.enterMobileChipVariant === "outlined" ? "default" : "outlined",
    })
  }

  isEmptyObject(obj) {
    return Object.keys(obj).length === 0;
  }

  renderErrors() {
    const { errors } = this.state;

    if (this.isEmptyObject(errors)) {
      return null;
    }

    return (
      <div className="errors">
        <h3>The following errors prohibited the event from being saved:</h3>
        <ul>
          {Object.values(errors).map(error => (
            <li key={error}>{error}</li>
          ))}
        </ul>
      </div>
    );
  }

  renderSearchedUser(){
    const { searchedUser } = this.state;
    if (searchedUser){
      if(searchedUser.id === this.props.current_user.id){
        var searchedUserName = 'Myself'
      }else{
        var searchedUserName = searchedUser.first_name + ' ' + searchedUser.last_name
      }
      return <div><p style={{margin:'5px 0px', fontSize:'11px', color:'#f50057'}}>Select Recipient</p><Chip label= { searchedUserName } onClick={this.selectSearchUser}/></div>
      //<button type='button' onClick= {this.selectSearchUser}> {searchedUserName} </button>
    }else{
      return <p style={{marginTop:'10px', fontSize:'11px', color:'red'}}>No users found!</p>
    }
  }

  renderRecipientName(){
    const { searchedUser } = this.state;
    if(searchedUser.id === this.props.current_user.id){
      var searchedUserName = 'Myself'
    }else{
      var searchedUserName = searchedUser.first_name + ' ' + searchedUser.last_name
    }
    return <Chip label={searchedUserName} onDelete={this.removeRecipient} color="primary" variant="default"/>
  }

  selectSearchUser() {
    const { searchedUser } = this.state;
    this.setState( prevState => ({
      post: {
        ...prevState.post,
        recipient_id: searchedUser.id
      },
      showSearchedUser: false,
      hideRecipientInput: true,
      validateRecipient: true,
      showRecipientName: true,
      showSuggestedList: false,
    }));
  }

  handleOpenNew () {
    this.setState({
      formOpen: true,
      post: {
        alarm: this.props.post.alarm,
        date: moment().seconds(0).milliseconds(0),
        recipient_id: this.props.post.recipient_id,
        body: this.props.post.body,
      },
      errors: {},
      showAlarm: false,
      searchedUser: {},
      showSearchedUser: false,
      hideRecipientInput: true,
      validateRecipient: true,
      validateDate: true,
      validateBody: true,
      validateAlarmPassed: true,
      validateAlarmOver: true,
    });
  }

  handleOpenEdit () {
    this.setState({
      formOpen: true
    });
  }


  handleClose() {
    this.setState({
      formOpen: false,
      showAlarm: false,
      showRecipientName: false,
      showSuggestedList: true,
      enterMobileChipColor: "default",
      enterMobileChipVariant: "outlined",
    });
  }

  removeRecipient(){
    this.setState( prevState => ({
      searchedUser: {},
      post: {
        ...prevState.post,
        recipient_id: ""
      },
      showRecipientName: false,
      showSuggestedList: true,
      enterMobileChipColor: "default",
      enterMobileChipVariant: "outlined",
    }));
  }

  render(){
    const { post } = this.state;
    const { path } = this.props;
    const { showAddCircle } = this.props;
    if (!post.id && path === '/posts/:id/edit') return <PostNotFound/>;
    const title = post.id ? 'Edit Post' : 'New Post';
    const recipientInput = <div>
      {this.state.showRecipientName ? this.renderRecipientName() : null}
      {this.state.showSuggestedList ? <SuggestedList selectSuggestedUser = {this.handleSuggestedRecipient} suggestedList = {this.state.suggestedList} onClickOpenMobile = {this.onClickOpenMobile} enterMobileChipColor = {this.state.enterMobileChipColor} enterMobileChipVariant = {this.state.enterMobileChipVariant} current_user = {this.props.current_user}/> : null}
      {this.state.hideRecipientInput ? null : <TextField style={{marginTop: "10px"}} autoFocus id="recipient_id" label="Recipient Mobile No." type="text" name="recipient_id" fullWidth onChange= {this.handleInputChangeName}/>}
      {this.state.showSearchedUser ? this.renderSearchedUser() : null}
      {this.state.validateRecipient ? null : <div style={{fontSize:'11px', color:'red', margin:'17px 0px 0px 5px'}}>Please choose a Recipient</div>}
    </div>
    if(post.id){
      // const recipientName = this.state.current_user.id === post.recipient_id ? "Myself" : `${post.recipient.first_name} ${post.recipient.last_name}`
    }
    console.log("again")
    return (
      <div>
        {showAddCircle ? <AddCircle onClick={this.handleOpenNew} className="add_post_icon" color="primary"/> : <EditIcon onClick={this.handleOpenEdit} style={{marginLeft: '10px', fontSize:'18px'}}/>}
        <Dialog open={this.state.formOpen} onClose={this.handleClose} aria-labelledby="form-dialog-title" PaperProps={{style: {margin: "0 10px", width:"100%"}}}>
          <form className='eventForm' onSubmit = {this.handleSubmit}>
            <DialogTitle id="form-dialog-title" style={{textAlign: "center"}}>{title}</DialogTitle>
            <DialogContent>
              <div>
              {
                post.id ? `${post.recipient.first_name} ${post.recipient.last_name}` : recipientInput
              }
              </div>
              <div style={{margin:'20px 0'}}>
                <BasicDateTimePicker handleDate={this.handleDate} existingDate={this.state.post.date} pickerlabel= "Date"/>
                {this.state.validateDate ? null : <div style={{display: 'inline-block', fontSize:'11px', color:'red', margin:'17px 0px 17px 5px'}}>This date/time has passed.<br/>Please choose again.</div>}
              </div>
              <div>
                { this.state.showAlarm ? <div style={{marginTop:'20px', alignItems: 'center', display:'flex'}}><BasicDateTimePicker handleDate={this.handleAlarm} existingDate={this.state.post.alarm} pickerlabel= "Alarm"/>
                <Button size="small" variant="contained" color="secondary" onClick={this.onClickAlarm} style={{marginLeft:'20px'}}>Remove Alarm</Button></div> :
                <Button size="small" variant="contained" color="secondary" onClick={this.onClickAlarm}>Add Alarm</Button>}
                {this.state.validateAlarmPassed ? null : <div style={{fontSize:'11px', color:'red', margin:'17px 0px 0px 5px'}}>This date/time has passed. Please choose again.</div>}
                {this.state.validateAlarmOver ? null : <div style={{fontSize:'11px', color:'red', margin:'17px 0px 0px 5px'}}>Alarm must be set before Date. Please choose again.</div>}
              </div>
              <div>
                <TextField id="body" name="body" label="Message" multiline rows="4" margin="normal" onChange= {this.handleInputChangeBody} value = {this.state.post.body || ''} fullWidth/>
                {this.state.validateBody ? null : <div style={{fontSize:'11px', color:'red', margin:'17px 0px 0px 5px'}}>Message cannot be empty</div>}
              </div>
            </DialogContent>
            <Grid justify="space-between" container>
              <Grid item>
                <DialogActions>
                  { post.id ? <DeletePost onClickDeletePost = {this.props.deletePost} postId = {post.id}/> : null }
                </DialogActions>
              </Grid>
              <Grid item>
              <DialogActions>
                <Button onClick={this.handleClose} color="primary">
                  Cancel
                </Button>
                <Button onClick={this.handleSubmit} color="primary">
                  {showAddCircle ? 'Create' : 'Done'}
                </Button>
              </DialogActions>
              </Grid>
            </Grid>
          </form>
        </Dialog>
      </div>
    );
  }
}

PostForm.propTypes = {
  post: PropTypes.shape(),
  onSubmit: PropTypes.func.isRequired,
  path: PropTypes.string.isRequired
};

PostForm.defaultProps = {
  post: {
    recipient_id: '',
    date: '',
    alarm: '',
    body: ''
  }
};

export default PostForm;
