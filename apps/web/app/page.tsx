"use client";

import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@workspace/ui/components/sheet";
import { useState, useCallback } from "react";
import {
  ReactFlow,
  addEdge,
  applyNodeChanges,
  applyEdgeChanges,
  type Node,
  type Edge,
  type FitViewOptions,
  type OnConnect,
  type OnNodesChange,
  type OnEdgesChange,
  type OnNodeDrag,
  type DefaultEdgeOptions,
} from "@xyflow/react";
import "@xyflow/react/dist/style.css";
import { CustomEdge } from "@/components/react-flow/custome-edge";
import { Button } from "@workspace/ui/components/button";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@workspace/ui/components/alert-dialog";
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
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@workspace/ui/components/form";
import { useForm } from "react-hook-form";
import z from "zod";
import { scheduleTriggerSchema } from "@n8n/schema/zod/schedule.schema";
import { zodResolver } from "@hookform/resolvers/zod";
import { TriggerIntervals } from "@n8n/lib/enums/intervals";

const initialNodes: Node[] = [
  // { id: "1", data: { label: "Node 1" }, position: { x: 5, y: 5 } },
  // { id: "2", data: { label: "Node 2" }, position: { x: 5, y: 100 } },
];

const initialEdges: Edge[] = [
  // { id: "e1-2", source: "1", target: "2", type: "custom-edge" },
];

const fitViewOptions: FitViewOptions = {
  padding: 0.2,
};

const defaultEdgeOptions: DefaultEdgeOptions = {
  animated: true,
};

const onNodeDrag: OnNodeDrag = (_, node) => {
  console.log("drag event", node.data);
};

const edgeTypes = {
  "custom-edge": CustomEdge,
};

export default function Page() {
  const [nodes, setNodes] = useState<Node[]>(initialNodes);
  const [edges, setEdges] = useState<Edge[]>(initialEdges);

  const onNodesChange: OnNodesChange = useCallback(
    (changes) => setNodes((nds) => applyNodeChanges(changes, nds)),
    [setNodes]
  );
  const onEdgesChange: OnEdgesChange = useCallback(
    (changes) => setEdges((eds) => applyEdgeChanges(changes, eds)),
    [setEdges]
  );
  const onConnect: OnConnect = useCallback(
    (connection) => setEdges((eds) => addEdge(connection, eds)),
    [setEdges]
  );

  const handleAddNode = (node: Node) => {
    const newNode: Node = {
      id: node.id,
      data: { label: node.data.label },
      position: { x: Math.random() * 400, y: Math.random() * 400 },
    };
    setNodes((nds) => [...nds, newNode]);
  };

  const form = useForm({
    resolver: zodResolver(scheduleTriggerSchema),
    defaultValues: {
      interval: TriggerIntervals.DAYS,
    },
  });

  // 2. Define a submit handler.
  // function onSubmit(values: z.infer<typeof formSchema>) {
  function onSubmit(values: z.infer<typeof scheduleTriggerSchema>) {
    // Do something with the form values.
    // ✅ This will be type-safe and validated.
    console.log(values);
  }

  return (
    <div className="h-screen w-screen">
      {nodes.length <= 0 ? (
        <div className="h-full w-full ">
          <Sheet>
            <SheetTrigger className="w-full h-full flex justify-center items-center">
              <Button variant={"outline"}>Start workflw</Button>
            </SheetTrigger>
            <SheetContent>
              <SheetHeader>
                <SheetTitle>Start building your workflow?</SheetTitle>
                {/* <SheetDescription>
                  
                  </SheetDescription> */}
                <div className="flex justify-start items-center gap-4 flex-col">
                  <AlertDialog>
                    <AlertDialogTrigger asChild>
                      <Button
                        onClick={() =>
                          handleAddNode({
                            id: "1",
                            data: { label: "Schedules" },
                            position: { x: 0, y: 0 },
                          })
                        }
                      >
                        Schedule
                      </Button>
                    </AlertDialogTrigger>
                    <AlertDialogContent>
                      <AlertDialogHeader>
                        <AlertDialogTitle>
                          Configure your schedule
                        </AlertDialogTitle>
                        <AlertDialogDescription>
                          Set up when and how often you want your workflow to
                          run.
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
                                    <Select {...field}>
                                      <SelectTrigger className="w-[180px]">
                                        <SelectValue placeholder="Select a fruit" />
                                      </SelectTrigger>
                                      <SelectContent>
                                        <SelectGroup>
                                          <SelectLabel>Interval</SelectLabel>
                                          {Object.values(TriggerIntervals).map(
                                            (interval) => (
                                              <SelectItem
                                                key={interval}
                                                value={interval}
                                              >
                                                {interval.toUpperCase()}
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
                            {/* <FormField
                              control={form.control}
                              name="username"
                              render={({ field }) => (
                                <FormItem>
                                  <FormLabel>Username</FormLabel>
                                  <FormControl>
                                    <Input placeholder="shadcn" {...field} />
                                  </FormControl>
                                  <FormDescription>
                                    This is your public display name.
                                  </FormDescription>
                                  <FormMessage />
                                </FormItem>
                              )}
                            />
                            <Button type="submit">Submit</Button> */}
                          </form>
                        </Form>

                        <div className="flex gap-4 flex-col">
                          <Input type="email" placeholder="Email" />
                        </div>
                      </AlertDialogHeader>
                      <AlertDialogFooter>
                        <AlertDialogCancel>Cancel</AlertDialogCancel>
                        <AlertDialogAction>Continue</AlertDialogAction>
                      </AlertDialogFooter>
                    </AlertDialogContent>
                  </AlertDialog>

                  <Button
                    onClick={() =>
                      handleAddNode({
                        id: "1",
                        data: { label: "Schedules" },
                        position: { x: 200, y: 200 },
                      })
                    }
                  >
                    Test
                  </Button>
                </div>
              </SheetHeader>
            </SheetContent>
          </Sheet>
        </div>
      ) : (
        <ReactFlow
          nodes={nodes}
          edges={edges}
          onNodesChange={onNodesChange}
          onEdgesChange={onEdgesChange}
          onConnect={onConnect}
          onNodeDrag={onNodeDrag}
          fitView
          fitViewOptions={fitViewOptions}
          defaultEdgeOptions={defaultEdgeOptions}
          edgeTypes={edgeTypes}
        />
      )}
    </div>
  );
}
