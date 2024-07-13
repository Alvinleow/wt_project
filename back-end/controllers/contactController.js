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
