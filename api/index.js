const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const cookieParser = require('cookie-parser');
const session = require('express-session');
const MongoStore = require('connect-mongo');
const isLoggedIn = require('./middlewares/isLoggedIn');
const isService = require('./middlewares/isService');
const app = express();

const corsOptions =  {
    origin: process.env.FRONTEND_URL,
    credentials: true
};

app.use(session({
    name: 'IntraWatcher.sid',
    secret: process.env.SESSION_SECRET,
    httpOnly: true,
    secure: true,
    maxAge: 1000 * 60 * 60 * 7,
    resave: false,
    saveUninitialized: true,
    store: MongoStore.create({
        mongoUrl: process.env.MONGO_URI
    })
}));

app.use(cors(corsOptions));
app.use(cookieParser());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

app.use('/auth', require('./routes/auth'));
app.use('/exams', isLoggedIn, require('./routes/exams'));
app.use('/users', isLoggedIn, require('./routes/users'));
app.use('/logs', isLoggedIn, require('./routes/logs'));
app.use('/services', isService, require('./routes/services'));

app.get('/me', isLoggedIn, async (req, res) => {
	return res.status(200).send(req.user);
});

app.listen(3000, () => {
    console.log(`Server is running on 3000`);
});
