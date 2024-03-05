import { useGetFiles } from "../../hooks/interactor/useGetFiles";
import { useGetPlans } from "../../hooks/interactor/useGetPlans";
import { useLoadImageCover } from "../../hooks/interactor/useLoadImageCover";
import { useLoadPDFCover } from "../../hooks/interactor/useLoadPDFCover";
import { useRemoteConfig } from "../../providers/remote-config-provider";
import { useUser } from "../../providers/user-provider";
import { API } from "../../services/api";
import { IPaymentPageInteractor } from "../../types/interactor";
import { PAGE_LINKS } from "../../types/router";
import {
  PaymentPlanId,
  useGetSubscriptionProducts,
} from "../../use-cases/get-subscription-products";
import { useRouter } from "next/router";
import React from "react";

export const usePaymentPageInteractor = (): IPaymentPageInteractor => {
  const router = useRouter();

  const { user } = useUser();

  const [selectedPlan, setSelectedPlan] = React.useState<PaymentPlanId>(
    PaymentPlanId.MONTHLY_FULL
  );

  const { file } = useGetFiles(router);
  const { imagePDF, isImageLoading } = useLoadPDFCover(router, file);
  const { fileLink } = useLoadImageCover(router, file);
  const { products } = useGetSubscriptionProducts();
  const { plans } = useGetPlans(products);
  const { abTests, isRemoteConfigLoading } = useRemoteConfig();

  const onSelectPlan = async (plan: PaymentPlanId) => {
    setSelectedPlan(plan);

    if (selectedPlan === plan) {
      await onContinue("planTab");
    }
  };

  const onContinue = async (place?: string) => {
    console.log(
      "send event analytic2",
      "place: ",
      place ? place : "button",
      "planName: ",
      selectedPlan
    );

    localStorage.setItem("selectedPlan", selectedPlan);

    await router.push({
      pathname: PAGE_LINKS.PAYMENT,
      query: router.query,
    });
  };

  React.useEffect(() => {
    if (user?.subscription !== null) {
      router.push(PAGE_LINKS.DASHBOARD);
      return;
    }
    if (!user?.email) {
      router.back();
      return;
    }

    if (router.query?.token) {
      API.auth.byEmailToken(router.query.token as string);
    }

  }, [user?.subscription, user?.email, router.query?.token]);

  // @NOTE: analytics on page rendered
  React.useEffect(() => {
    if (!localStorage.getItem("select_plan_view")) {
      console.log("send event analytic3");
    }

    localStorage.setItem("select_plan_view", "true");

    return () => {
      localStorage.removeItem("select_plan_view");
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
      (router.query?.source === "editor" ||
        router.query?.source === "account") &&
      router.query.convertedFrom === undefined,
    isSecondEmail: router.query?.fromEmail === "true",
    isThirdEmail: router.query?.fromEmail === "true",

    isRemoteConfigLoading,
    plans,
    isPlansLoading: products.length === 0,
  };
};
