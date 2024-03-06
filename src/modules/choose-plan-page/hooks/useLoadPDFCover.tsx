import { ApiFile } from "../../../services/api/types";
import { generatePDFCover } from "../../../use-cases/generate-pdf-cover";
import { getFileUrl } from "../services/getFileUrl";
import { NextRouter } from "next/router";
import { useEffect, useState } from "react";


const PDF_COVER_WIDTH = 640;

export const useLoadPDFCover = (router: NextRouter, file: ApiFile) => {
  const [imagePDF, setImagePDF] = useState<Blob | null>(null);
  const [isImageLoading, setIsImageLoading] = useState(false);

  const loadPdfCover = async (): Promise<void> => {
    if (!file || file.internal_type !== "PDF") {
      return;
    }

    setIsImageLoading(true);

    try {
      const fileUrl = await getFileUrl(router, file);

      const pdfCover = await generatePDFCover({
        pdfFileUrl: fileUrl,
        width: PDF_COVER_WIDTH,
      });
      setImagePDF(pdfCover);
    } finally {
      setIsImageLoading(false);
    }
  };

  useEffect(() => {
    loadPdfCover();
  }, []);

  return {
    imagePDF: imagePDF ?? null,
    isImageLoading,
  };
};
