const express = require('express')
const mongoose = require('mongoose')
require('dotenv').config()
const path = require('path')
const cors  = require('cors')

const app = express()

mongoose.connect(process.env.MONGODB_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
});

const db = mongoose.connection

db.on("error", (err) => console.log(`Error connecting to database: ${err.message}`))
db.once('open', ()=>{
    console.log('Connected to Database!')
})
// const userRoutes = require('./routes/user_routes')
// app.use('/',userRoutes)


app.use((err, req, res, next)=>{
    console.log(err);
    res.status(500).send('error occured ,check it out')
})

app.use(express.json())
app.use(express.urlencoded({ extended: true }))
app.use(cors({
    origin: 'http://localhost:5173',
    methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE'],
    credentials: true
}))

app

app.get('/', (req, res) => {
    console.log("sever started");
    res.send("server started")
})

console.log(process.env.MONGODB_URL);
let port = process.env.PORT || 5000
console.log(port);
app.listen(port, (req, res) => {
    console.log(`server running at the port ${port}`);
})
