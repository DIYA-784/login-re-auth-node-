const mongoose = require('mongoose');

const postSchema = new mongoose.Schema({
    title: {
        type: String,
        required: [true, 'Title is required'],
        trim: true,
        minLength: [3, 'Title must be at least 3 characters long']
    },
    description: {
        type: String,
        required: [true, 'Description is required'],
        trim: true,
        minLength: [10, 'Description must be at least 10 characters long']
    },
    userId: {
        type: mongoose.Schema.Types.ObjectId,    // to reference the user who created the post
        ref: 'User',
        required: true
    }
},
{ 
    timestamps: true 
});

module.exports = mongoose.model('Post', postSchema);