/*
ЭТО СПЕЦИАЛЬНЫЙ ФАЙЛ ДЛЯ РАБОТЫ В ПАПКЕ PAGES/API/SOCKET/
*/

import { getAuth } from "@clerk/nextjs/server";
import { NextApiRequest } from "next";

import { db } from "./db";

export const currentProfilePages = async (req: NextApiRequest) => {
  const { userId } = getAuth(req);
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
