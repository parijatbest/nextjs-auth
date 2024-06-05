// import { getSession } from "next-auth/react";
import { getServerSession } from "next-auth/next";

import { authOptions } from "./api/auth/[...nextauth]";

import UserProfile from "../components/profile/user-profile";

function ProfilePage() {
  return <UserProfile />;
}

export async function getServerSideProps(context) {
  const session = await getServerSession(context.req, context.res, authOptions);

  console.log("session=>>> ", session);

  if (!session) {
    return {
      redirect: {
        destination: "/auth",
        permanent: false,
      },
    };
  }

  return {
    props: { session: { ...session, user: { email: session.user.email } } },
  };
}

export default ProfilePage;
