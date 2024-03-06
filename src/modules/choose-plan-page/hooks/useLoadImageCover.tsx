import { ApiFile } from "../../../services/api/types";
import { checkFileType } from "../utils/interactor/checkFileType";
import { getFileUrl } from "../services/getFileUrl";
import { NextRouter } from "next/router";
import React, { useEffect } from "react";

export const useLoadImageCover = (router: NextRouter, file: ApiFile) => {
  const [fileLink, setFileLink] = React.useState<string | null>(null);

  const loadImageCover = async () => {
    if (checkFileType(file)) {
      return;
    }

    try {
      const fileUrl = await getFileUrl(router, file);

      setFileLink(fileUrl);
    } catch (e) {
      throw new Error("Error while fetching file");
    }
  };

  useEffect(() => {
    loadImageCover();
  }, []);

  return {
    fileLink: fileLink ?? null,
  };
};
