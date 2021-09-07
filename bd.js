const ForerunnerDB = require("forerunnerdb");
const fdb = new ForerunnerDB();

const db = fdb.db("FCCCourse");

module.exports = db;