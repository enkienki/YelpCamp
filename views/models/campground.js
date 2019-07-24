import mongoose from 'mongoose'

// Set Campground Model
var campgroundSchema = new mongoose.Schema({
    name: String,
    image: String,
    description: String,
    comments: [
        {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Comment",
        }
    ],
})
var Campground = mongoose.model('campground', campgroundSchema)

export default Campground

