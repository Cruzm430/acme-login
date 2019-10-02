const Sequelize = require('sequelize');
const conn = new Sequelize('postgres://localhost/login_db')
const {STRING, UUID, UUIDV4} = Sequelize

const User = conn.define('user', {
  id:{
    type: UUID,
    defaultValue:UUIDV4,
    primaryKey:true
  },
  email:{
    type:STRING,
    allowNull:false,
    validate:{
      isEmail:true
    }
  },
  password:{
    type:STRING,
    allowNull:false
  }
})

const syncAndSeed = async() =>{
  await conn.sync({force:true});
  const users = [
    {
      email: 'moe@ad.com',
      password: 'foo'
    },
    {
      email: 'lucy@an.com',
      password: 'bar'
    }
  ]
  const [moe, lucy] = await Promise.all(users.map(user=>User.create(user)))
  return [moe, lucy]
}

module.exports={
  syncAndSeed,
  User
}