"use client";

import { CustomEdge } from "@/components/react-flow/custome-edge";
import {
  ReactFlow,
  addEdge,
  applyEdgeChanges,
  applyNodeChanges,
  type DefaultEdgeOptions,
  type Edge,
  type FitViewOptions,
  type Node,
  type OnConnect,
  type OnEdgesChange,
  type OnNodesChange,
} from "@xyflow/react";
import "@xyflow/react/dist/style.css";
import { useCallback, useState } from "react";
import TriggerSchedule from "@/components/react-flow/triggers/scheduler";
import TriggerSheet from "@/components/workflow/TriggerSheet";
import TriggerManual from "@/components/react-flow/triggers/manual";
import ActionSheet from "@/components/workflow/ActionSheet";

const fitViewOptions: FitViewOptions = {
  padding: 0.2,
};

const defaultEdgeOptions: DefaultEdgeOptions = {
  animated: true,
};

const edgeTypes = {
  "custom-edge": CustomEdge,
};

const nodeTypes = {
  "schedule-trigger": TriggerSchedule,
  "manual-trigger": TriggerManual,
};

export default function Page() {
  const [nodes, setNodes] = useState<Node[]>([]);
  const [edges, setEdges] = useState<Edge[]>([]);
  const [isActionSheetOpen, setIsActionSheetOpen] = useState<boolean>(false);

  const onNodesChange: OnNodesChange = useCallback(
    (changes) => {
      setNodes((nds) => applyNodeChanges(changes, nds));
    },
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

  const onConnectEnd = useCallback((param, connectionInfo) => {
    console.log(param, "param");
    console.log(connectionInfo, "connection infos");
    if (!connectionInfo.isValid) {
      setIsActionSheetOpen(true);
    }
  }, []);

  const handleConnectionEnd = (
    fromNodeId: string,
    position: { x: number; y: number }
  ) => {};
  return (
    <div className="h-screen w-screen">
      {nodes.length <= 0 ? (
        <TriggerSheet setNodes={setNodes} />
      ) : (
        <>
          {JSON.stringify(nodes)}

          <ReactFlow
            nodes={nodes}
            edges={edges}
            onNodesChange={onNodesChange}
            onEdgesChange={onEdgesChange}
            onConnect={onConnect}
            fitView
            fitViewOptions={fitViewOptions}
            defaultEdgeOptions={defaultEdgeOptions}
            edgeTypes={edgeTypes}
            nodeTypes={nodeTypes}
            onConnectEnd={onConnectEnd}
          />
        </>
      )}

      <ActionSheet
        setIsActionSheetOpen={setIsActionSheetOpen}
        isActionSheetOpen={isActionSheetOpen}
        setNodes={setNodes}
      />
    </div>
  );
}
