
const Subscription = {
  comment:{
    subscribe(parent,{postId},{db,pubsub},info){
      const post = db.posts.find(p => p.id === postId && p.published)
      if(!post){
        throw new Error("Post not found!")
      }

      return pubsub.asyncIterator(`comment ${postId}`)
    }
  },
  post: {
    subscribe(parent,urgs,{pubsub},info){
      return pubsub.asyncIterator('post')
    }
  },
  user: {
    subscribe(parent,urgs,{pubsub},info){
      return pubsub.asyncIterator('user')
    }
  }
}

export default Subscription
