const express = require('express');
const mongoose = require('mongoose');
const router = express.Router();
const { ensureAuthenticated, ensureGuest } = require('../helpers/auth');
const Story = mongoose.model('stories');
const User = mongoose.model('users');

// Get stories index
router.get('/', (req, res) => {
    Story.find({status: 'public'})
    .populate('user') // Allows user info    
    .then(stories => {
            res.render('stories/index', {
                stories: stories
            });
        });
});

// Show single story (the story that is clicked)
router.get('/show/:id', (req, res) => {
    Story.findOne({
        _id: req.params.id    
    })
    .populate('user')
    .populate('comments.commentUser')
    .then(story => {
        res.render('stories/show', {
            story: story
        });
    });
});

// Get add story form
router.get('/add', ensureAuthenticated, (req, res) => {
    res.render('stories/add');
});

// Edit story form
router.get('/edit/:id', ensureAuthenticated, (req, res) => {
    Story.findOne({
        _id: req.params.id
    }).then(story => {
        res.render('stories/edit', {
            story: story
        });
    });
})

// Process add story 
router.post('/', (req, res) => {
    let allowComments;

    // Check if allowComments is checked or not
    if (req.body.allowComments) {
        allowComments = true;
    } else {
        allowComments = false;
    }

    // Construct story
    const newStory = {
        title: req.body.title,
        body: req.body.body,
        status: req.body.status,
        allowComments: allowComments,
        user: req.user.id
    }

    // Create story
    new Story(newStory).save().then(story => {
        res.redirect(`/stories/show/${story.id}`);
    });
});

// Edit form process
router.put('/:id', (req, res) => {
    Story.findOne({
        _id: req.params.id
    }).then(story => {
        let allowComments;

        if(req.body.allowComments) {
            allowComments = true;
        } else {
            allowComments = false;
        }

        // Set new values from edit
        story.title = req.body.title;
        story.body = req.body.body;
        story.status = req.body.status;
        story.allowComments = allowComments;

        story.save().then(story => {
            res.redirect('/dashboard');
        });
    });
});

// Delete form process
router.delete('/:id', (req, res) => {
    Story.remove({_id: req.params.id})
        .then(() => {
            res.redirect('/dashboard');
        });
});

// Add comment
router.post('/comment/:id', (req, res) => {
    Story.findOne({
        _id: req.params.id
    }).then(story => {
        const newComment = {
            commentBody: req.body.commentBody,
            commentUser: req.user.id
        }

        // Add comments to comment array ~ Add to beginning array (so it appears at top)
        story.comments.unshift(newComment);
        story.save().then(story => {
            res.redirect(`/stories/show/${story.id}`);
        })
    });
});

module.exports = router;