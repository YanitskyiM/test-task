import { API } from "../../../services/api";
import { ApiFile } from "../../../services/api/types";
import { NextRouter } from "next/router";
import React from "react";

export const useGetFiles = (router: NextRouter) => {
  const [file, setFile] = React.useState<ApiFile>();

  React.useEffect(() => {
    API.files
      .getFiles()
      .then((res) => {
        if (router.query?.file) {
          const chosenFile = res.files.find(
            (item) => item.id === router.query!.file
          );

          setFile(chosenFile);

          return;
        }
        setFile(res.files[res.files.length - 1]);
      })
      .catch(() => {
        throw new Error("Error while fetching files");
      });
  }, []);

  return { file };
};
