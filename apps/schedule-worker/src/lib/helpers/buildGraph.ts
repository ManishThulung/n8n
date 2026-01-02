type NodeMap = Map<string, any>;
type EdgeMap = Map<string, string[]>;

export function buildGraph(nodes: any[], edges: any[]) {
  const nodeMap: NodeMap = new Map();
  const adjList: EdgeMap = new Map();
  const inDegree = new Map<string, number>();

  for (const node of nodes) {
    nodeMap.set(node.id, node);
    adjList.set(node.id, []);
    inDegree.set(node.id, 0);
  }

  for (const edge of edges) {
    adjList.get(edge.source)!.push(edge.target);
    inDegree.set(edge.target, (inDegree.get(edge.target) || 0) + 1);
  }

  return { nodeMap, adjList, inDegree };
}
