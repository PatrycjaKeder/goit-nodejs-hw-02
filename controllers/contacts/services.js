// database functions
const Contact = require("../../models/contacts");

const fetchContacts = (filter, page, limit) => {
  // find a contact, skip users on previous page and set a limit per page
  return Contact.find(filter)
    .skip((page - 1) * limit)
    .limit(limit);
};

const countContacts = (filter) => {
  return Contact.countDocuments(filter);
};

const fetchContact = (id) => {
  console.log("in fetch contact ID:", id);
  return Contact.findOne({
    _id: id,
  });
};

const insertContact = ({ name, email, phone }) => {
  return Contact.create({
    name,
    email,
    phone,
    favorite: false,
  });
};

const updateContact = ({ id, toUpdate }) => {
  return Contact.findByIdAndUpdate(
    { _id: id },
    { $set: toUpdate },
    {
      new: true,
      runValidators: true,
      // upsert:false
    }
  );
};

const removeContact = ({ id }) => {
  return Contact.findByIdAndDelete({
    _id: id,
  });
};

module.exports = {
  fetchContacts,
  countContacts,
  fetchContact,
  insertContact,
  updateContact,
  removeContact,
};
