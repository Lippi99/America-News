import { Box } from "../Box";
import NextImage from "next/image";
import NextLink from "next/link";
import { css } from "../../../stitches.config";
import { Flex } from "../Flex";
import { SigninButton } from "../Signin";
import { useRouter } from "next/router";

export const Header = () => {
  const { asPath } = useRouter();

  const link = {
    color: "$gray300",
    mx: "$3",
    textDecoration: "none",
    outline: 0,
    fontFamily: `Roboto, sans-serif`,
    "&:hover": {
      color: "White",
    },
  };

  const headerStyle = css({
    variants: {
      variant: {
        container: {
          height: "5rem",
          borderBottom: "1px solid  $gray800",
        },
        content: {
          maxWidth: "1120px",
          height: "5rem",
          m: "0 auto",
          p: "0 2rem",
        },
        link,
        linkActive: {
          ...link,
          paddingBottom: "1.88rem",
          borderBottom: "1px solid $yellow580",
          borderRadius: "3px 3px 0 0",
          "&:hover": {
            color: "White",
          },
        },
      },
    },
  });

  return (
    <Box as="header" className={headerStyle({ variant: "container" })}>
      <Flex className={headerStyle({ variant: "content" })} align="center">
        <NextImage
          width={50}
          height={55}
          src="/logo1.svg"
          alt="avatar"
          objectFit="contain"
        />
        <Box as="nav" css={{ marginLeft: "$7" }}>
          <NextLink href="/">
            <a
              className={headerStyle({
                variant: asPath === "/" ? "linkActive" : "link",
              })}
            >
              Home
            </a>
          </NextLink>
          <NextLink href="/posts">
            <a
              className={headerStyle({
                variant: asPath === "/posts" ? "linkActive" : "link",
              })}
            >
              Posts
            </a>
          </NextLink>
        </Box>
        <Box css={{ marginLeft: "auto" }}>
          <SigninButton />
        </Box>
      </Flex>
    </Box>
  );
};
