db.users.remove({});
db.events.remove({});
db.notes.remove({});
db.tasks.remove({});

const curDate = new Date(Date.now())
curdate = curDate.toISOString().split('T')[0]
curtime = curDate.toLocaleTimeString()

const initialEvents =[
    {
        user: "a01",
        title: "Lisa's Birthday",
        description: "Lisa's birthday",
        date: curdate,
        time: curtime,
        type: 'Appointment',
        link: '',
        trashed:false

    },
    {
        user: "a01",
        title: "Jamie's Birthday",
        description: "Jamie twin birthday",
        date: curdate,
        time: curtime,
        type: 'Appointment',
        link: '',
        trashed:false


    }
]

const usersDB = [
    {
      fname: 'Michael', 
      lname: 'Chen', 
      email: 'michaelchen@163.com',
      username: 'michael',
      password: 'b58d0d8adce0842c5d1b805402fda6a2',
      salt: 'aaa',
      token: 'dfghjkl',
      avatar: 'ssaaa',
      createDate: curDate.toISOString().split('T')[0] + curDate.toISOString().split('T')[1]
    }
  ];
  
  const initialNotes =[
    {
        user: "a01",
        title: "Shopping List",
        content: "Apples, Bananas, Carrots",
        image: -1,
        color: "blue-grey",
        archived: false,
        trashed:false,
        pinned: true

    },
    {
      user: "a01",
      title: "Lecture Notes",
      content: "IT5007 MERN stack...",
      image: 3,
      color: "light-blue",
      archived: false,
      trashed:false,
      pinned: false
  }
]

const initialTasks =[
  {
      user: "a01",
      title: "Workout",
      description: "Upper Body Workout",
      date: "",
      color: "blue-grey",
      done: false,
      trashed:false,
  },
  {
    user: "a01",
    title: "Second Workout",
    description: "Lower Body Workout",
    date: "",
    color: "blue-grey",
    done: false,
    trashed:false,
}
]

db.users.insertMany(usersDB);
db.events.insertMany(initialEvents);
db.notes.insertMany(initialNotes)
db.tasks.insertMany(initialTasks)

print('Inserted', db.events.count(), 'events')
print('Inserted:', db.notes.count(), 'notes.')
print('Inserted:', db.tasks.count(), 'tasks.')
print('Inserted:', db.users.count(), 'users.')