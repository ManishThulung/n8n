"use client";

import { Handle, Position } from "@xyflow/react";

const HttpAction = ({ data }: { data: any }) => {
  return (
    <div className="p-4 border-2 border-black">
      {data.label}
      {/* {JSON.stringify(data)}s */}
      <Handle
        type="target"
        position={Position.Left}
        // onConnect={(params) => console.log("handle onConnect", params)}
        // isConnectable={true}
      />
      <p>this is my action node</p>
      <Handle type="source" position={Position.Right} />
    </div>
  );
};

export default HttpAction;
