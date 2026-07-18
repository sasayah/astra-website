import type { Access } from "payload";

type WithRole = { role?: string } | null | undefined;

export const isAdmin: Access = ({ req }) => (req.user as WithRole)?.role === "admin";

export const isEditorOrAdmin: Access = ({ req }) => {
  const role = (req.user as WithRole)?.role;
  return role === "admin" || role === "editor";
};
