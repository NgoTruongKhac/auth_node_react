import { multerInstance } from "./multerInstance.js";

export const uploadProfilePicture = multerInstance("profilePicture", [
  "image/jpeg",
  "image/png",
  "image/jpg",
]);
