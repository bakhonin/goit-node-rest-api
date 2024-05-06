import { Contact } from "../models/contact.js";

export const listContacts = async (query, skip, limit) => {
  const data = await Contact.find(query, "-createdAt -updatedAt", {
    skip,
    limit,
  }).populate("owner", "email subscription");
  return data;
};

export const getContactById = async (id) => {
  const result = await Contact.findById(id);
  return result || null;
};

export const removeContact = async (id) => {
  const contact = await Contact.findOneAndDelete({ _id: id });
  if (!contact) {
    return null;
  }
  return contact;
};

export const addContact = async (data) => {
  const newContact = await Contact.create(data);
  return newContact;
};

export const updateContactId = async (id, data) => {
  const contact = await Contact.findByIdAndUpdate(id, data, { new: true });
  return contact;
};

export const updateStatusContact = async (contactId, body) => {
  const { favorite } = body;
  const updatedContact = await Contact.findByIdAndUpdate(
    contactId,
    { favorite },
    { new: true }
  );
  return updatedContact;
};
