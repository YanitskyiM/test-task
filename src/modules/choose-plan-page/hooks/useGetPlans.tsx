import { Product } from "../../../use-cases/get-subscription-products";
import check from "../assets/check.svg";
import cross from "../assets/cross.svg";
import { Plan, PlanKeys } from "../types/interactor";
import {
  currencyMap,
  getAnnualFormattedPrice,
  getTrialFormattedPrice,
} from "../utils/interactor";
import { useTranslation } from "next-i18next";
import { useEffect, useState } from "react";

const CHECKED_MONTHLY_AMOUNT = 4;
const BULLETS_AMOUNT = 8;

const plansTypes = [
  {
    productIndex: 0,
    planKey: PlanKeys.MONTHLY,
  },
  {
    productIndex: 1,
    planKey: PlanKeys.MONTHLY_FULL,
  },
  {
    productIndex: 2,
    planKey: PlanKeys.ANNUAL,
  },
];

export const useGetPlans = (products: Product[]) => {
  const { t } = useTranslation();
  const [plans, setPlans] = useState<Plan[]>();

  const getPlans = (products: Product[]): Plan[] => {
    return plansTypes.map(({ productIndex, planKey }) => {
      const product = products[productIndex];
      const isTrial = planKey.includes(PlanKeys.MONTHLY);
      const price = isTrial
        ? getTrialFormattedPrice(
            product?.price!.trial_price!,
            product?.price!.currency
          )
        : getAnnualFormattedPrice(
            product?.price?.price!,
            product?.price!.currency
          );
      const fullPrice = isTrial
        ? getTrialFormattedPrice(
            product?.price?.price,
            product?.price?.currency
          )
        : undefined;

      const formattedCurrency = currencyMap[product?.price.currency];

      const bullets = Array.from({ length: BULLETS_AMOUNT }, (_, i) => {
        const bulletNumber = i + 1;
        const useCheckIcon =
          bulletNumber < CHECKED_MONTHLY_AMOUNT ||
          planKey === PlanKeys.ANNUAL ||
          planKey === PlanKeys.MONTHLY_FULL;
        return createBulletPoint(
          useCheckIcon,
          t(`payment_page.plans.${planKey}.bullet${bulletNumber}`)
        );
      });

      return {
        id: product?.name,
        title: t(`payment_page.plans.${planKey}.title`),
        price,
        fullPrice,
        formattedCurrency,
        date:
          planKey === PlanKeys.ANNUAL
            ? t("payment_page.plans.annual.date")
            : null,
        bullets,
        text: t(`payment_page.plans.${planKey}.text`, {
          formattedPrice: price,
        }),
      };
    });
  };

  useEffect(() => {
    setPlans(getPlans(products));
  }, []);

  return { plans };
};

const createBulletPoint = (useCheckIcon: boolean, bulletText: string) => ({
  imgSrc: useCheckIcon ? check : cross,
  bullText: (
    <span className={!useCheckIcon ? "text-[#878787]" : ""}>{bulletText}</span>
  ),
});
