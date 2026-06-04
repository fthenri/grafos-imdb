import { ForceGraph2D } from 'react-force-graph';

export default function GrafoInterativo({ dadosGrafo }) {
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