import mongoose from 'mongoose'

//Set comments model
var commentSchema = new mongoose.Schema({
    text: String,
    author: String,
})

var Comment = mongoose.model('Comment', commentSchema)

export default Comment