import mongoose from 'mongoose'

//Set comments model
var commentSchema = new mongoose.Schema({
    text: String,
    author: String,
    created: {type: Date, default: Date.now}
})

var Comment = mongoose.model('Comment', commentSchema)

export default Comment