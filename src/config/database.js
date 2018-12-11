const mongoose = require('mongoose');
const URL = 'mongodb://localhost/notes-db-app';

mongoose.connect(URL, {
    useCreateIndex: true,
    useNewUrlParser: true,
    useFindAndModify: false
}).then((db) => {
    console.log('DB is connect');
}).catch((err) => console.log(err));