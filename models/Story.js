const mongoose = require('mongoose');
const Schema = mongoose.Schema;

// Create schema for story
const StorySchema = new Schema({
    title: {
        type: String,
        required: true
    }, 
    body: {
        type: String, 
        required: true
    },
    status: {
        type: String, 
        default: 'public'
    }, 
    allowComments: {
        type: Boolean,
        default: true
    }, 
    comments: [{
        commentBody: {
            type: String,
            require: true
        }, 
        commentDate: {
            type: Date,
            default: Date.now
        }, 
        commentUser: {
            type: Schema.Types.ObjectId, // Related to objectID from other reference model
            ref: 'users'
        }
    }],
    user: {
        // Allows access to all the user model information 
        type: Schema.Types.ObjectId,
        ref: 'users' 
    },
    date: {
        type: Date, 
        default: Date.now
    }
});

// Create collections and add Story schema to mongoose
mongoose.model('stories', StorySchema, 'stories'); // 3rd param specifies the name of the collection