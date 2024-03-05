import {PaymentPlanId} from "../../use-cases/get-subscription-products";

export enum InternalFileType {
    DOC = "DOC",
    DOCX = "DOCX",
    JPEG = "JPEG",
    JPG = "JPG",
    HEIC = "HEIC",
    HEIF = "HEIF",
    PDF = "PDF",
    PNG = "PNG",
    PPT = "PPT",
    PPTX = "PPTX",
    XLS = "XLS",
    XLSX = "XLSX",
    ZIP = "ZIP",
    BMP = "BMP",
    EPS = "EPS",
    GIF = "GIF",
    SVG = "SVG",
    TIFF = "TIFF",
    WEBP = "WEBP",
    EPUB = "EPUB",
}

export type Bullets = {
    imgSrc: string;
    bullText: JSX.Element;
};

export interface Plan {
    id: PaymentPlanId;
    title: string;
    price: string;
    date: string | null;
    bullets: Bullets[];
    bulletsC?: Bullets[];
    text: string | JSX.Element;
    formattedCurrency?: string;
    fullPrice?: string;
}

export interface IPaymentPageInteractor {
    selectedPlan: PaymentPlanId;
    onSelectPlan: (plan: PaymentPlanId) => void;
    onContinue: (place?: string) => void;

    imagePDF: Blob | null;
    isImageLoading: boolean;
    fileType: string | null;
    fileLink: string | null;

    isEditorFlow: boolean;
    isSecondEmail: boolean;
    isThirdEmail: boolean;

    isRemoteConfigLoading: boolean;
    fileName: string | null;

    plans: Plan[];
    isPlansLoading: boolean;
}