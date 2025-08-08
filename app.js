import 'dotenv/config';
import express from 'express';
import { engine } from 'express-handlebars';
import methodOverride from 'method-override';
import userRoutes from './server/routes/user.js';
import pool from "./config/db.js";
import session from 'express-session';

// Express 
const app = express();
const port = process.env.PORT || 5000;

app.use(methodOverride('_method'));

// Middlewaer
app.use(express.static('public')); 
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.engine('hbs', engine({ extname: '.hbs' }));
app.set('view engine', 'hbs');

app.use(session({
    secret: 'a-very-long-and-random-secret-key-change-me', 
    resave: false,
    saveUninitialized: false, 
    cookie: { secure: false } 
}));

app.engine('hbs', engine({ 
    extname: '.hbs',
    helpers: {
        eq: function (a, b) {
            return a === b;
        },
        neq: function (a, b) {
            return a !== b;
        }
    }
}));

app.use('/', userRoutes);

const startServer = async () => {
  try {
    await pool.query('SELECT 1');
    console.log(' MySQL Connected successfully');
    app.listen(port, () => console.log(` Server is running at http://localhost:${port}`));
  } catch (error) {
    console.error(' Failed to connect to MySQL:', error);
    process.exit(1); 
    }
};

startServer();