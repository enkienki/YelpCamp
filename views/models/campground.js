import mongoose from 'mongoose'

// Set Campground Model

var campgroundSchema = new mongoose.Schema({
    name: String,
    image: String,
    price: Number,
    description: String,
    comments: [
        {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Comment",
        }
    ],
    author: {
        id: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'user',
        },
        username: String,  
    },
})
var Campground = mongoose.model('campground', campgroundSchema)

export default Campground

