const Contact = require('../models/contact');

exports.saveContact = async (req, res) => {
  const { name, email, subject, message } = req.body;

  const contact = new Contact({
    name,
    email,
    subject,
    message,
  });

  try {
    const newContact = await contact.save();
    res.status(201).json(newContact);
  } catch (err) {
    console.error('Error saving contact:', err);
    res.status(400).json({ message: err.message });
  }
};

exports.getAllContacts = async (req, res) => {
  try {
    const contacts = await Contact.find();
    res.json(contacts);
  } catch (err) {
    console.error('Error fetching contacts:', err);
    res.status(500).json({ message: err.message });
  }
};

exports.updateContactStatus = async (req, res) => {
  try {
    const contact = await Contact.findById(req.params.id);
    if (!contact) return res.status(404).json({ message: "Contact not found" });

    contact.status = req.body.status;
    await contact.save();
    res.json(contact);
  } catch (err) {
    console.error('Error updating contact status:', err);
    res.status(500).json({ message: err.message });
  }
};

exports.deleteContact = async (req, res) => {
  try {
    const contact = await Contact.findById(req.params.id);
    if (!contact) return res.status(404).json({ message: "Contact not found" });

    await contact.remove();
    res.json({ message: "Contact deleted" });
  } catch (err) {
    console.error('Error deleting contact:', err);
    res.status(500).json({ message: err.message });
  }
};