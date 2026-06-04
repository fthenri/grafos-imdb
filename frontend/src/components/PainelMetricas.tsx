interface Metricas {
  ordem: number;
  tamanho: number;
  densidade: number;
}

interface PainelMetricasProps {
  metricas: Metricas;
}

export default function PainelMetricas({ metricas }: PainelMetricasProps) {
  return (
    <div className="w-80 bg-darkcard p-4 flex flex-col gap-4 border-l border-gray-800 h-full overflow-y-auto">
      <h2 className="text-xl font-bold text-imdb">Métricas Globais</h2>
      
      <div className="bg-black p-3 rounded border border-gray-800">
        <p className="text-gray-400 text-sm">Ordem (Nós)</p>
        <p className="text-2xl font-semibold">{metricas.ordem}</p>
      </div>

      <div className="bg-black p-3 rounded border border-gray-800">
        <p className="text-gray-400 text-sm">Tamanho (Arestas)</p>
        <p className="text-2xl font-semibold">{metricas.tamanho}</p>
      </div>

      <div className="bg-black p-3 rounded border border-gray-800">
        <p className="text-gray-400 text-sm">Densidade</p>
        <p className="text-2xl font-semibold">{metricas.densidade}</p>
      </div>
    </div>
  );
}