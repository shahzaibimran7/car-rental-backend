const ContactUs  = require('../models/contactUs'); 


const createContactUs = async (req, res) => {
  try {
    const { name, email, query } = req.body;
    const newContactUs = await ContactUs.create({ name, email, query });
    res.status(201).json(newContactUs);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Error creating contactUs entry' });
  }
};


const getAllContactUs = async (req, res) => {
  try {
    const contactUsEntries = await ContactUs.findAll();
    res.status(200).json(contactUsEntries);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Error retrieving contactUs entries' });
  }
};


const getContactUsById = async (req, res) => {
  const { id } = req.params;
  try {
    const contactUsEntry = await ContactUs.findByPk(id);
    if (!contactUsEntry) {
      res.status(404).json({ error: 'ContactUs entry not found' });
    } else {
      res.status(200).json(contactUsEntry);
    }
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Error retrieving contactUs entry' });
  }
};


const deleteContactUsById = async (req, res) => {
  const { id } = req.params;
  try {
    const contactUsEntry = await ContactUs.findByPk(id);
    if (!contactUsEntry) {
      res.status(404).json({ error: 'ContactUs entry not found' });
    } else {
      await contactUsEntry.destroy();
      res.status(204).json();
    }
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Error deleting contactUs entry' });
  }
};

module.exports = {
  createContactUs,
  getAllContactUs,
  getContactUsById,
  deleteContactUsById,
};
