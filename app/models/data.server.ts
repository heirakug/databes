import type { User, Data } from "@prisma/client";

import { prisma } from "~/db.server";

export function getData({
  id,
  userId,
}: Pick<Data, "id"> & {
  userId: User["id"];
}) {
  return prisma.data.findFirst({
    where: { id, userId },
  });
}

export async function getDataListItems({ userId }: { userId: User["id"] }) {
  // try {
    return await prisma.data.findMany({
      where: { userId },
      orderBy: { updatedAt: "desc" },
    });
  // } catch (error) {
  //   console.error("Error in getDataListItems:", error);
  //   throw error;
  // }
}

export async function createData({
  deviceType,
  deviceName,
  data,
  userId,
}: Pick<Data, "deviceType" | "deviceName" | "data"> & {
  userId: User["id"];
}) {
  try {
    // デバッグ用のログ
    console.log("Creating data with:", {
      deviceType,
      deviceName,
      data,
      userId,
    });

    // Prismaクライアントでデータを作成
    const result = await prisma.data.create({
      data: {
        deviceType,
        deviceName,
        data,
        user: {
          connect: {
            id: userId,
          },
        },
      },
    });

    // 成功した場合のログ
    console.log("Data created successfully:", result);
    
    return result;
  } catch (error) {
    // エラーログの出力
    console.error("Error creating data:", error);
    throw error; // エラーを再スローして呼び出し元に通知
  }
}


export function deleteData({
  id,
  userId,
}: Pick<Data, "id"> & { userId: User["id"] }) {
  return prisma.data.deleteMany({
    where: { id, userId },
  });
}
