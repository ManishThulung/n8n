"use client";

import { Handle, Position } from "@xyflow/react";

const TriggerManual = ({ data }: { data: any }) => {
  return (
    <div className="p-4 bg-red-500 border-2 border-black">
      {data.label}
      <Handle
        type="source"
        position={Position.Right}
        // onConnect={(params) => console.log("handle onConnect", params)}
        // isConnectable={true}
      />
    </div>
  );
};

export default TriggerManual;
