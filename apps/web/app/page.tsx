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
import { useCallback, useState } from "react";
import TriggerSchedule from "@/components/react-flow/triggers/scheduler";
import TriggerSheet from "@/components/workflow/TriggerSheet";
import TriggerManual from "@/components/react-flow/triggers/manual";
import ActionSheet from "@/components/workflow/ActionSheet";
import HttpAction from "@/components/react-flow/actions/http-request";
import { Button } from "@workspace/ui/components/button";

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
  "http-action": HttpAction,
};

export default function Page() {
  const [nodes, setNodes] = useState<Node[]>([]);
  const [edges, setEdges] = useState<Edge[]>([]);
  const [isActionSheetOpen, setIsActionSheetOpen] = useState<boolean>(false);
  const [newNodeInfo, setNewNodeInfo] = useState<{
    fromNodeId: string;
    nodePosition: { x: number; y: number };
  } | null>(null);

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

  const onConnectEnd = useCallback((_: any, connectionInfo: any) => {
    if (!connectionInfo.isValid) {
      setIsActionSheetOpen(true);
      setNewNodeInfo({
        fromNodeId: connectionInfo.fromNode.id,
        nodePosition: connectionInfo.to,
      });
    }
  }, []);

  const handleAddActionNode = (nodeInfo: Node) => {
    setNodes((nds) => [
      ...nds,
      { ...nodeInfo, position: newNodeInfo!.nodePosition },
    ]);

    setEdges((item) => [
      ...item,
      {
        id: `${newNodeInfo!.fromNodeId}-to-${nodeInfo.id}`,
        source: newNodeInfo!.fromNodeId,
        target: nodeInfo.id,
        animated: true,
      },
    ]);
  };

  const handleExecute = () => {
    console.log("execute that workflow");
  };
  return (
    <div className="h-screen w-screen p-4">
      {nodes.length >= 1 && (
        <div className="w-full text-end">
          <Button
            variant="default"
            onClick={handleExecute}
            disabled={nodes.length >= 2 || edges.length >= 1}
          >
            Save
          </Button>
        </div>
      )}
      {nodes.length <= 0 ? (
        <TriggerSheet setNodes={setNodes} />
      ) : (
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
      )}

      {isActionSheetOpen && (
        <ActionSheet
          setIsActionSheetOpen={setIsActionSheetOpen}
          isActionSheetOpen={isActionSheetOpen}
          handleAdd={(nodeInfo) => handleAddActionNode(nodeInfo)}
        />
      )}
    </div>
  );
}
