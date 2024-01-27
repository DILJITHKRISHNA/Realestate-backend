import express from "express";
import mongoose from "mongoose";
import env from "dotenv";
import cors from "cors";
import UserRoute from './routes/user_routes.js';
import OwnerRoute from './routes/owner_route.js'
import AdminRoute from './routes/admin_route.js'

env.config();
const app = express();

app.use(cors({
    origin: 'http://localhost:5173',
    methods: ["GET", "POST", "PUT", "PATCH", "DELETE"],
    credentials: true,
}));

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

mongoose.connect(process.env.MONGODB_URI).then(() => console.log("Database is successfully connected!"))
    .catch((error) => console.log("Error while connecting to the database"));

app.use('/', UserRoute);
app.use('/owner', OwnerRoute)
app.use('/admin', AdminRoute)

app.use((err, req, res, next) => {
    console.log(err);
    res.status(500).send('Error occurred, check it out');
});

app.get('/', (req, res) => {
    console.log("Server started");
    res.send("Server started");
});

const port = process.env.PORT || 5000;
app.listen(port, () => {
    console.log(`Server running at the port ${port}`);
});
