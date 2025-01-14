const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const cookieParser = require('cookie-parser');
const session = require('express-session');
const MongoStore = require('connect-mongo');
const isLoggedIn = require('./middlewares/isLoggedIn');
const isStaff = require('./middlewares/isStaff');
const Exams = require('./models/Exams');
const { populate } = require('./models/Users');
const app = express();

const corsOptions =  {
    origin: 'http://localhost:3001',
    credentials: true
};

app.use(session({
    name: 'IntraWatcher.sid',
    secret: process.env.SESSION_ID,
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
app.use('/logs', isLoggedIn, isStaff, require('./routes/logs'));

app.get('/me', isLoggedIn, async (req, res) => {
    const exams = await Exams.find({ watchers: req.user._id, is_archived: true  }).populate('watchers').sort({ start_at: -1 });
	return res.status(200).send(req.user);
});

app.listen(3000, () => {
    console.log('Server is running on http://localhost:3000');
});