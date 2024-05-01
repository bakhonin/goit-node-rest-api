import {
  listContacts,
  getContactById,
  removeContact,
  addContact,
  updateContactId,
  updateStatusContact,
} from "../services/contactsServices.js";
import HttpError from "../helpers/HttpError.js";
import {
  createContactSchema,
  updateContactSchema,
  updateFavoriteSchema,
} from "../models/contact.js";

export const getAllContacts = async (req, res, next) => {
  const getListContacts = await listContacts();
  try {
    res.status(200).json(getListContacts);
  } catch (error) {
    next(error);
  }
};

export const getOneContact = async (req, res, next) => {
  try {
    const { id } = req.params;
    const getOneId = await getContactById(id);
    if (!getOneId) {
      throw HttpError(404, "Not found");
    }
    res.json(getOneId);
  } catch (error) {
    next(error);
  }
};

export const deleteContact = async (req, res, next) => {
  try {
    const { id } = req.params;
    const deleteId = await removeContact(id);
    if (!deleteId) {
      throw HttpError(404, "Not Found");
    }
    res.json(deleteId);
  } catch (error) {
    next(error);
  }
};

export const createContact = async (req, res, next) => {
  try {
    const { error } = createContactSchema.validate(req.body);
    if (error) {
      throw HttpError(400, error.message);
    }
    const result = await addContact(req.body);
    res.status(201).json(result);
  } catch (error) {
    next(error);
  }
};

export const updateContact = async (req, res, next) => {
  try {
    const { error } = updateFavoriteSchema.validate(req.body);
    if (error) {
      throw HttpError(400, error.message);
    }
    if (Object.keys(req.body).length === 0) {
      throw HttpError(400, "Body must have at least one field");
    }
    const { id } = req.params;
    const result = await updateContactId(id, req.body);
    if (!result) {
      throw HttpError(404, "Not Found");
    }
    res.json(result);
  } catch (error) {
    next(error);
  }
};

export const updateStatus = async (req, res, next) => {
  try {
    const { id } = req.params;
    const { error } = updateContactSchema.validate(req.body);
    if (error) {
      throw HttpError(400, error.message);
    }
    const { favorite } = req.body;
    const result = await updateStatusContact(id, { favorite });
    if (!result) {
      throw HttpError(404, "Not Found");
    }
    res.json(result);
  } catch (error) {
    next(error);
  }
};
