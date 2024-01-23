import express from "express"
import mongoose from "mongoose"
import env from "dotenv"
import cors from "cors"
env.config()
const app = express()

mongoose.connect(process.env.MONGODB_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
}).then(()=>console.log("Database is successfully connected!"))
.catch((error)=>console.log("Error while connecting to database"))


import UserRoute from './routes/user_routes.js'
app.use('/', UserRoute)


app.use((err, req, res, next) => {
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


app.get('/', (req, res) => {
    console.log("sever started");
    res.send("server started")
})

let port = process.env.PORT || 5000
app.listen(port, (req, res) => {
    console.log(`server running at the port ${port}`);
})
