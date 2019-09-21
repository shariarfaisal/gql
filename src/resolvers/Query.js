
const Query = {
  users(parent,args,{db},info){
    return db.users;
  },
  posts(parent,args,{db},info){
    if(!args.query){
      return db.posts;
    }
    return db.posts.filter(i => {
      return i.title.toLowerCase().includes(args.query.toLowerCase())
    })
  }
}

export default Query
