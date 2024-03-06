import { API } from "../../../services/api";
import { ApiFile } from "../../../services/api/types";
import { NextRouter } from "next/router";

export const getFileUrl = async (router: NextRouter, file: ApiFile) => {
  const fileId = (router.query?.file as string) || file.id;
  const isEdited = router.query?.editedFile === "true";
  const fileUrl = await API.files[isEdited ? "editedFile" : "downloadFile"](
    fileId
  );

  return fileUrl.url;
};
