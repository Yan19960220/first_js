require('dotenv').config();

const express = require('express');
const morgan = require('morgan');
const twsRouter = require('./routes/web/tws');
const twsApiRouter = require('./routes/api/tws');
const path = require('path');
const connectDB = require('./middelwares/db')
const bodyParser = require('body-parser');
const exphbs = require('express-handlebars');
const moment = require('moment')

const app = express();
connectDB.connect();

app.use(morgan('dev'));
app.use(bodyParser.urlencoded({extended: false}));           
app.use(bodyParser.json());

app.engine('.hbs', exphbs({
    extname: '.hbs',
    defaultLayout: 'main',
    helpers: {
        formatDate: function (date, format) {
            return moment(date, "YYYYMMDD").fromNow();
        },
        isEmpty: (value) => {
            return value === '';
        },
        isNotEmpty: (value) => {
            return value !== '';
        }
    }
}));
app.set('view engine', '.hbs');

app.use(express.static(path.join(__dirname, 'public')));
app.use(express.static(__dirname + '/node_modules/jquery/dist'));
app.use(express.static(__dirname + '/node_modules/bootstrap/dist'));
app.use(express.static(__dirname + '/node_modules/l/fontawesome-free'));

app.use('/tws', twsRouter);
app.use('/api/tws', twsApiRouter);

app.get('/', function(req, res){
    res.send('It works!')
});

app.use((req, res, next) => {
    const error = new Error('not found!');
    error.status = 404;
    next(error);
});

app.listen(process.env.PORT, function(){
    console.log('Server running on localhost:' + process.env.PORT)
});