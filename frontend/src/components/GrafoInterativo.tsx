import { ForceGraph2D } from 'react-force-graph';

interface Node {
  id: string | number;
  label?: string;
  [key: string]: any;
}

interface Link {
  source: string | number;
  target: string | number;
  weight?: number;
  [key: string]: any;
}

interface GrafoInterativoProps {
  dadosGrafo: {
    nodes: Node[];
    links: Link[];
  };
}

export default function GrafoInterativo({ dadosGrafo }: GrafoInterativoProps) {
  return (
    <div className="w-full h-full bg-black rounded-lg overflow-hidden border border-gray-800">
      <ForceGraph2D
        graphData={dadosGrafo}
        nodeLabel="label"
        nodeColor={() => '#f5c518'}
        linkColor={() => '#333333'}
        backgroundColor="#000000"
      />
    </div>
  );
}