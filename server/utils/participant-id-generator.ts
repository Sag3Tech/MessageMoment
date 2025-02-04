import { nanoid } from "nanoid";

export const generateUniqueId = () => {
  return nanoid(9); // Generates a unique ID with a length of 9 characters
};
