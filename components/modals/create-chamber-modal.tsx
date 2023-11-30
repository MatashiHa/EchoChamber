"use client";

import * as z from "zod";
import { useModal } from "@/hooks/use-modal-store";
import { zodResolver } from "@hookform/resolvers/zod";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import axios from "axios";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "../ui/dialog";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "../ui/form";
import FileUpload from "../file-uploader";
import { Button } from "../ui/button";

export const CreateChamberModal = () => {
  const { isOpen, onClose, type } = useModal();
  const router = useRouter();

  // создаём схему проверки вводимых значений
  const formSchema = z.object({
    name: z.string().min(1, {
      message: "Chamber name is required",
    }),
    imageUrl: z.string().min(1, {
      message: "Chamber image is required",
    }),
  });
  // открыто ли модальное окно для создания сервера
  const isModalOpen = isOpen && type === "createChamber";

  // получаем управление формой, задаём валидацию схемой и дефолтные значения
  const form = useForm({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: "",
      imageUrl: "",
    },
  });

  // находится ли форма в состоянии отправки
  const isLoading = form.formState.isSubmitting;

  const onSubmit = async (values: z.infer<typeof formSchema>) => {
    try {
      await axios.post("/api/chambers", values);

      form.reset();
      router.refresh();
      onClose();
    } catch (error) {
      console.log(error);
    }
  };

  const handleClose = () => {
    form.reset();
    onClose();
  };

  return (
    <Dialog open={isModalOpen} onOpenChange={handleClose}>
      <DialogContent className="bg-white text-black p-0 overflow-hidden">
        <DialogHeader className="pt-8 px-6">
          <DialogTitle className="text-2xl font-bold text-center">
            Customize your Chamber
          </DialogTitle>
          <DialogDescription className="text-center text-zinc-500">
            Give your Chamber a name and an image. This can be changed later.
          </DialogDescription>
        </DialogHeader>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
            <div className="space-y-8 px-6">
              <div className="flex items-center justify-center text-center">
                <FormField
                  control={form.control}
                  name="imageUrl"
                  render={({ field }) => (
                    <FormItem>
                      <FormControl>
                        <FileUpload
                          endpoint="chamberImage"
                          value={field.value}
                          onChange={field.onChange}
                        />
                      </FormControl>
                    </FormItem>
                  )}
                />
              </div>

              <FormField
                control={form.control}
                name="name"
                render={({ field }) => (
                  <FormItem className="flex flex-col">
                    <FormLabel className="uppercase text-xs font-bold text-zinc-500 dark:text-secondary/70">
                      Chamber name
                    </FormLabel>
                    <FormControl>
                      <input
                        disabled={isLoading}
                        className="bg-zinc-300/50 border-0 h-8 p-2 rounded focus-visible:ring-0 text-black focus-visible:ring-offset-0"
                        placeholder="Enter chamber name"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
            <DialogFooter className="bg-gray-100 px-6 py-4">
              <Button variant="primary" disabled={isLoading}>
                Create
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
};
