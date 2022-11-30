const fs = require('fs');
//var md5 = require('md5');
var util = require('util');
const crypto = require('crypto');
const express = require('express');
const { ApolloServer, UserInputError } = require('apollo-server-express');
const { GraphQLScalarType } = require('graphql');
const { GraphQLEnumType } = require('graphql');
const { Kind } = require('graphql/language');
const { MongoClient } = require('mongodb');
const { Settings } = require('react-feather');

const url = 'mongodb://localhost/planner';
var ObjectId = require('mongodb').ObjectID;

let db

const GraphQLDate = new GraphQLScalarType({
    name: 'GraphQLDate',
    description: 'A Date() type in GraphQL as a scalar',
    serialize(value) {
      return value.toISOString();
    },
    parseValue(value) {
      const dateValue = new Date(value);
      return isNaN(dateValue) ? undefined : dateValue;
    },
    parseLiteral(ast) {
      if (ast.kind == Kind.STRING) {
        const value = new Date(ast.value);
        return isNaN(value) ? undefined : value;
      }
    },
  });

const ColorType = new GraphQLEnumType({
  name:'ColorType',
  values: {
    indigo: {
        value: 0,
    },
    blue: {
        value: 1,
    },
    red: {
        value: 2,
    },
    green: {
      value: 3,
    },
    pink: {
        value: 4,
    },
    brown: {
        value: 5,
    },
    orange: {
      value: 6,
    },
  },

  });

const resolvers = {
  Query: {
    getAllEvents,
    getAllNotes,
    getAllTasks,

  },
  Mutation: {
    //User
    register,
    login,
    verifyUser,

    // //Event
    addOneEvent,
    updateOneEvent,
    deleteOneEvent,
    addOneNote,
    updateOneNote,
    deleteOneNote,
    addOneTask,
    updateOneTask,
    deleteOneTask,


    // //Setting
    // updateAccentColor,

  },
  GraphQLDate,
};



// register
async function register(_, {registerUser}) {
  fname = registerUser.fname
  lname = registerUser.lname
  email = registerUser.email
  username = registerUser.username
  plainPassword = registerUser.password
  avatar = registerUser.avatar



  try {
    //check if user already exist
    const hit = await db.collection('users').find({username: username}).count();
      if (hit>0) {
        return { message: "This user has already been registered."};
      }

      //check if the username has been used by others
      else if (await db.collection('users').find({username:username}).count() > 0){
        return {message: "This username has been used."};
      }

    registerUser.createDate = Date.now().toString();
    registerUser.salt = util.format('%d', Math.ceil(Math.random()*10000))
    const saltPassword = plainPassword + registerUser.salt
    let md5 = crypto.createHash("md5");
    let newPassword = md5.update(saltPassword).digest("hex");
    registerUser.password = newPassword;
    // TODO TOKEN
    // registerUser.token = util.format('%d', Math.ceil(Math.random()*10000))

    await db.collection('users').insertOne(registerUser);
    const user = await db.collection('users').findOne({username:username});
    return {_id: user._id, fname: user.fname, lname: user.lname, email: user.email, username: user.username, bio: user.bio, avatar: user.avatar, createDate: user.createDate, phone: user.phone}

  } catch(err) {
      console.error(error);
      return {message: "Server Error"};
  }

};

async function verifyUser(_, {username}) {
  const user = await db.collection('users').findOne({username: username});
  return {_id: user._id, fname: user.fname, lname: user.lname, email: user.email, username: user.username, bio: user.bio, avatar: user.avatar, createDate: user.createDate, phone: user.phone}
}



