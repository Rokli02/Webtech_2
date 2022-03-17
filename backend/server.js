const express = require('express'),
      mongoose = require('mongoose'),
      bodyParser = require('body-parser'),
      cors = require('cors')
      config = require('./Config');

const itemRoute = require('../backend/routes/item.router');
const userRoute = require('../backend/routes/user.router');

const app = express();

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({
    extended: false
}));
app.use(cors());

app.use('/item', itemRoute);
app.use('/user', userRoute)


mongoose.Promise = global.Promise;
mongoose.connect(config.databaseUrl, {
    useNewUrlParser: true,
    useUnifiedTopology: true
}).then(() => {
        console.log('Database succesfully connected!');
    },
    (error) => {
        console.log(`Database could not connect: ${error}`);
    }
)

const port = process.env.port || 4000;
const server = app.listen(port, () => {
    console.log(`Listening on port: ${port}`);
});