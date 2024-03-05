import check from "../../modules/choose-plan-page/assets/check.svg";
import cross from "../../modules/choose-plan-page/assets/cross.svg";
import { Plan } from "../../types/interactor";
import { getCurrency, getTrialFormattedPrice } from "../../utils/interactor";
import { useTranslation } from "next-i18next";
import { useEffect, useState } from "react";

const CHECKED_MONTHLY_AMOUNT = 4;
const BULLETS_AMOUNT = 8;

export const useGetPlans = (products) => {
  const { t } = useTranslation();
  const [plans, setPlans] = useState<Plan[]>();

  const createBulletPoint = (useCheckIcon: boolean, bulletText: string) => ({
    imgSrc: useCheckIcon ? check : cross,
    bullText: (
      <span className={!useCheckIcon ? "text-[#878787]" : ""}>
        {bulletText}
      </span>
    ),
  });

  const getPlans = (products): Plan[] => {
    const plans = [
      {
        productIndex: 0,
        planKey: "monthly",
      },
      {
        productIndex: 1,
        planKey: "monthly_full",
      },
      {
        productIndex: 2,
        planKey: "annual",
      },
    ];

    return plans.map(({ productIndex, planKey }) => {
      const product = products[productIndex];
      const isTrial = planKey.includes("monthly");
      const price = getTrialFormattedPrice(
        isTrial ? product?.price!.trial_price! : product?.price?.price!,
        product?.price!.currency
      );
      const fullPrice = isTrial
        ? getTrialFormattedPrice(
            product?.price?.price,
            product?.price?.currency
          )
        : undefined;
      const formattedCurrency = getCurrency(product?.price.currency);

      const bullets = Array.from({ length: BULLETS_AMOUNT }, (_, i) => {
        const bulletNumber = i + 1;
        const useCheckIcon =
          bulletNumber < CHECKED_MONTHLY_AMOUNT ||
          planKey === "annual" ||
          planKey === "monthly_full";
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
        date: planKey === "annual" ? t("payment_page.plans.annual.date") : null,
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
