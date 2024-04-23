const path = (root, subLink) => `${root}${subLink}`;
const ROOT_PATH = "";

export const PATHS = {
  root: ROOT_PATH,
  editor: path(ROOT_PATH, "/editor"),
  entries: path(ROOT_PATH, "/entries"),
};
