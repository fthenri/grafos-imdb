import React, { useState, useMemo, useRef, useEffect } from 'react';
import ForceGraph2D from 'react-force-graph-2d';

interface Node {
  id: string | number;
  label?: string;
  val?: number;
  [key: string]: any;
}

interface LinkType {
  source: string | number | any;
  target: string | number | any;
  weight?: number;
  [key: string]: any;
}

interface GrafoInterativoProps {
  dadosGrafo: {
    nodes: Node[];
    links: LinkType[];
  };
  caminho?: string[];
}

const GrafoInterativo: React.FC<GrafoInterativoProps> = ({ dadosGrafo, caminho = [] }) => {
  const fgRef = useRef<any>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const [dimensions, setDimensions] = useState({ width: 800, height: 600 });
  const [selectedNode, setSelectedNode] = useState<Node | null>(null);

  useEffect(() => {
    if (!containerRef.current) return;

    const resizeObserver = new ResizeObserver((entries) => {
      for (let entry of entries) {
        setDimensions({
          width: entry.contentRect.width,
          height: entry.contentRect.height
        });
      }
    });

    resizeObserver.observe(containerRef.current);
    return () => resizeObserver.disconnect();
  }, []);

  const neighbors = useMemo(() => {
    const map = new Map();
    dadosGrafo.links.forEach(link => {
      const source = String(typeof link.source === 'object' ? link.source.id : link.source);
      const target = String(typeof link.target === 'object' ? link.target.id : link.target);
      if (!map.has(source)) map.set(source, new Set());
      if (!map.has(target)) map.set(target, new Set());
      map.get(source).add(target);
      map.get(target).add(source);
    });
    return map;
  }, [dadosGrafo]);

  const nodesVisitados = useMemo(() => new Set(caminho.map(String)), [caminho]);

  const ordemVisita = useMemo(() => { // Mapeia o índice exato de cada nó no caminho para calcular o gradiente de cor
    const map = new Map();
    caminho.forEach((id, index) => map.set(String(id), index));
    return map;
  }, [caminho]);

  return (
    <div ref={containerRef} className="relative w-full h-full bg-black rounded-lg overflow-hidden border border-gray-800">
      <ForceGraph2D
        ref={fgRef}
        width={dimensions.width}
        height={dimensions.height}
        graphData={dadosGrafo} 
        
        enableNodeDrag={true}
        onNodeClick={(node) => setSelectedNode(node === selectedNode ? null : node)}
        
        nodeLabel="label"
        nodeVal={(node: any) => node.val || 1.5}
        nodeColor={(node: any) => {
          const nodeId = String(node.id);
          
          if (selectedNode) {
            const selectedId = String(selectedNode.id);
            const isSelectedOrNeighbor = nodeId === selectedId || neighbors.get(selectedId)?.has(nodeId);
            if (isSelectedOrNeighbor) return '#00ff00';
            return 'rgba(245, 197, 24, 0.2)';
          }
          
          if (nodesVisitados.has(nodeId)) return '#ff0000';
          
          return '#f5c518';
        }}
        
        linkColor={(link: any) => {
          const sourceId = String(typeof link.source === 'object' ? link.source.id : link.source);
          const targetId = String(typeof link.target === 'object' ? link.target.id : link.target);
          
          if (selectedNode) {
            const selectedId = String(selectedNode.id);
            const isConnected = sourceId === selectedId || targetId === selectedId;
            if (isConnected) return '#ffffff';
            return 'rgba(51, 51, 51, 0.1)';
          }
          
          if (nodesVisitados.has(sourceId) && nodesVisitados.has(targetId)) {
            const idxSource = ordemVisita.get(sourceId) ?? 0; // Identifica a ordem de visita da origem
            const idxTarget = ordemVisita.get(targetId) ?? 0; // Identifica a ordem de visita do destino
            const maxIdx = Math.max(idxSource, idxTarget); // Utiliza o nó descoberto por último para pautar a cor da aresta
            const totalNos = Math.max(1, caminho.length - 1);
            const hue = (maxIdx / totalNos) * 240; // Interpola matiz HSL de Vermelho (0) a Azul (240)
            return `hsla(${hue}, 100%, 50%, 0.6)`; // Retorna a cor gerada com opacidade de 0.6
          }
          
          return '#333333';
        }}
        linkWidth={(link: any) => {
          const sourceId = String(typeof link.source === 'object' ? link.source.id : link.source);
          const targetId = String(typeof link.target === 'object' ? link.target.id : link.target);
          
          return (nodesVisitados.has(sourceId) && nodesVisitados.has(targetId)) ? 2 : 1;
        }}
        
        backgroundColor="#000000"
      />

      {selectedNode && (
        <div className="absolute right-4 top-4 bottom-4 w-80 bg-gray-900 bg-opacity-95 backdrop-blur-sm p-4 border border-gray-800 rounded-lg flex flex-col gap-4 z-10 shadow-2xl">
          <h2 className="text-2xl font-bold text-[#f5c518]">{selectedNode.label || 'Título Desconhecido'}</h2>
          <p className="text-sm text-gray-400">ID: {selectedNode.id}</p>
          
          <div className="flex-1">
            <div className="w-full h-40 bg-gray-800 rounded flex items-center justify-center text-gray-500">
              Trailer (Em breve)
            </div>
          </div>
          
          <button 
            onClick={() => setSelectedNode(null)}
            className="mt-auto px-4 py-2 bg-gray-700 hover:bg-gray-600 rounded transition font-semibold text-white"
          >
            Fechar
          </button>
        </div>
      )}
    </div>
  );
};

export default GrafoInterativo;