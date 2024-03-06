import { ApiFile } from "../../../../services/api/types";
import { imagesFormat } from "../../constants/interactor";
import { InternalFileType } from "../../types/interactor";

export function checkFileType(file: ApiFile) {
  return (
    !file ||
    !imagesFormat.includes(file.internal_type) ||
    // @NOTE: this two checks fir filename exists because sometimes OS do not pass file.type correctly
    !imagesFormat.includes(
      file.filename.slice(-3).toUpperCase() as InternalFileType
    ) ||
    !imagesFormat.includes(
      file.filename.slice(-4).toUpperCase() as InternalFileType
    )
  );
}
