import type { GetStaticProps } from "next";
import Head from "next/head";
import { css } from "../../stitches.config";
import NextImage from "next/image";
import { SubscribeButton } from "../components/SubscribeButton";
import { stripe } from "../services/stripe";

interface HomeProps {
  product: {
    priceId: string;
    amount: number;
  };
}

const Home = ({ product }: HomeProps) => {
  const HomeStyles = css({
    variants: {
      variant: {
        contentContainer: {
          maxWidth: "1120px",
          margin: "0 auto",
          padding: "0 2rem",
          height: "calc(100vh - 5rem)",
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",

          "@bp3": {
            flexDirection: "column-reverse",
            alignItems: "center",
            justifyContent: "center",
          },
        },
        hero: {
          maxWidth: "600px",
          "@bp3": {
            display: "flex",
            flexDirection: "column",
            justifyContent: "center",
            alignItems: "center",

            my: "$5",
          },
        },

        welcome: {
          fontSize: "1.5rem",
          fontWeight: "bolder",
        },
        title: {
          fontSize: "4.5rem",
          lineHeight: "4.5rem",
          fontWeight: 900,
          marginTop: "2.5rem",

          "@bp3": {
            textAlign: "center",
          },
        },
        reactWorld: {
          color: "$cyan500",
        },
        publications: {
          fontSize: "1.5rem",
          lineHeight: "2.25rem",
          marginTop: "1.5rem",
          marginBottom: "2.5rem",
        },
        pricing: {
          color: "$cyan500",
          fontWeight: "bold",
        },
      },
    },
  });

  return (
    <>
      <Head>
        <title>America News</title>
        <meta
          name="description"
          content="Subscribe to access ig.news content"
        />
      </Head>

      <main className={HomeStyles({ variant: "contentContainer" })}>
        <section className={HomeStyles({ variant: "hero" })}>
          <span className={HomeStyles({ variant: "welcome" })}>
            👏 Hey, welcome!
          </span>
          <h1 className={HomeStyles({ variant: "title" })}>
            News about the{" "}
            <span className={HomeStyles({ variant: "reactWorld" })}>
              Brazil and US.
            </span>
          </h1>
          <p className={HomeStyles({ variant: "publications" })}>
            Get access to all publications
            <br />
            <span className={HomeStyles({ variant: "pricing" })}>
              for {product.amount} month
            </span>
          </p>
          <SubscribeButton priceId={product.priceId} />
        </section>
        <NextImage
          width={440}
          height={500}
          src="/avatar1.svg"
          objectFit="contain"
          alt="avatar"
          priority
        />
      </main>
    </>
  );
};

export default Home;

export const getStaticProps: GetStaticProps = async () => {
  const price = await stripe.prices.retrieve("price_1LYINHF1JSxRXbUSNj8uPYUk");

  const priceUnit = price.unit_amount && price.unit_amount / 100;

  const product = {
    priceId: price.id,
    amount: new Intl.NumberFormat("en-us", {
      style: "currency",
      currency: "USD",
    }).format(priceUnit!),
  };

  return {
    props: {
      product,
    },
    revalidate: 60 * 60 * 24, // 24 hours
  };
};
