"use client";

import * as z from "zod";
import axios from "axios";
import qs from "query-string";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";

import { Form, FormControl, FormField, FormItem } from "../ui/form";
import { Input } from "../ui/input";
import { Paperclip } from "lucide-react";
import { useModal } from "@/hooks/use-modal-store";
import EmojiPicker from "../emoji-picker";
import { useRouter } from "next/navigation";

interface CahtInputProps {
  apiUrl: string;
  query: Record<string, any>;
  name: string;
  type: "conversation" | "channel";
}

const formSchema = z.object({
  content: z.string().min(1),
});

export const ChatInput = ({ apiUrl, query, name, type }: CahtInputProps) => {
  const { onOpen } = useModal();
  const router = useRouter();

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      content: "",
    },
  });

  const isLoading = form.formState.isSubmitting;
  const onSubmit = async (values: z.infer<typeof formSchema>) => {
    try {
      const url = qs.stringifyUrl({
        url: apiUrl,
        query,
      });
      await axios.post(url, values);

      form.reset();
      router.refresh();
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)}>
        <FormField
          control={form.control}
          name="content"
          render={({ field }) => (
            <FormItem>
              <FormControl>
                <div className="relative p-4 pb-6">
                  <button
                    type="button"
                    onClick={() => {
                      onOpen("messageFile", { apiUrl, query });
                    }}
                    className="absolute top-7 left-8 h-[24px] w-[24px]
                                    bg-slate-400 dark:bg-slate-400 
                                    hover:bg-slate-500
                                    dark:hover:bg-zinc-300 transition rounded-full p-1 flex
                                    items-center justify-center "
                  >
                    <Paperclip
                      className="
                                        text-white dark:text-[#27273e]
                                        hover:text-slate-200 dark:hover:text-[#424257]"
                    />
                  </button>
                  <Input
                    disabled={isLoading}
                    placeholder={`Message ${
                      type === "conversation" ? name : "#" + name
                    }`}
                    {...field}
                    className="px-14 py-6 focus-visible:ring-0 focus-visible:ring-offset-0
                                        bg-zinc-200 text-slate-600
                                        dark:bg-slate-600 dark:text-slate-200"
                  />
                  <div
                    className="absolute top-7 right-8 
                                     text-slate-400 dark:text-slate-400 
                                     hover:text-slate-500
                                    dark:hover:text-zinc-300 transition"
                  >
                    <EmojiPicker
                      onChange={(emoji: string) =>
                        field.onChange(`${field.value}${emoji}`)
                      }
                    />
                  </div>
                </div>
              </FormControl>
            </FormItem>
          )}
        />
      </form>
    </Form>
  );
};
// TODO: сделать ml-4 в сообщениях
