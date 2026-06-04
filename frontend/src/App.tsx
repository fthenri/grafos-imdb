import { useState, useEffect } from 'react';
import axios from 'axios';
import GrafoInterativo from './components/GrafoInterativo';
import PainelMetricas from './components/PainelMetricas';

interface Metricas {
  ordem: number;
  tamanho: number;
  densidade: number;
}

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

interface DadosGrafo {
  nodes: Node[];
  links: Link[];
}

interface ResultadoCaminho {
  caminho: string[];
  custo: number;
  tempo_ms: number;
}

export default function App() {
  const [metricas, setMetricas] = useState<Metricas>({ ordem: 0, tamanho: 0, densidade: 0 });
  const [dadosGrafo, setDadosGrafo] = useState<DadosGrafo>({ nodes: [], links: [] });
  const [resultado, setResultado] = useState<ResultadoCaminho>({ caminho: [], custo: 0, tempo_ms: 0 });

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [resMetricas, resGrafo] = await Promise.all([
          axios.get('http://127.0.0.1:5000/api/metricas'),
          axios.get('http://127.0.0.1:5000/api/grafo')
        ]);
        setMetricas(resMetricas.data);
        setDadosGrafo(resGrafo.data);
      } catch (error) {
        console.error("Erro ao buscar dados do Flask:", error);
      }
    };
    fetchData();
  }, []);

  const handleBuscarCaminho = async (origem: string, destino: string, algoritmo: string) => {
    try {
      const res = await axios.post('http://127.0.0.1:5000/api/caminho', {
        origem, destino, algoritmo
      });
      setResultado(res.data);
    } catch (error) {
      console.error("Erro ao buscar caminho:", error);
      alert("Erro ao calcular caminho. Verifique se os nós estão corretos.");
    }
  };

  return (
    <div className="flex flex-col h-screen bg-darkbg text-white font-sans">
      <header className="flex items-center justify-between p-4 bg-darkcard border-b border-gray-800">
        <div className="flex items-center gap-4">
          <div className="bg-imdb text-black font-black text-2xl px-2 py-1 rounded">IMDb</div>
          <h1 className="text-xl font-semibold">Análise de Redes</h1>
        </div>
      </header>

      <main className="flex flex-1 overflow-hidden">
        <div className="flex-1 p-4">
          <GrafoInterativo dadosGrafo={dadosGrafo} caminho={resultado.caminho} />
        </div>
        <PainelMetricas 
          metricas={metricas} 
          nosDisponiveis={dadosGrafo.nodes}
          onBuscar={handleBuscarCaminho}
          resultado={resultado}
        />
      </main>
    </div>
  );
}