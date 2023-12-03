import { useSocket } from "@/components/providers/socket-provider";
import { Member, Message, Profile } from "@prisma/client";
import { useQueryClient } from "@tanstack/react-query";
import { useEffect } from "react";

type ChatSocketProps = {
  addKey: string;
  updateKey: string;
  queryKey: string;
};

type MessageWithMemebrWithProfile = Message & {
  member: Member & {
    profile: Profile;
  };
};

export const useChatSocket = ({
  addKey,
  updateKey,
  queryKey,
}: ChatSocketProps) => {
  const { socket } = useSocket();
  const queryClient = useQueryClient();

  useEffect(() => {
    if (!socket) {
      return;
    }
    // обраатываем обновленные данные
    socket.on(updateKey, (message: MessageWithMemebrWithProfile) => {
      // просматриваем "старые" кэшированные данные
      // по индексам ищем совпадения старых и новых данных
      // заменяем старые данные на новые
      queryClient.setQueryData([queryKey], (oldData: any) => {
        if (!oldData || !oldData.pages || oldData.pages.length === 0) {
          return oldData;
        }
        const newData = oldData.pages.map((page: any) => {
          return {
            ...page,
            items: page.items.map((item: MessageWithMemebrWithProfile) => {
              if (item.id === message.id) {
                return message;
              }
              return item;
            }),
          };
        });
        return {
          ...oldData,
          pages: newData,
        };
      });
    });
    // обрабатываем новые данные
    socket.on(addKey, (message: MessageWithMemebrWithProfile) => {
      queryClient.setQueryData([queryKey], (oldData: any) => {
        if (!oldData || !oldData.pages || oldData.pages.lenght === 0) {
          return {
            pages: [
              {
                items: [message],
              },
            ],
          };
        }
        // берём все страницы со старыми данными
        const newData = [...oldData.pages];
        // на первую страницу добавляем новое сообщение
        newData[0] = {
          ...newData[0],
          //на странице будет новое сообщение и остальные сообщения с первой страницы
          items: [message, ...newData[0].items],
        };

        return {
          ...oldData,
          pages: newData,
        };
      });
    });

    return () => {
      socket.off(addKey);
      socket.off(updateKey);
    };
  }, [queryClient, addKey, updateKey, queryKey, socket]);
};
