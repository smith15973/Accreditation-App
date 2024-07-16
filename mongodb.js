const mongoose = require('mongoose');
const dbURL = process.env.DB_URL || 'mongodb://localhost:27017/accreditationApp';

mongoose.connect(dbURL);

const db = mongoose.connection;
db.on("error", console.error.bind(console, "connection error:"));
db.once("open", () => {
    console.log("Database connected");
});



module.exports = {db, dbURL};
