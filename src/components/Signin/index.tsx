import { FaGithub } from "react-icons/fa";
import { FiX } from "react-icons/fi";
import { css } from "../../../stitches.config";
import { signIn, signOut, useSession } from "next-auth/react";

interface User {
  email?: string;
  name: string;
  image?: string;
}

export const SigninButton = () => {
  const { data: session } = useSession();

  const sigin = css({
    variants: {
      variant: {
        signin: {
          height: "3rem",
          borderRadius: "3rem",
          background: "$gray850",
          border: 0,
          padding: "0 1.5rem",

          display: "flex",
          alignItems: "center",
          justifyContent: "center",

          color: "White",
          fontWeight: "bold",

          cursor: "pointer",

          transition: "filter 0.2s",

          "&:hover": {
            filter: "brightness(0.8)",
          },
        },
      },
    },
  });

  return session ? (
    <button className={sigin({ variant: "signin" })} type="button">
      <FaGithub
        color="#28a745"
        style={{ width: "20px", height: "20px", marginRight: "1rem" }}
      />
      Welcome, {session.user?.name}
      <FiX
        color="#737380"
        style={{ marginLeft: "1rem" }}
        onClick={() => signOut()}
      />
    </button>
  ) : (
    <button
      className={sigin({ variant: "signin" })}
      type="button"
      onClick={() => signIn("github")}
    >
      <FaGithub
        color="#eba417"
        style={{ width: "20px", height: "20px", marginRight: "1rem" }}
      />
      Sign in with Github
    </button>
  );
};
