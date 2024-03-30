import express from "express";
import mongoose from "mongoose";
import env from "dotenv";
import cors from "cors";
import UserRoute from './routes/user_routes.js';
import OwnerRoute from './routes/owner_route.js'
import AdminRoute from './routes/admin_route.js'
import ChatRoute from './routes/chat_route.js'
import MessageRoute from './routes/message_route.js'
import { app, server } from './Socket/Socket.js'
env.config();

app.use(cors({
    origin: 'https://varlet-frontend.vercel.app',
    methods: ["GET", "POST", "PUT", "PATCH"],
    credentials: true,
}));

app.use(express.json({ limit: '50mb' }));
app.use(express.urlencoded({ extended: true, limit: '50mb' }));

mongoose.connect(process.env.MONGODB_URI).then(() => console.log("Database is successfully connected!"))
    .catch((error) => console.log("Error while connecting to the database"));

//----------------------------------Routes------------------------------//

app.use('/', UserRoute);
app.use('/owner', OwnerRoute)
app.use('/admin', AdminRoute)
app.use('/chat', ChatRoute)
app.use('/message', MessageRoute)

app.use((err, req, res, next) => {
    console.log(err);
    res.status(500).send('Error occurred, check it out');
});

//----------------------------------Server------------------------------//

const port = process.env.PORT || 5000;
server.listen(port, () => {
    console.log(`Server running at the port ${port}`);
});
