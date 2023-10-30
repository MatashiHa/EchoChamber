import { currentUser, redirectToSignIn } from "@clerk/nextjs";

import { db } from "./db";

export const initialProfile = async () => {
  const user = await currentUser();

  if (!user) {
    //это означает, что пользователь не вошёл в аккаунт
    return redirectToSignIn();
  }

  const profile = await db.profile.findUnique({ where: { userId: user.id } });

  if (profile) {
    return profile;
  }

  //если м не находим профиль, мы его создаём:
  const newProfile = await db.profile.create({
    data: {
      userId: user.id,
      name: `${user.username}`,
      imageUrl: user.imageUrl,
      email: user.emailAddresses[0].emailAddress,
    },
  });

  return newProfile;
};
