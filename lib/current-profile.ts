import { auth } from "@clerk/nextjs";
import { db } from "./db";

export const currentProfile = async () => {
  const { userId } = auth();
  //если мы не нашли профиля - возвращаем ничего
  if (!userId) {
    return null;
  }
  // а тут мы ищем профиль в базе данных  и возвращаем его
  const profile = await db.profile.findUnique({
    where: {
      userId,
    },
  });

  return profile;
};
