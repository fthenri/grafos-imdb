import React, { useState, useMemo, useRef, useEffect } from 'react';
import ForceGraph2D from 'react-force-graph-2d';

interface Node {
  id: string | number;
  label?: string;
  val?: number; // Tamanho do nó
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

  // 1. OBSERVER DE RESIZE (Corrige o bug das hitboxes mantendo o canvas perfeito)
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

  // 2. MAPEAMENTO DE VIZINHOS (Da sua estética antiga para realçar conexões)
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

  // 3. UTILITÁRIOS PARA O CAMINHO
  const nodesNoCaminho = useMemo(() => new Set(caminho), [caminho]);

  const isLinkInPath = (link: any) => {
    if (caminho.length < 2) return false;
    const sourceId = typeof link.source === 'object' ? link.source.id : link.source;
    const targetId = typeof link.target === 'object' ? link.target.id : link.target;
    
    for (let i = 0; i < caminho.length - 1; i++) {
      if (
        (String(caminho[i]) === String(sourceId) && String(caminho[i + 1]) === String(targetId)) ||
        (String(caminho[i]) === String(targetId) && String(caminho[i + 1]) === String(sourceId))
      ) {
        return true;
      }
    }
    return false;
  };

  return (
    <div ref={containerRef} className="relative w-full h-full bg-black rounded-lg overflow-hidden border border-gray-800">
      <ForceGraph2D
        ref={fgRef}
        width={dimensions.width}
        height={dimensions.height}
        // Passamos os dados crus, deixando a biblioteca calcular a FÍSICA do zero
        graphData={dadosGrafo} 
        
        enableNodeDrag={true} // Pode arrastar os nós de novo
        onNodeClick={(node) => setSelectedNode(node === selectedNode ? null : node)}
        
        // --- ESTÉTICA DOS NÓS ---
        nodeLabel="label"
        nodeVal={(node: any) => node.val || 1.5}
        nodeColor={(node: any) => {
          const nodeId = String(node.id);
          
          // Se o nó faz parte do caminho traçado pelo algoritmo (Dijkstra/BFS), fica VERMELHO
          if (nodesNoCaminho.has(nodeId)) return '#ff0000';
          
          // Lógica de transparência ao selecionar um nó
          if (selectedNode) {
            const selectedId = String(selectedNode.id);
            const isNeighbor = neighbors.get(selectedId)?.has(nodeId);
            return nodeId === selectedId || isNeighbor ? '#f5c518' : 'rgba(245, 197, 24, 0.2)';
          }
          
          return '#f5c518'; // Cor padrão (Amarelo IMDb)
        }}
        
        // --- ESTÉTICA DAS ARESTAS ---
        linkColor={(link: any) => {
          // Arestas do caminho ficam vermelhas
          if (isLinkInPath(link)) return '#ff0000';
          
          // Lógica de realce ao selecionar o nó
          if (selectedNode) {
            const sourceId = String(typeof link.source === 'object' ? link.source.id : link.source);
            const targetId = String(typeof link.target === 'object' ? link.target.id : link.target);
            const selectedId = String(selectedNode.id);
            const isConnected = sourceId === selectedId || targetId === selectedId;
            return isConnected ? 'rgba(255, 255, 255, 0.8)' : 'rgba(51, 51, 51, 0.1)';
          }
          
          return '#333333'; // Cinza escuro padrão
        }}
        linkWidth={(link: any) => isLinkInPath(link) ? 3 : 1}
        
        // --- ANIMAÇÃO DO CAMINHO (Bolhas passando pelas arestas) ---
        linkDirectionalParticles={(link: any) => isLinkInPath(link) ? 4 : 0}
        linkDirectionalParticleSpeed={0.005}
        
        backgroundColor="#000000"
      />

      {/* --- ABA LATERAL DIREITA AO CLICAR EM UM NÓ --- */}
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