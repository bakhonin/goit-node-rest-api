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
  try {
    const { _id: owner } = req.user;
    const { page = 1, limit = 20, favorite } = req.query;
    const query = { owner };
    if (favorite) {
      query.favorite = favorite === "true";
    }
    const skip = (page - 1) * limit;
    res.status(200).json(await listContacts(query, skip, limit));
  } catch (error) {
    next(error);
  }
};

export const getOneContact = async (req, res, next) => {
  try {
    const { id } = req.params;
    const { _id: owner } = req.user;
    const getOneId = await getContactById(id, owner);
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
    const { _id: owner } = req.user;
    const deleteId = await removeContact(id, owner);
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
    const { _id: owner } = req.user;
    const result = await addContact({ ...req.body, owner });
    res.status(201).json(result);
  } catch (error) {
    next(error);
  }
};

export const updateContact = async (req, res, next) => {
  try {
    const { error } = updateContactSchema.validate(req.body);
    if (error) {
      throw HttpError(400, error.message);
    }
    if (Object.keys(req.body).length === 0) {
      throw HttpError(400, "Body must have at least one field");
    }
    const { id } = req.params;
    const { _id: owner } = req.user;
    const result = await updateContactId(id, owner, req.body);
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
    const { error } = updateFavoriteSchema.validate(req.body);
    if (error) {
      throw HttpError(400, error.message);
    }
    const { favorite } = req.body;
    const { _id: owner } = req.user;
    const result = await updateStatusContact(id, owner, { favorite });
    if (!result) {
      throw HttpError(404, "Not Found");
    }
    res.json(result);
  } catch (error) {
    next(error);
  }
};
