const express = require('express');
const router = express.Router();
const { check, validationResult } = require('express-validator');
const auth = require('../middleware/auth');

const User = require("../models/User");
const Contact = require("../models/Contact");

// @route   GET api/contacts
// @desc    Get All Contacts
// @access  Private
router.get('/', auth, async (req, res) => {
    try {
        const contacts = await Contact.find({ user: req.user.id }).sort({
            date: -1
        });
        res.json(contacts);
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error');
    }
});

// @route   POST api/contacts
// @desc    Add a Contact
// @access  Private
router.post('/', [ auth, [
    check('name', 'Name is Required').not().isEmpty(),
] ], async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const { name, email, phone, relationship } = req.body;

    try {
        const newContact = new Contact({
            name,
            email,
            phone,
            relationship,
            user: req.user.id
        })

        const contact = await newContact.save();

        res.json(contact);

    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error')
    }
});

// @route   PUT api/contacts/:id
// @desc    Update a contact
// @access  Private
router.put('/:id', auth, async (req, res) => {

    const { name, email, phone, relationship } = req.body;

    const contactDetails = {  };

    if(name) contactDetails.name = name;
    if(email) contactDetails.email = email;
    if(phone) contactDetails.phone = phone;
    if(relationship) contactDetails.relationship = relationship;

    try {
        let contact = await Contact.findById(req.params.id);

        if(!contact) return res.status(404).json({ msg: 'Contact not exists' })

        if(contact.user.toString() !== req.user.id) {
            return res.status(401).json({ msg: 'You do not have access to update this contact' })
        }

        // Update contact
        contact = await Contact.findByIdAndUpdate(req.params.id,
            { $set: contactDetails }, 
            { new: true }
        );

        res.json({ contact });

    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error');
    }

});

// @route   DELETE api/contacts/:id
// @desc    Delete a contact
// @access  Private
router.delete('/:id', auth, async (req, res) => {

    try {
        let contact = await Contact.findById(req.params.id);

        if(!contact) return res.status(404).json({ msg: 'Contact not exists' })

        if(contact.user.toString() !== req.user.id) {
            return res.status(401).json({ msg: 'You do not have access to delete this contact' })
        }

        // Delete contact
        await Contact.findByIdAndRemove(req.params.id);

        res.json({ msg: 'Contact Deleted Successfully' });

    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error');
    }

})

module.exports = router;