import { Contact } from "../models/contact.js";

export const listContacts = async (query, skip, limit) => {
  const data = await Contact.find(query, "-createdAt -updatedAt", {
    skip,
    limit,
  }).populate("owner", "email subscription");
  return data;
};

export const getContactById = async (id, owner) => {
  const result = await Contact.findById({ _id: id, owner });
  return result || null;
};

export const removeContact = async (id, owner) => {
  const contact = await Contact.findOneAndDelete({ _id: id, owner });
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
  const contact = await Contact.findOneAndUpdate({ _id: id, owner }, data, {
    new: true,
  });
  return contact;
};

export const updateStatusContact = async (id, owner, body) => {
  const { favorite } = body;
  const updatedContact = await Contact.findByIdAndUpdate(
    { _id: id, owner },
    { favorite },
    { new: true }
  );
  return updatedContact;
};
