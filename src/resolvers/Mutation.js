import uuidv4 from 'uuid/v4'

const Mutation = {
  createUser(parent,args,{db,pubsub},info){
    const randomId = uuidv4()
    const emailTaken = db.users.some(user => user.email === args.data.email);
    if(emailTaken){
      throw new Error("Email Taken !")
    }

    const user = {
      id: randomId,
      ...args.data
    }
    db.users.push(user)
    pubsub.publish('user',{
      user: {
        mutation: 'CREATED',
        data: user
      }
    })
    return user;
  },
  updateUser(parent,{id,data},{db,pubsub},info){
    const {name,email} = data
    let user = db.users.find(u => u.id === id);
    if(!user){
      throw new Error("User Not Found")
    }

    user = {...user,name,email}
    pubsub.publish('user',{
      user: {
        mutation: 'UPDATED',
        data: user
      }
    })

    return user
  },
  deleteUser(parent,args,{db,pubsub},info){
    const userIndex = db.users.findIndex(user => user.id === args.id)
    if(userIndex === -1){
      throw new Error("User Not Found!")
    }
    const [user] = db.users.splice(userIndex,1);

    db.posts = db.posts.filter(post => {
      if(post.author !== args.id){
        post.comments = post.comments.filter(com => com.user !== args.id)
      }
      return post.author !== args.id
    })
    pubsub.publish('user',{
      user: {
        mutation: 'DELETED',
        data: user
      }
    })

    return user
  },
  createPost(parent,args,{db,pubsub},info){
    const randomId = uuidv4()
    const userExist = db.users.some(user => user.id === args.data.author);
    if(!userExist){
      throw new Error("User not found!")
    }
    const post = {
      id: randomId,
      ...args.data
    }
    db.posts.push(post);
    pubsub.publish('post',{
      post: {
        mutation: 'CREATED',
        data: post
      }
    })
    return post;
  },
  updatePost(parent,{id,data},{db,pubsub},info){
      let post = db.posts.find(p => p.id === id);
      if(!post){
        throw new Error("Post not found!")
      }
      const originalPost = {...post}

      if(typeof data.title === 'string'){
        post.title = data.title
      }

      if(typeof data.body === 'string'){
        post.body = data.body
      }

      if(typeof data.published === 'boolean'){
        post.published = data.published
        if(originalPost.published && !post.published){
          pubsub.publish('post',{
            post: {
              mutation: 'DELETED',
              data: post
            }
          })
        }else if(!originalPost.published && post.published){
           pubsub.publish('post',{
            post: {
              mutation: 'CREATED',
              data: post
            }
          })
        }
      }
      else if(post.published){
         pubsub.publish('post',{
          post: {
            mutation: 'UPDATED',
            data: post
          }
        })
      }

      return post
  },
  deletePost(parent,args,{db,pubsub},info){
    const match = db.posts.findIndex(post => post.id === args.id)
    if(match === -1){
      throw new Error("Post not found!")
    }
    const [post] = db.posts.splice(match,1);
    if(post.published){
      pubsub.publish('post',{
        post: {
          mutation: 'Deleted',
          data: post
        }
      })
    }
    return post
  },
  createComment(parent,args,{db,pubsub},info){
    const randomId = uuidv4()
    const userExist = db.users.some(user => user.id === args.data.user);
    const postExist = db.posts.some(post => post.id === args.data.postId && post.published)

    if(!userExist || !postExist){
      throw new Error("User or post not found!")
    }

    const comment = {
      id: randomId,
      ...args.data
    }

    db.posts.map(post => {
      if(post.id === args.data.postId){
        post.comments.push(comment)
        pubsub.publish(`comment ${args.data.postId}`,{
          comment: {
            mutation: 'CREATED',
            data: comment
          }
        })
      }
    })

    return comment;

  },
  updateComment(parent,{data},{db,pubsub},info){
    const {postId,commentId,body} = data
    const post = db.posts.find(p => p.id === postId);
    if(!post){
      throw new Error("Post not found")
    }
    const comIn = post.comments.findIndex(c => c.id === commentId);
    post.comments[comIn].body = body;
    const updatedComment = post.comments[comIn]
    pubsub.publish(`comment ${postId}`,{
      comment: {
        mutation: "UPDATED",
        data: updatedComment
      }
    })
    console.log(updatedComment);

    return updatedComment
  },
  deleteComment(parent,args,{db,pubsub},info){
    const match = db.posts.findIndex(post => post.id === args.postId)
    if(match === -1){
      throw new Error("Post not found!")
    }
    const matchComment = db.posts[match].comments.findIndex(com => com.id === args.commentId)
    if(matchComment === -1){
      throw new Error("Comment Not found!")
    }
    const comments = db.posts[match].comments.splice(matchComment,1);
    pubsub.publish(`comment ${args.postId}`,{comment: {mutation: "DELETED",data: comments[0]}})
    return comments[0]

  }
}

export default Mutation
