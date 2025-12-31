"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { emailActionSchema } from "@n8n/schema/zod/action/http.schema";
import { Button } from "@workspace/ui/components/button";
import {
  Form,
  FormField,
  FormItem,
  FormLabel,
} from "@workspace/ui/components/form";
import { Input } from "@workspace/ui/components/input";
import { Textarea } from "@workspace/ui/components/textarea";
import { useForm } from "react-hook-form";
import z from "zod";

export const EmailActionForm = ({
  onSubmit,
  onCancel,
}: {
  onSubmit: (data: z.infer<typeof emailActionSchema>) => void;
  onCancel: () => void;
}) => {
  const form = useForm({
    resolver: zodResolver(emailActionSchema),
    defaultValues: {
      to: "",
      subject: "",
      body: "",
    },
  });

  return (
    <Form {...form}>
      <form
        onSubmit={form.handleSubmit(onSubmit)}
        className="flex flex-col gap-4"
      >
        <FormField
          control={form.control}
          name="to"
          render={({ field }) => (
            <FormItem>
              <FormLabel>To</FormLabel>
              <Input {...field} placeholder="user@email.com" />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="subject"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Subject</FormLabel>
              <Input {...field} placeholder="Welcome!" />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="body"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Body</FormLabel>
              <Textarea {...field} placeholder="This is my email body" />
            </FormItem>
          )}
        />
        <div className="flex justify-end gap-3">
          <Button type="submit">Submit</Button>
          <Button variant="destructive" type="button" onClick={onCancel}>
            Cancel
          </Button>
        </div>
      </form>
    </Form>
  );
};
