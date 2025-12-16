import { BaseEdge, getStraightPath } from "@xyflow/react";

export function CustomEdge({ id, sourceX, sourceY, targetX, targetY }: any) {
  const [edgePath] = getStraightPath({
    sourceX,
    sourceY,
    targetX,
    targetY,
  });

  return (
    <>
      <BaseEdge id={id} path={edgePath} />
    </>
  );
}
