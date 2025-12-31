"use client";

import { Handle, Position } from "@xyflow/react";

const CustomeActionNode = ({ data }: { data: any }) => {
  return (
    <div className="p-4 border-2 border-black">
      {data.label}
      <Handle type="target" position={Position.Left} />
      <Handle type="source" position={Position.Right} />
    </div>
  );
};

export default CustomeActionNode;
