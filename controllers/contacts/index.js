const {
  fetchContacts,
  countContacts,
  fetchContact,
  insertContact,
  updateContact,
  removeContact,
} = require("./services");

const getAllContacts = async (req, res, next) => {
  const page = parseInt(req.query.page) || 1; // default page = 1
  const limit = parseInt(req.query.limit) || 5; // default limit per page = 5
  const { favorite } = req.query;

  // FILTER ->  Show and count filtered contacts
  // if favorite = false/true - show filtered contacts
  // if favorite isn't set in query params, return all contacts in DB

  let filter = {};
  if (favorite === "false") {
    filter = { favorite: false };
  } else if (favorite !== undefined) {
    // ternary operator
    filter = favorite === "true" ? { favorite: true } : {};
  }

  try {
    const contacts = await fetchContacts(filter, page, limit);
    console.log("Contacts:", contacts);

    // check amount of contacts in base and include filter
    const totalContacts = await countContacts(filter);

    // Round up the number of pages - eg 12 contacts - I need 3 pages
    const totalPages = Math.ceil(totalContacts / limit);

    res.json({
      message: "Contacts list",
      contacts,
      totalPages,
      currentPage: page,
    });
  } catch (error) {
    next(error);
  }
};

const getContact = async (req, res, next) => {
  try {
    console.log("params in getContact:", req.params);
    const contact = await fetchContact(req.params.contactId);
    console.log("Contact in getContact", contact);

    if (contact) {
      res.json({
        message: "contact by ID",
        contact,
      });
    } else {
      next();
    }
  } catch (error) {
    next(error);
  }
};

const createContact = async (req, res, next) => {
  try {
    const { name, email, phone } = req.body;

    const result = await insertContact({ name, email, phone });
    res.status(201).json({
      message: "Contact created:",
      result,
    });
  } catch (error) {
    // validation error - show status 400, not 500
    console.log(error);
    if (error.name === "ValidationError") {
      const errors = Object.keys(error.errors).map(
        (key) => error.errors[key].message
      );
      res.status(400).json({
        message: "Validation error",
        errors,
      });
    } else {
      next(error);
    }
  }
};

const putContact = async (req, res, next) => {
  const id = req.params.contactId;
  console.log(req.params);
  const toUpdate = req.body;

  console.log(req.body);
  try {
    const result = await updateContact({ id, toUpdate });
    console.log(result);

    if (!result) {
      next();
    }

    res.json({
      message: "Contact updated succesfully!",
      result,
    });
  } catch (error) {
    // validation error - show status 400, not 500
    console.log(error);
    if (error.name === "ValidationError") {
      const errors = Object.keys(error.errors).map(
        (key) => error.errors[key].message
      );
      res.status(400).json({
        message: "Validation error",
        errors,
      });
    } else {
      next(error);
    }
  }
};

const deleteContact = async (req, res, next) => {
  try {
    const id = req.params.contactId;
    const removed = await removeContact({ id });
    console.log(removed);

    if (!removed) {
      return res.status(404).json({
        message: `Contact with ID ${id} not found`,
      });
    }

    res.json({ message: "Contact deleted" });
  } catch (error) {
    console.log(error);
    next(error);
  }
};

const updateStatusContact = async (req, res, next) => {
  const id = req.params.contactId;
  console.log(req.params);
  const toUpdate = req.body;
  console.log(req.body);

  try {
    const result = await updateContact({ id, toUpdate });
    console.log(result);

    if (!result) {
      return res.status(400).json({ message: "missing field favorite" });
    }
    res.json({
      message: "Contact updated succesfully!",
      result,
    });
  } catch (error) {
    // validation error - show status 400, not 500
    console.log(error);
    if (error.name === "ValidationError") {
      const errors = Object.keys(error.errors).map(
        (key) => error.errors[key].message
      );
      res.status(400).json({
        message: "Validation error",
        errors,
      });
    } else {
      next(error);
    }
  }
};

module.exports = {
  getAllContacts,
  getContact,
  createContact,
  putContact,
  updateStatusContact,
  deleteContact,
};
