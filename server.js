let path = require('path');
let express = require('express');
let app = express();
let bodyParser = require('body-parser');
let router = require('./routes/routes');
let session =require('express-session');
let mongoose = require('mongoose');
const fileUpload = require('express-fileupload');
const MongoStore = require('connect-mongo')(session);

app.use(express.static(path.resolve(__dirname, 'client')));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(fileUpload());


app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');
app.use(session({
  secret: 'my cats name again',
  resave: true,
  saveUninitialized: false,
  cookie: { 
    httpOnly: false, // key
    maxAge: null
  },
  store: new MongoStore({ mongooseConnection: mongoose.connection })
}));
app.use(router);

app.listen(process.env.PORT || 3000, process.env.IP || "0.0.0.0", () => {
  console.log('listening')
});
