import ForceGraph2D from 'react-force-graph-2d';

interface Node {
  id: string | number;
  label?: string;
  [key: string]: any;
}

interface Link {
  source: string | number | any;
  target: string | number | any;
  weight?: number;
  [key: string]: any;
}

interface GrafoInterativoProps {
  dadosGrafo: {
    nodes: Node[];
    links: Link[];
  };
  caminho: string[];
}

export default function GrafoInterativo({ dadosGrafo, caminho }: GrafoInterativoProps) {
  return (
    <div className="w-full h-full bg-black rounded-lg overflow-hidden border border-gray-800">
      <ForceGraph2D
        graphData={dadosGrafo}
        nodeLabel="label"
        nodeColor={(node) => caminho.includes(String(node.id)) ? '#ff0000' : '#f5c518'}
        linkColor={(link) => {
          const sourceId = typeof link.source === 'object' ? link.source.id : link.source;
          const targetId = typeof link.target === 'object' ? link.target.id : link.target;
          const noCaminho = caminho.includes(String(sourceId)) && caminho.includes(String(targetId));
          return noCaminho ? '#ff0000' : '#333333';
        }}
        linkWidth={(link) => {
          const sourceId = typeof link.source === 'object' ? link.source.id : link.source;
          const targetId = typeof link.target === 'object' ? link.target.id : link.target;
          return caminho.includes(String(sourceId)) && caminho.includes(String(targetId)) ? 3 : 1;
        }}
        backgroundColor="#000000"
      />
    </div>
  );
}