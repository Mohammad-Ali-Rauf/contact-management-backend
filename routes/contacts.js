const express = require('express');
const router = express.Router();

// @route   GET api/contacts
// @desc    Get All Contacts
// @access  Private
router.get('/', (req, res) => {
    res.send('Get All Contacts')
});

// @route   POST api/contacts
// @desc    Add a Contact
// @access  Private
router.post('/', (req, res) => {
    res.send('Add a Contact')
});

// @route   PUT api/contacts/:id
// @desc    Update a contact
// @access  Private
router.put('/:id', (req, res) => {
    res.send('Update a Contact')
});

// @route   DELETE api/contacts/:id
// @desc    Delete a contact
// @access  Private
router.delete('/:id', (req, res) => {
    res.send('Delete a Contact')
});

module.exports = router;