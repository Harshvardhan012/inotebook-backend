const express = require('express');
const { model } = require('mongoose');
const fetchuser = require('../middleware/fetchuser');
const router = express.Router();
const Notes = require('../models/Notes');
const { body, validationResult } = require('express-validator');



// Route 1 : This is used for fetch all Notes
router.get('/fetchallnotes', fetchuser, async (req, res) => {
    try {
        const notes = await Notes.find({ user: req.user.id })
        return res.json(notes);
    } catch (error) {
        console.error(error);
        return res.status(500).send("Some Error Occured");
    }
});


// Route 2 : This is used for adding Notes
router.post('/addnote', fetchuser,
    // To Give Condition Validation 
    [body('title', 'title is Too Short').isLength({ min: 3 }),
    body('description', 'description is Too Short').isLength({ min: 3 }),
    ], async (req, res) => {
        const errors = validationResult(req);
        // IF an Error is occured in validation return an error an bad request
        if (!errors.isEmpty()) {
            return res.status(400).json({ errors: errors.array() });
        }
        try {
            const note = await Notes.create({
                title: req.body.title,
                description: req.body.description,
                tag: req.body.tag,
                user: req.user.id
            });
            return res.json(note);
            // console.log("hello");
        } catch (error) {
            // console.log(req.user.id);
            console.error(error);
            return res.status(500).send("Some Error Occured");
        }
    });


// Route 3 : This is used for updating Notes
router.put('/updatenote/:id', fetchuser, async (req, res) => {
    try {
        const { title, description, tag } = req.body;

        const newnote = {};
        // To check User wants to update which details
        if (title) { newnote.title = title; }
        if (description) { newnote.description = description; }
        if (tag) { newnote.tag = tag; }
        let note;

        // To match Id from Path and Id's present in Notes 
        try {
            note = await Notes.findById(req.params.id);
        } catch (error) {
            return res.status(400).send("Id Not Found")
        }

        // If id is mismatch from path/url and user id 
        if (note.user.toString() !== req.user.id) {
            return res.status(401).send("Your Not Allowed To Update Notes")
        };

        // To update the Notes 
        try {
            note = await Notes.findByIdAndUpdate(req.params.id, { $set: newnote }, { new: true });
            return res.json(note);
        }
        catch (error) {
            return res.status(500).send("Some Error Occured");
        }
    }
    catch (error) {
        return res.status(500).send("Some Error Occured");
    }
});


// Route 4 : This is used for Delete Notes
router.delete('/deletenote/:id', fetchuser, async (req, res) => {
    try {
        let note;
        // To match Id from Path and Id's present in Notes 
        try {
            note = await Notes.findById(req.params.id);
        } catch (error) {
            return res.status(400).send("Id Not Found");
        }

        // If id is mismatch from path/url and user id 
        if (note.user.toString() !== req.user.id) {
            return res.status(401).send("Your Not Allowed To Update Notes")
        };

        try {
            note = await Notes.findByIdAndDelete(req.params.id);
            return res.json({ "Success": "Note has been Deleted", });
        }
        catch (error) {
            console.error(error);
            return res.status(500).send("Some Error Occured");
        }
    }
    catch (error) {
        console.error(error);
        return res.status(500).send("Some Error Occured");
    }


});
module.exports = router;

