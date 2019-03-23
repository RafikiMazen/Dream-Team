const express = require('express')
const mongoose = require('mongoose')
//const router = express.Router()

// Require Router Handlers
const form = require('./routes/api/form')
const user = require('./routes/api/user')


const app = express()

// DB Config
const db = require('./config/key').mongoURI

// Connect to mongo
mongoose
//process.env.mongouri
    .connect( db)
    .then(() => console.log('Connected to MongoDB'))
    .catch(err => console.log(err))
// Init middleware
app.use(express.json())
app.use(express.urlencoded({extended: false}))


// Entry point
app.get('/', (req,res) => res.send(`<h1>Person</h1>`))


// Direct to Route Handlers

app.use('/api/user', user)
app.use('/api/form',form)

app.use((req,res) => res.status(404).send(`<h1>Can not find what you're looking for</h1>`))

let port = process.env.PORT;
if (port == null || port == "") {
  port = 3000;
}
app.listen(port);
//Collapse