async function login(_, {userInfo}) {
  username = userInfo.username
  plainPassword = userInfo.password
  //check whether the password matched
  const exist = await db.collection('users').find({username:username}).count();
  // console.log("the existing username count is:", exist)
  if (exist == 0 ) {
    
    return {message: "Invalid User"};
  }

  const user = await db.collection('users').findOne({username:username});
  const salt = user.salt
  const saltPassword = plainPassword + salt

  let md5 = crypto.createHash("md5");
  let hashedPassword = md5.update(saltPassword).digest("hex");
  if (hashedPassword != user.password) {
    
    return {message: "Incorrect Password"};
  }
    
  return {_id: user._id, fname: user.fname, lname: user.lname, email: user.email, username: user.username, bio: user.bio, avatar: user.avatar, createDate: user.createDate, phone: user.phone}

  

}

// TODO token expire time 

async function getAllEvents(_, {user}){
  const events = await db.collection('events').find({'user': user}).toArray();
  return events; 
}

async function addOneEvent(_, {event}){
  const result = await db.collection('events').insertOne(event);
  // console.log('result in addOneEvent in server.js',result)
  const savedEvent = await db.collection('events').findOne({_id: result.insertedId});
  return savedEvent; 
}
async function updateOneEvent(_, {event, eid}){
  const result = await db.collection('events').updateOne({_id: ObjectId(eid)},{$set:event});
  const savedEvent = await db.collection('events').findOne({_id: ObjectId(eid)});
  return savedEvent; 
}
async function deleteOneEvent(_, {eid}){
  const result = await db.collection('events').deleteOne({_id:ObjectId(eid)})
  console.log('result from deleteOneEvent in server.js',result)
  if (result.deletedCount ==1){
    return true
  }else{
    return false
  }
}

async function getAllNotes(_, {user}){
  const notes = await db.collection('notes').find({'user': user}).toArray();
  return notes; 
}
async function addOneNote(_, {note}){
  const result = await db.collection('notes').insertOne(note);
  // console.log('result in addOneEvent in server.js',result)
  const savedNote = await db.collection('notes').findOne({_id: result.insertedId});
  return savedNote; 
}
async function updateOneNote(_, {note, nid}){
  const result = await db.collection('notes').updateOne({_id: ObjectId(nid)},{$set:note});
  const savedNote = await db.collection('notes').findOne({_id: ObjectId(nid)});
  return savedNote; 
}
async function deleteOneNote(_, {nid}){
  const result = await db.collection('notes').deleteOne({_id:ObjectId(nid)})
  console.log('result from deleteOneNote in server.js',result)
  if (result.deletedCount ==1){
    return true
  }else{
    return false
  }
}

async function getAllTasks(_, {user}){
  const tasks = await db.collection('tasks').find({'user': user}).toArray();
  return tasks; 
}
async function addOneTask(_, {task}){
  const result = await db.collection('tasks').insertOne(task);
  // console.log('result in addOneEvent in server.js',result)
  const savedTask = await db.collection('tasks').findOne({_id: result.insertedId});
  return savedTask; 
}
async function updateOneTask(_, {task, tid}){
  const result = await db.collection('tasks').updateOne({_id: ObjectId(tid)},{$set:task});
  const savedTask = await db.collection('tasks').findOne({_id: ObjectId(tid)});
  return savedTask; 
}
async function deleteOneTask(_, {tid}){
  const result = await db.collection('tasks').deleteOne({_id:ObjectId(tid)})
  console.log('result from deleteOneNote in server.js',result)
  if (result.deletedCount ==1){
    return true
  }else{
    return false
  }
}


async function connectToDb() {
  const client = new MongoClient(url, { useNewUrlParser: true });
  await client.connect();
  console.log('Connected to MongoDB at', url);
  db = client.db();
}

const server = new ApolloServer({
  typeDefs: fs.readFileSync('./server/schema.graphql', 'utf-8'),
  resolvers,
  formatError: error => {
    console.log(error);
    return error;
  },
});


const app = express();

app.use(express.static('public'));

server.applyMiddleware({ app, path: '/graphql' });

(async function () {
  try {
    await connectToDb();
    app.listen(8000, function () {
      console.log('App started on port 8000');
    });
  } catch (err) {
    console.log('ERROR:', err);
  }
})();