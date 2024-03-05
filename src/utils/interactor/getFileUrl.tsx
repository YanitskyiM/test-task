import {NextRouter} from "next/router";
import {ApiFile} from "../../services/api/types";
import {API} from "../../services/api";

export const getFileUrl = async (router: NextRouter, file: ApiFile) => {
    if (router.query?.file) {
        return router.query.editedFile === "true"
            ? API.files.editedFile(router.query.file as string).then((r) => r.url)
            : API.files.downloadFile(router.query.file as string).then((r) => r.url);
    }

    let {url} = await API.files.downloadFile(file.id);
    return url;
};