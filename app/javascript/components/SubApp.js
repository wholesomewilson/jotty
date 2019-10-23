import React from 'react'
import PostFilter from './PostFilter';
import PostList from './PostList';
import PostForm from './PostForm';

const SubApp = (
  {
    onClickPostFilterMy,
    onClickPostFilterOther,
    onClickPostFilterPending,
    postFilterMyColor,
    postFilterOtherColor,
    postFilterPendingColor,
    current_user,
    deletePost,
    updatePost,
    acceptPost,
    declinePost,
    addPos,
    showAddCircle,
    showWhichPost,
    ownPosts,
    otherPosts,
    pendingPosts,
    addPost,
  }
) => (
  <div style={{padding: '0px 15px 56px 15px'}}>
    <PostFilter onClickPostFilterMy = {onClickPostFilterMy} onClickPostFilterOther = {onClickPostFilterOther} onClickPostFilterPending = {onClickPostFilterPending} PostFilterMyColor={postFilterMyColor} PostFilterOtherColor={postFilterOtherColor} PostFilterPendingColor={postFilterPendingColor} />
      { showWhichPost === 'own' ?
        <PostList posts={ownPosts} approved = {true} current_user = {current_user} deletePost = {deletePost} updatePost = {updatePost} forOthers = {false}/>
        :
        showWhichPost === 'other' ?
        <PostList posts={otherPosts} approved = {true} current_user = {current_user} deletePost = {deletePost} updatePost = {updatePost} forOthers = {true}/>
        :
        <PostList posts={pendingPosts} approved = {false} current_user = {current_user} deletePost = {deletePost} updatePost = {updatePost} acceptPost = {acceptPost} declinePost = {declinePost} forOthers = {true}/>
      }
  </div>
)

export default SubApp;
