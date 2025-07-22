const express = require("express");

const {
  getAllContacts,
  getContact,
  createContact,
  putContact,
  deleteContact,
  updateStatusContact,
} = require("../../controllers/contacts/index");

const {
  validateContact,
  validateStatus,
} = require("../../middlewares/validateContact");

const authMiddleware = require("../../middlewares/jwt");

const router = express.Router();

router.get("/", authMiddleware, getAllContacts);
router.get("/:contactId", authMiddleware, getContact);
router.post("/", authMiddleware, validateContact, createContact);
router.put("/:contactId", authMiddleware, validateContact, putContact);
router.delete("/:contactId", authMiddleware, deleteContact);
router.patch(
  "/:contactId/favorite",
  authMiddleware,
  validateStatus,
  updateStatusContact
);

module.exports = router;
