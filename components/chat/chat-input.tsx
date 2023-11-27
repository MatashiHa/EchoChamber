"use client"

import * as z from "zod"
import axios from "axios"
import qs from "query-string"
import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"

import {
    Form,
    FormControl,
    FormField,
    FormItem
} from "../ui/form"
import { Input } from "../ui/input"
import { Paperclip, SmilePlus } from "lucide-react"

interface CahtInputProps {
    apiUrl: string
    query: Record<string, any>
    name: string
    type: "conversation" | "channel"
}

const formSchema = z.object({
    content: z.string().min(1)
})

export const ChatInput = ({
    apiUrl,
    query,
    name,
    type
}:CahtInputProps) => {

    const form = useForm<z.infer<typeof formSchema>>({
        resolver: zodResolver(formSchema),
        defaultValues: {
            content: ""
        }
    })

    const isLoading = form.formState.isSubmitting
    const onSubmit = async (value: z.infer<typeof formSchema>) => {
        console.log(value)
    }

    return (
        <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)}>
                <FormField 
                    control = {form.control}
                    name = "content"
                    render = {({field}) =>(
                        <FormItem>
                            <FormControl>
                                <div className="relative p-4 pb-6">
                                    <button
                                    type = "button"
                                    onClick = {() => {}}
                                    className="absolute top-7 left-8 h-[24px] w-[24px]
                                    bg-slate-400 dark:bg-slate-400 
                                    derk:hover:bg-zinc-300 transition rounded-full p-1 flex
                                    items-center justify-center "
                                    >
                                        <Paperclip  className="text-white dark:text-[#27273e]"/>
                                    </button>
                                    <Input
                                        disabled = {isLoading}
                                        placeholder={`Message ${type === "conversation"? name : "#" + name}`}
                                        {...field}
                                        className ="px-14 py-6 focus-visible:ring-0 focus-visible:ring-offset-0
                                        bg-zinc-200 text-slate-600
                                        dark:bg-slate-600 dark:text-slate-200"

                                    />
                                    <div className="absolute top-7 right-8">
                                        <SmilePlus />
                                    </div>

                                </div>
                            </FormControl>
                        </FormItem>
                    )}
                />
            </form>
        </Form>

    )
}
// TODO: сделать ml-4 в сообщениях