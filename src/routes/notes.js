const express = require('express');
const router = express.Router();
const Note = require('../models/Note');
const { isAuthenticated } = require('../helpers/auth');

router.get('/add', isAuthenticated , (req, res) => {
    res.render('notes/new-note')
});

router.post('/new-note', isAuthenticated, async (req, res) => {
    const { title, description } = req.body;
    const errors = [];
    if (!title) {
        errors.push({ text: "please write a title" });
    }
    if (!description) {
        errors.push({ text: "please write a description" });
    }
    if (errors.length > 0) {
        res.render('notes/new-note', {
            errors,
            title,
            description
        });
    } else {
        const newNote = new Note({ title, description });
        newNote.user = req.user.id;
        await newNote.save((err) => {
            if (err) {
                errors.push({ text: "error interno" });
            } else {
                req.flash('success_msg', 'Note Added Successfully');
                res.redirect('/notes');
            }
        });
    }
});

router.get('/', isAuthenticated, async (req, res) => {
    await Note.find({user : req.user.id}).sort({ date: 'desc' }).exec((err, notes) => {
        if (err) return console.log(err);
        res.render('notes/all-notes', { notes });
    });
});

router.get('/edit/:id', isAuthenticated, async (req, res) => {
    const { id } = req.params;
    await Note.findById(id, (err, note) => {
        if (err) return console.log(err);
        req.flash('success_msg', 'Note Updated Successfully');
        res.render('notes/edit-note', { note });
    });
});

router.put('/edit-note/:id', isAuthenticated, async (req, res) => {
    const { title, description } = req.body;
    const { id } = req.params;
    await Note.findByIdAndUpdate(id, { title, description }, (err) => {
        if (err) return console.log(err);
        res.redirect('/notes');
    });
});

router.delete('/delete/:id', isAuthenticated, async (req, res) => {
    const { id } = req.params;
    await Note.findByIdAndDelete(id, (err) => {
        if (err) return console.log(err);
        req.flash('success_msg', 'Note Deleted Successfully');
        res.redirect('/notes');
    })
});

module.exports = router;