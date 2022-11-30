import { GetStaticProps } from "next";
import Head from "next/head";
import { css } from "../../../stitches.config";
import { getPrismicClient } from "../../services/prismic";
import Prismic from "@prismicio/client";
import { dateFormat } from "../../utils/date";
import NextLink from "next/link";

type Post = {
  slug: string;
  title: string;
  content: string;
  updatedAt: string;
};

interface PostProps {
  posts: Post[];
}

export default function Posts({ posts }: PostProps) {
  const poststyle = css({
    variants: {
      variant: {
        container: {
          maxWidth: "1120px",
          margin: "0 auto",
          padding: "0 2rem",
        },
        posts: {
          maxWidth: "770px",
          margin: "5rem auto 0",
        },
        links: {
          display: "block",
          marginTop: "2rem",
          paddingBottom: "2rem",
          borderBottom: "1px solid $gray700",
          textDecoration: "none",
          color: "$white200",
        },
        time: {
          fontSize: "1rem",
          display: "flex",
          alignItems: "center",
          color: "$gray300",
        },

        strong: {
          display: "block",
          fontSize: "1.5rem",
          marginTop: "1rem",
          lineHeight: "2rem",
          transition: "ease 200ms",
          "&:hover": {
            color: "$yellow580",
          },
        },
        paragraph: {
          color: "$gray300",
          marginTop: "0.5rem",
          lineHeight: "1.625rem",
        },
      },
    },
  });

  return (
    <>
      <Head>
        <title>America Posts</title>
        <meta
          name="description"
          content="ig.news posts for those who subscribed"
        />
      </Head>
      <main className={poststyle({ variant: "container" })}>
        <div className={poststyle({ variant: "posts" })}>
          {posts.map((post) => (
            <NextLink href={`/posts/${post.slug}`} key={post.slug}>
              <a className={poststyle({ variant: "links" })}>
                <time className={poststyle({ variant: "time" })}>
                  {post.updatedAt}
                </time>
                <strong className={poststyle({ variant: "strong" })}>
                  {post.title}
                </strong>
                <p className={poststyle({ variant: "paragraph" })}>
                  {post.content}
                </p>
              </a>
            </NextLink>
          ))}
        </div>
      </main>
    </>
  );
}

export const getStaticProps: GetStaticProps = async () => {
  const prismic = getPrismicClient();

  const response = await prismic.query(
    [Prismic.predicates.at("document.type", "publication")],
    {
      fetch: ["publication.title", "publication.content"],
      pageSize: 100,
    }
  );

  interface Content {
    type: string;
  }

  const posts = response.results.map((post: any) => {
    const publishedDateFormatted = dateFormat(
      post.last_publication_date,
      "pt-BR",
      "2-digit",
      "long",
      "numeric"
    );

    return {
      slug: post.uid,
      title: post.data.title,
      content:
        post.data.content.find(
          (content: Content) => content.type === "paragraph"
        )?.text ?? "",
      updatedAt: publishedDateFormatted,
    };
  });

  return {
    props: {
      posts,
    },
  };
};
