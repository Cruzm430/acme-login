const express = require('express');
const app = express();
app.use(express.json());
const path = require('path');
const db = require('./db');
const {syncAndSeed, User} = db

app.use(require('express-session')({
  secret: process.env.SECRET 
}));
const port = process.env.PORT || 5000;

syncAndSeed()
.then(()=>app.listen(port, ()=> console.log(`listening on port ${port}`)));

// const users = {
//   moe: {
//     id: 1,
//     name: 'moe',
//     favoriteWord: 'foo'
//   },
//   lucy: {
//     id: 2,
//     name: 'lucy',
//     favoriteWord: 'bar'
//   }
// };

app.use('/dist', express.static(path.join(__dirname, 'dist')));

app.post('/api/sessions', async(req, res, next)=> {
  const user = await User.findOne({where:{email:req.body.email}})
  if(user && user.password === req.body.password){
    req.session.user = user;
    return res.send(user);
  }
  next({ status: 401 });
});

app.get('/api/sessions', (req, res, next)=> {
  const user = req.session.user; 
  if(user){
    return res.send(user);
  }
  next({ status: 401 });
});

app.delete('/api/sessions', (req, res, next)=> {
  req.session.destroy();
  res.sendStatus(204);
});

app.get('/', (req, res, next)=> {
  res.sendFile(path.join(__dirname, 'index.html'));
});
