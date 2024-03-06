import { useRemoteConfig } from "../../providers/remote-config-provider";
import { useUser } from "../../providers/user-provider";
import { API } from "../../services/api";
import {
  PaymentPlanId,
  useGetSubscriptionProducts,
} from "../../use-cases/get-subscription-products";
import {
  ROUTER_QUERY_SOURCE_ACCOUNT,
  ROUTER_QUERY_SOURCE_EDITOR,
} from "./constants/interactor";
import {
  SELECTED_PLAN,
  SELECTED_PLAN_VIEW,
} from "./constants/interactor/localStorage/analytics";
import { useGetFiles } from "./hooks/useGetFiles";
import { useGetPlans } from "./hooks/useGetPlans";
import { useLoadImageCover } from "./hooks/useLoadImageCover";
import { useLoadPDFCover } from "./hooks/useLoadPDFCover";
import { IPaymentPageInteractor } from "./types/interactor";
import { PAGE_LINKS } from "./types/router";
import { useRouter } from "next/router";
import React from "react";

export const usePaymentPageInteractor = (): IPaymentPageInteractor => {
  const router = useRouter();

  const [selectedPlan, setSelectedPlan] = React.useState<PaymentPlanId>(
    PaymentPlanId.MONTHLY_FULL
  );

  const { file } = useGetFiles(router);
  const { imagePDF, isImageLoading } = useLoadPDFCover(router, file);
  const { fileLink } = useLoadImageCover(router, file);
  const { products } = useGetSubscriptionProducts();
  const { plans } = useGetPlans(products);
  const { abTests, isRemoteConfigLoading } = useRemoteConfig();
  const { user } = useUser();

  const onSelectPlan = (plan: PaymentPlanId) => {
    setSelectedPlan(plan);

    if (selectedPlan === plan) {
      onContinue("planTab");
    }
  };

  const onContinue = (place?: string) => {
    console.log(
      "send event analytic2",
      "place: ",
      place ? place : "button",
      "planName: ",
      selectedPlan
    );

    localStorage.setItem(SELECTED_PLAN, selectedPlan);

    router.push({
      pathname: PAGE_LINKS.PAYMENT,
      query: router.query,
    });
  };

  React.useEffect(() => {
    const fetchToken = async () => {
      try {
        if (router.query?.token) {
          await API.auth.byEmailToken(router.query.token as string);
        }
      } catch (error) {
        throw new Error("Error fetching token:", error);
      }
    };

    if (user?.subscription !== null) {
      router.push(PAGE_LINKS.DASHBOARD);
      return;
    }
    if (!user?.email) {
      router.back();
      return;
    }

    if (router.query?.token) {
      fetchToken();
    }
  }, [user?.subscription, user?.email, router.query?.token]);

  // @NOTE: analytics on page rendered
  React.useEffect(() => {
    if (!localStorage.getItem(SELECTED_PLAN_VIEW)) {
      console.log("send event analytic3");
    }

    localStorage.setItem(SELECTED_PLAN_VIEW, "true");

    return () => {
      localStorage.removeItem(SELECTED_PLAN_VIEW);
    };
  }, []);

  // @NOTE: setting pre-select plan for users from remarketing emails
  React.useEffect(() => {
    if (router.query?.fromEmail === "true") {
      setSelectedPlan(PaymentPlanId.MONTHLY_FULL_SECOND_EMAIL);
    }
  }, [abTests]);

  return {
    selectedPlan,
    onSelectPlan,
    onContinue,
    imagePDF: imagePDF,
    isImageLoading,
    fileName: file ? file.filename : null,
    fileType: file ? file.internal_type : null,
    fileLink,
    isEditorFlow:
      (router.query?.source === ROUTER_QUERY_SOURCE_EDITOR ||
        router.query?.source === ROUTER_QUERY_SOURCE_ACCOUNT) &&
      router.query.convertedFrom === undefined,
    isSecondEmail: router.query?.fromEmail === "true",
    isThirdEmail: router.query?.fromEmail === "true",

    isRemoteConfigLoading,
    plans,
    isPlansLoading: products.length === 0,
  };
};
