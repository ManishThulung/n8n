"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { HttpMethods } from "@n8n/lib/enums/intervals";
import { httpActionSchema } from "@n8n/schema/zod/action/http.schema";
import { Button } from "@workspace/ui/components/button";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@workspace/ui/components/form";
import { Input } from "@workspace/ui/components/input";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from "@workspace/ui/components/select";
import { Textarea } from "@workspace/ui/components/textarea";
import { useForm } from "react-hook-form";
import z from "zod";

export const HttpActionForm = ({
  onSubmit,
  onCancel,
}: {
  onSubmit: (data: z.infer<typeof httpActionSchema>) => void;
  onCancel: () => void;
}) => {
  const form = useForm({
    resolver: zodResolver(httpActionSchema),
    defaultValues: {
      url: "",
      method: "",
    },
  });

  const method = form.watch("method");

  return (
    <Form {...form}>
      <form
        onSubmit={form.handleSubmit(onSubmit)}
        className="flex gap-4 flex-col"
      >
        <FormField
          control={form.control}
          name="url"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Select interval</FormLabel>
              <Input placeholder="https://n8n.com/my-meetings" {...field} />
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="method"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Select method</FormLabel>
              <FormControl>
                <Select
                  defaultValue={field.value}
                  onValueChange={field.onChange}
                >
                  <SelectTrigger className="w-full">
                    <SelectValue placeholder="Select a fruit" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectGroup>
                      <SelectLabel className="capitalize">Method</SelectLabel>
                      {Object.values(HttpMethods).map((method) => (
                        <SelectItem
                          key={method}
                          value={method}
                          className="capitalize"
                        >
                          {method}
                        </SelectItem>
                      ))}
                    </SelectGroup>
                  </SelectContent>
                </Select>
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        {method === HttpMethods.GET && (
          <FormField
            control={form.control}
            name="query"
            render={({ field }) => (
              <FormItem>
                <FormLabel>URL query</FormLabel>
                <FormControl>
                  <Input placeholder="username=ram" {...field} />
                </FormControl>
                <FormDescription>
                  This query field is an optional.
                </FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />
        )}
        {method === HttpMethods.POST && (
          <FormField
            control={form.control}
            name="body"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Payload</FormLabel>
                <FormControl>
                  <Textarea placeholder="{username:ram}" {...field} />
                </FormControl>
                <FormDescription>
                  What does your payload looks like?
                </FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />
        )}

        <div className="flex gap-4 justify-end items-center w-full">
          <Button className="w-fit cursor-pointer" type="submit">
            Submit
          </Button>
          <Button
            className="w-fit cursor-pointer"
            variant={"destructive"}
            onClick={onCancel}
            type="button"
          >
            Cancel
          </Button>
        </div>
      </form>
    </Form>
  );
};
