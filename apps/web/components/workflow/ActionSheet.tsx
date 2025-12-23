"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { HttpMethods } from "@n8n/lib/enums/intervals";
import { httpActionSchema } from "@n8n/schema/zod/action/http.schema";
import {
  AlertDialog,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@workspace/ui/components/alert-dialog";
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
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@workspace/ui/components/sheet";
import { Textarea } from "@workspace/ui/components/textarea";
import { Node } from "@xyflow/react";
import { Dispatch, SetStateAction, useState } from "react";
import { useForm } from "react-hook-form";
import z from "zod";

const ActionSheet = ({
  isActionSheetOpen,
  setIsActionSheetOpen,
  handleAdd,
}: {
  isActionSheetOpen: boolean;
  setIsActionSheetOpen: Dispatch<SetStateAction<boolean>>;
  handleAdd: (nodeInfo: Node) => void;
}) => {
  const [isDialogOpen, setIsDialogOpen] = useState<boolean>(false);

  const form = useForm({
    resolver: zodResolver(httpActionSchema),
    defaultValues: {
      url: "",
      method: "",
    },
  });
  const method = form.watch("method");

  function onSubmit(values: z.infer<typeof httpActionSchema>) {
    const data = {
      id: Math.random().toString(),
      type: "http-action",
      data: {
        label: `Makes a http request`,
        metadata: {
          values,
        },
        nodeType: "Action",
      },
    };
    handleAdd(data as unknown as Node);
    setIsDialogOpen(false);
    setIsActionSheetOpen(false);
  }

  const handleDialogOpen = () => {
    setIsDialogOpen(true);
  };

  const handleCloseDialog = () => {
    setIsActionSheetOpen(false);
  };

  const handleManualTrigger = () => {
    const data: Node = {
      id: "manual",
      type: "manual-trigger",
      data: {
        label: "requires manual trigger",
        // metadata:
        nodeType: "Trigger",
      },
      position: { x: 100, y: 100 },
    };
  };
  return (
    <Sheet open={isActionSheetOpen} onOpenChange={setIsActionSheetOpen}>
      <SheetTrigger className="w-full h-full flex justify-center items-center">
        Add Action
      </SheetTrigger>
      <SheetContent>
        <SheetHeader>
          <SheetTitle>Add more actions to your workflow</SheetTitle>
          <div className="flex justify-start items-center gap-4 flex-col">
            <AlertDialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
              <AlertDialogTrigger asChild>
                <Button onClick={handleDialogOpen}>HTTP Request</Button>
              </AlertDialogTrigger>
              <AlertDialogContent>
                <AlertDialogHeader>
                  <AlertDialogTitle>
                    Configure your HTTP Request
                  </AlertDialogTitle>
                  <AlertDialogDescription>
                    Set up when and how often you want your workflow to run.
                  </AlertDialogDescription>

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
                            <Input
                              placeholder="https://n8n.com/my-meetings"
                              {...field}
                            />
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
                                    <SelectLabel className="capitalize">
                                      Method
                                    </SelectLabel>
                                    {Object.values(HttpMethods).map(
                                      (method) => (
                                        <SelectItem
                                          key={method}
                                          value={method}
                                          className="capitalize"
                                        >
                                          {method}
                                        </SelectItem>
                                      )
                                    )}
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
                                <Textarea
                                  placeholder="{username:ram}"
                                  {...field}
                                />
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
                          onClick={handleCloseDialog}
                          type="button"
                        >
                          Cancel
                        </Button>
                      </div>
                    </form>
                  </Form>
                </AlertDialogHeader>
              </AlertDialogContent>
            </AlertDialog>
            <Button onClick={handleManualTrigger}>test</Button>
          </div>
        </SheetHeader>
      </SheetContent>
    </Sheet>
  );
};

export default ActionSheet;
