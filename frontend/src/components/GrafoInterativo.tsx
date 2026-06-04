import { useState, useMemo } from 'react'; 
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
  const [selectedNode, setSelectedNode] = useState<Node | null>(null); 

  const neighbors = useMemo(() => {
    const map = new Map();
    dadosGrafo.links.forEach(link => {
      const source = typeof link.source === 'object' ? link.source.id : link.source;
      const target = typeof link.target === 'object' ? link.target.id : link.target;
      if (!map.has(source)) map.set(source, new Set());
      if (!map.has(target)) map.set(target, new Set());
      map.get(source).add(target);
      map.get(target).add(source);
    });
    return map;
  }, [dadosGrafo]);

  return (
    <div className="flex w-full h-full gap-4"> 
      <div className="flex-1 bg-black rounded-lg overflow-hidden border border-gray-800">
        <ForceGraph2D
          graphData={dadosGrafo}
          nodeLabel="label"
          enableNodeDrag={false}  
          onNodeClick={(node) => setSelectedNode(node === selectedNode ? null : node)} 
          nodeColor={(node) => {
            if (caminho.includes(String(node.id))) return '#ff0000';
            
            if (selectedNode) {
              const isNeighbor = neighbors.get(selectedNode.id)?.has(node.id);
              return node.id === selectedNode.id || isNeighbor ? '#f5c518' : 'rgba(245, 197, 24, 0.2)';
            }
            return '#f5c518';
          }}
          linkColor={(link) => {
            const sourceId = typeof link.source === 'object' ? link.source.id : link.source;
            const targetId = typeof link.target === 'object' ? link.target.id : link.target;
            const noCaminho = caminho.includes(String(sourceId)) && caminho.includes(String(targetId));
            
            if (noCaminho) return '#ff0000';

            if (selectedNode) { 
              const isConnected = sourceId === selectedNode.id || targetId === selectedNode.id;
              return isConnected ? 'rgba(255, 255, 255, 0.8)' : 'rgba(51, 51, 51, 0.1)';
            }
            return '#333333';
          }}
          linkWidth={(link) => {
            const sourceId = typeof link.source === 'object' ? link.source.id : link.source;
            const targetId = typeof link.target === 'object' ? link.target.id : link.target;
            return caminho.includes(String(sourceId)) && caminho.includes(String(targetId)) ? 3 : 1;
          }}
          backgroundColor="#000000"
        />
      </div>

      {selectedNode && (
        <div className="w-80 bg-darkcard p-4 border border-gray-800 rounded-lg flex flex-col gap-4">
          <h2 className="text-2xl font-bold text-imdb">{selectedNode.label || 'Título Desconhecido'}</h2>
          <p className="text-sm text-gray-400">ID: {selectedNode.id}</p>
          
          <div className="flex-1">
            <div className="w-full h-40 bg-gray-800 rounded flex items-center justify-center text-gray-500">
              Trailer (Em breve)
            </div>
          </div>
          
          <button 
            onClick={() => setSelectedNode(null)}
            className="mt-auto px-4 py-2 bg-gray-700 hover:bg-gray-600 rounded transition font-semibold"
          >
            Fechar
          </button>
        </div>
      )}
    </div>
  );
}