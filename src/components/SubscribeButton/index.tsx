import { useSession, signIn } from "next-auth/react";
import { css } from "../../../stitches.config";
import { api } from "../../services/api";
import { getStripeJs } from "../../services/stripe-js";

interface SubscribeProps {
  priceId: string;
}

export const SubscribeButton = ({ priceId }: SubscribeProps) => {
  const { status } = useSession();

  const handleSubscribe = async () => {
    if (status === "unauthenticated") {
      signIn("github");
      return;
    }

    try {
      const response = await api.post("/subscribe");

      const { sessionId } = response.data;

      const stripe = await getStripeJs();
      await stripe?.redirectToCheckout({ sessionId });
    } catch (error: any) {
      alert(error?.message);
    }

    //creation of checkout session
  };

  const subscribe = css({
    variants: {
      variant: {
        subscribe: {
          cursor: "pointer",
          height: "4rem",
          width: "268px",
          border: 0,
          borderRadius: "2rem",
          background: "$yellow580",
          color: "$gray900",
          fontSize: "1.25rem",
          fontWeight: "bold",

          display: "flex",
          alignItems: "center",
          justifyContent: "center",

          transition: "filter 0.2s",

          "&:hover": {
            filter: "brightness(0.8)",
          },
        },
      },
    },
  });

  return (
    <button
      className={subscribe({ variant: "subscribe" })}
      type="button"
      onClick={handleSubscribe}
    >
      Subscribe now
    </button>
  );
};
