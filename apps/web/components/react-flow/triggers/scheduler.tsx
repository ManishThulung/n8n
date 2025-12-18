"use client";

import { Handle, Position } from "@xyflow/react";
import "@xyflow/react/dist/style.css";

const TriggerSchedule = ({ data }: { data: any }) => {
  return (
    <div className="p-4 bg-red-500 border-2 border-black">
      {data.label}
      {/* {JSON.stringify(data)}s */}
      <Handle
        type="source"
        position={Position.Right}
        // onConnect={(params) => console.log("handle onConnect", params)}
        // isConnectable={true}
      />
    </div>
  );
};

export default TriggerSchedule;
