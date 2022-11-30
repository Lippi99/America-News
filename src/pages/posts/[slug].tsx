import { GetServerSideProps } from "next";
import { getSession } from "next-auth/react";
import Head from "next/head";
import { ParsedUrlQuery } from "querystring";
import { css } from "../../../stitches.config";
import { getPrismicClient } from "../../services/prismic";
import { dateFormat } from "../../utils/date";

type Content = {
  text: string;
  type: string;
};

interface PostProps {
  post: {
    slug: string;
    title: string;
    updatedAt: string;
    content: Content[];
  };
}

export default function Post({ post }: PostProps) {
  const postStyle = css({
    variants: {
      variant: {
        container: {
          maxWidth: "1120px",
          margin: "0 auto",
          padding: "0 2rem",
        },
        post: {
          maxWidth: "720px",
          margin: "5rem auto 0",
        },
        title: {
          fontSize: "3rem",
          fontWeight: 900,
        },
        time: {
          display: "block",
          fontSize: "1rem",
          color: "$gray300",
          marginTop: "1.5rem",
        },
        postContent: {
          marginTop: "2rem",
          lineHeight: "2rem",
          fontSize: "1.125rem",
          color: "$gray100",
        },
        paragraph: {
          margin: "1.5rem 0",
        },
        list: {
          paddingLeft: "1.5rem",
        },
        listItem: {
          margin: "0.5rem 0",
        },
      },
    },
  });

  return (
    <>
      <Head>
        <title>{post.title}</title>
      </Head>
      <article className={postStyle({ variant: "post" })}>
        <h1 className={postStyle({ variant: "title" })}>{post.title}</h1>
        <time className={postStyle({ variant: "time" })}>{post.updatedAt}</time>
        <div className={postStyle({ variant: "postContent" })}>
          {post.content.map((content, index) => (
            <div key={index}>{content.text}</div>
          ))}
        </div>
      </article>
    </>
  );
}

export const getServerSideProps: GetServerSideProps = async ({
  req,
  params,
}) => {
  const { slug } = params!;

  const session = await getSession({ req });
  if (!session) {
    return {
      redirect: {
        destination: "/",
        permanent: false,
      },
    };
  }

  const prismic = getPrismicClient(req);

  const response = await prismic.getByUID<any>("publication", `${slug}`, {});

  const publishedDateFormatted = dateFormat(
    `${response.last_publication_date}`,
    "pt-BR",
    "2-digit",
    "long",
    "numeric"
  );

  const post = {
    slug,
    title: response.data?.title?.toLowerCase(),
    content: response.data.content,
    updatedAt: publishedDateFormatted,
  };

  return {
    props: {
      post,
    },
  };
};
