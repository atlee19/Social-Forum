import React from "react";
import ReactDOM from "react-dom";
import Card from 'react-bootstrap/Card'
import Container from 'react-bootstrap/Container';
import Button from 'react-bootstrap/Button';
import { LinkContainer } from 'react-router-bootstrap'
import { Link } from 'react-router-dom';
import io from 'socket.io-client';
require('../css/feedstyle.css');

var socket = io(); //the fact that this a global could be an issue but lets call disconnect first

function ContentCard(props){
  return(
    <Card id="content-card">
      <Card.Body>{props.postContent}</Card.Body>
      <ViewMore reqId={props.reqId} getPostId={props.getPostId}/>
    </Card>
  );
}
 //is there anything in index tho??
function ViewMore(props){
  return(
    <Link to={`/viewpost/${props.reqId}`}>
      <Button variant="success" id="view-btn" onClick={props.getPostId}>View post</Button>
    </Link>
  );
}


export default class Feed extends React.Component{
  state = {
    posts : [
      {
        id : 0,
        content : 'Not found'
      }
    ]
  };

  fetchPosts(){
    socket.emit('fetch-posts')
    socket.on('load-posts', (data) =>
      this.setState({ posts: data })
    )
  }

  componentWillMount(){
    this.fetchPosts();
  }

  componentDidMount(){
    let newPost;
    socket.on('update', (newData) => {
        if (newData != undefined) {
          newPost = this.state.posts.concat(newData)
          this.setState({ posts : newPost })
        }
      }
    )
  }

  componentWillUnmount(){
    socket.removeAllListeners();
  }

  getPostId(postId){
    let idNumber = postId;
    socket.emit('post-id', postId)
  }
  //we technically dont have to use index
  render(){
    return(
      this.state.posts.map(post =>
        <ContentCard
          postContent={post.content}
          key={post.id.toString()}
          reqId={post.id}
          getPostId = {this.getPostId.bind(this, post.id)}
        />,
      )
    );
  }
}
