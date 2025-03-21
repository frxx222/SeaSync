import express from 'express';
import bodyParser from 'body-parser';
import cors from 'cors';
import 'dotenv/config';
import morgan from 'morgan';
import helmet from 'helmet';
import connect from './database/conn.js';
import userRoutes from './router/userRoutes.js'
import mongoose from 'mongoose';
// import generalRoutes from './router/generalRoutes.js'
import marketRoutes from './router/marketRoutes.js'
import permitRoutes from './router/permitRoutes.js'
import supplyRoutes from './router/statsRoutes.js'
import authRoutes from './router/auth.js'
import invoiceRoutes from './router/invoiceRoutes.js'
import demandRoutes from './router/demandRoutes.js'
import {dataMarket} from './data/index.js'
import MarketModel from './models/Market.model.js';
// import PermitModel from './models/Permit.model.js';
// import {permit} from './data/index.js'

const app = express();

// middleware
app.use(express.json());

app.use(helmet());
app.use(helmet.crossOriginResourcePolicy({policy: "cross-origin"}));
app.use(morgan("common"));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false}));


app.use(cors({
    origin: 'http://localhost:5173', // Replace with your frontend URL
    methods: 'GET,HEAD,PUT,PATCH,POST,DELETE',
    credentials: true, // Allow credentials (cookies, authorization headers, etc.)
}));

  

  

//ROUTES
// app.use('/dashboard', generalRoutes)

app.use('/api', marketRoutes)
app.use('/api', userRoutes)
app.use('/api', permitRoutes)
app.use('/api', supplyRoutes)
app.use('/api', invoiceRoutes)
app.use('/api', authRoutes)
app.use('/api', demandRoutes)

app.use((req, res, next) => {
    console.log(`${req.method} request to ${req.url}`);
    next();
});





app.get('/', (req, res) => {
    res.status(201).json("Home Get Request");
});

// connect().then(() => {
//     try {
//         app.listen(PORT, () => {
//             console.log(`Server connected to http://localhost:${PORT}`);
//         })
//     } catch (error) {
//         console.log("Cannot connect to the server")
//     }
// }).catch(error => {
//     console.log("Invalid Database Connection")
// })

const PORT = process.env.PORT || 3000;
mongoose.connect(process.env.MONGO_URI, {
    useNewUrlParser:true,
    useUnifiedTopology:true,
}).then(() => {
    app.listen(PORT, () => console.log(`Server connected to http://localhost:${PORT}`))
    // MarketModel.insertMany(dataMarket)
    // PermitModel.insertMany(permit)
}).catch((error) => console.log(`${ error } did not connect`))


