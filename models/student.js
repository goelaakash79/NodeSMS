let mongoose = require("mongoose");

let studentSchema = new mongoose.Schema({
    name: String,
    email: String,
    mobile: String
});

module.exports = mongoose.model("User", studentSchema);
