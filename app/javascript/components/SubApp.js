import React from 'react'
import PostFilter from './PostFilter';
import PostList from './PostList';
import PostForm from './PostForm';

const SubApp = (
  {
    onClickPostFilterMy,
    onClickPostFilterOther,
    postFilterMyColor,
    postFilterOtherColor,
    current_user,
    deletePost,
    updatePost,
    addPos,
    showAddCircle,
    showOwnPost,
    ownPosts,
    otherPosts,
    addPost
  }
) => (
  <div>
    <PostFilter onClickPostFilterMy = {onClickPostFilterMy} onClickPostFilterOther = {onClickPostFilterOther} PostFilterMyColor={postFilterMyColor} PostFilterOtherColor={postFilterOtherColor} />
      { showOwnPost ?
        <PostList posts={ownPosts} current_user = {current_user} deletePost = {deletePost} updatePost = {updatePost}/>
        :
        <PostList posts={otherPosts} current_user = {current_user} deletePost = {deletePost} updatePost = {updatePost}/>
      }
    <PostForm path="/posts/new" onSubmit={addPost} showAddCircle={showAddCircle}/>
  </div>
)

export default SubApp;
