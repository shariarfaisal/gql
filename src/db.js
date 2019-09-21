let users = [
  {id: '1',name: 'Faisal',email: 'faisal@gmail.com'},
  {id: '2',name: 'Farhad',email: 'farhad@gmail.com'},
  {id: '3',name: 'Arafat',email: 'arafat@gmail.com'},
]

let comments = [
  {id:'1',user:'1',body: 'nice picture'},
  {id:'2',user:'2',body: 'awesome '},
  {id:'3',user:'1',body: 'gourgious'},
  {id:'4',user:'3',body: 'wow'},
  {id:'5',user:'3',body: 'cool'},
  {id:'6',user:'2',body: 'joss'}
]

let posts = [
  {
    id: '1245',
    title: 'This is title',
    body: 'there will be body',
    published: true,
    author: '1',
    comments: comments
  },
  {
    id: '1246',
    title: 'This is title',
    body: 'there will be body',
    published: true,
    author: '1',
    comments: comments
  },
  {
    id: '1247',
    title: 'This is title',
    body: 'there will be body',
    published: true,
    author: '2',
    comments: comments
  }
]

const db = {
  users,
  comments,
  posts
}

export default db
