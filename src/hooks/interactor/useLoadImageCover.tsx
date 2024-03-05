import { imagesFormat } from "../../constants/interactor";
import { ApiFile } from "../../services/api/types";
import { InternalFileType } from "../../types/interactor";
import { NextRouter } from "next/router";
import React, { useEffect } from "react";
import {getFileUrl} from "../../utils/interactor/getFileUrl";

export const useLoadImageCover = (router: NextRouter, file: ApiFile) => {
  const [fileLink, setFileLink] = React.useState<string | null>(null);

  const loadImageCover = async () => {
    if (
      !file ||
      !imagesFormat.includes(file.internal_type) ||
      // @NOTE: this two checks fir filename exists because sometimes OS do not pass file.type correctly
      !imagesFormat.includes(
        file.filename.slice(-3).toUpperCase() as InternalFileType
      ) ||
      !imagesFormat.includes(
        file.filename.slice(-4).toUpperCase() as InternalFileType
      )
    ) {
      return;
    }

    const fileUrl = await getFileUrl(router, file);

    setFileLink(fileUrl);
  };

  useEffect(() => {
    loadImageCover();
  }, []);

  return {
    fileLink: fileLink ?? null,
  };
};
