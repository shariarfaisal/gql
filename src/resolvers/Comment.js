
const Comment = {
  user(parent,args,{db},info){
    return db.users.find(user => {
      return user.id === parent.user
    })
  }
}

export default Comment
