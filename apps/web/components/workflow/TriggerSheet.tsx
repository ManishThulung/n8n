"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { TriggerIntervals } from "@n8n/lib/enums/intervals";
import { scheduleTriggerSchema } from "@n8n/schema/zod/trigger/schedule.schema";
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
import { Node } from "@xyflow/react";
import { Dispatch, SetStateAction, useState } from "react";
import { useForm } from "react-hook-form";
import z from "zod";

// export type NodeType="Trigger" | "Action"

const TriggerSheet = ({
  setNodes,
}: {
  setNodes: Dispatch<SetStateAction<Node[]>>;
}) => {
  const [isSheetOpen, setIsSheetOpen] = useState<boolean>(false);
  const [isDialogOpen, setIsDialogOpen] = useState<boolean>(false);

  const form = useForm({
    resolver: zodResolver(scheduleTriggerSchema),
    defaultValues: {
      interval: TriggerIntervals.MINUTES,
    },
  });
  const interval = form.watch("interval");

  function onSubmit(values: z.infer<typeof scheduleTriggerSchema>) {
    const data: Node = {
      id: "schedule",
      type: "schedule-trigger",
      data: {
        label: `Runs on each ${values.minutes} minutes`,
        metadata: {
          values,
        },
        nodeType: "Trigger",
      },
      position: { x: 100, y: 100 },
    };
    setNodes((node) => [...node, data]);
    setIsDialogOpen(false);
    setIsSheetOpen(false);
  }

  const handleDialogOpen = () => {
    setIsDialogOpen(true);
  };

  const handleCloseDialog = () => {
    setIsSheetOpen(false);
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
    setNodes((node) => [...node, data]);
  };
  return (
    <Sheet open={isSheetOpen} onOpenChange={setIsSheetOpen}>
      <SheetTrigger className="w-full h-full flex justify-center items-center">
        Start workflow
      </SheetTrigger>
      <SheetContent>
        <SheetHeader>
          <SheetTitle>Start building your workflow?</SheetTitle>
          <div className="flex justify-start items-center gap-4 flex-col">
            <AlertDialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
              <AlertDialogTrigger asChild>
                <Button onClick={handleDialogOpen}>Schedule</Button>
              </AlertDialogTrigger>
              <AlertDialogContent>
                <AlertDialogHeader>
                  <AlertDialogTitle>Configure your schedule</AlertDialogTitle>
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
                        name="interval"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Select interval</FormLabel>
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
                                      Interval
                                    </SelectLabel>
                                    {Object.values(TriggerIntervals).map(
                                      (interval) => (
                                        <SelectItem
                                          key={interval}
                                          value={interval}
                                          className="capitalize"
                                        >
                                          {interval}
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
                      {interval === TriggerIntervals.SECONDS && (
                        <FormField
                          control={form.control}
                          name="seconds"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>Seconds between triggers</FormLabel>
                              <FormControl>
                                <Input placeholder="30" {...field} />
                              </FormControl>
                              <FormDescription>
                                Must be between 1-59.
                              </FormDescription>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                      )}

                      {interval === TriggerIntervals.MINUTES && (
                        <FormField
                          control={form.control}
                          name="minutes"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>Minutes between triggers</FormLabel>
                              <FormControl>
                                <Input placeholder="5" {...field} />
                              </FormControl>
                              <FormDescription>
                                Must be in range 1-59.
                              </FormDescription>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                      )}

                      {interval === TriggerIntervals.HOURS && (
                        <>
                          <FormField
                            control={form.control}
                            name="hours"
                            render={({ field }) => (
                              <FormItem>
                                <FormLabel>Hours between triggers</FormLabel>
                                <FormControl>
                                  <Input placeholder="1" {...field} />
                                </FormControl>
                                <FormDescription>
                                  Must be in range 1-23.
                                </FormDescription>
                                <FormMessage />
                              </FormItem>
                            )}
                          />
                          <FormField
                            control={form.control}
                            name="minutes"
                            render={({ field }) => (
                              <FormItem>
                                <FormLabel>Minutes between triggers</FormLabel>
                                <FormControl>
                                  <Input placeholder="5" {...field} />
                                </FormControl>
                                <FormDescription>
                                  Must be in range 1-59.
                                </FormDescription>
                                <FormMessage />
                              </FormItem>
                            )}
                          />
                        </>
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
            <Button onClick={handleManualTrigger}>Manual</Button>
          </div>
        </SheetHeader>
      </SheetContent>
    </Sheet>
  );
};

export default TriggerSheet;
