import { atom } from "jotai";

export const UserPermissionAtom = atom({
  isAccept: false,
  isCamera: false,
  isMic: false,
});

export const userInformationAtom = atom({
  firstName: "",
  lastName: "",
  userId: "",
});
