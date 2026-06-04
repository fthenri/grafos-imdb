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

export default function App() {
  const [metricas, setMetricas] = useState<Metricas>({ ordem: 0, tamanho: 0, densidade: 0 });
  const [dadosGrafo, setDadosGrafo] = useState<DadosGrafo>({ nodes: [], links: [] });

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

  return (
    <div className="flex flex-col h-screen bg-darkbg text-white font-sans">
      <header className="flex items-center justify-between p-4 bg-darkcard border-b border-gray-800">
        <div className="flex items-center gap-4">
          <div className="bg-imdb text-black font-black text-2xl px-2 py-1 rounded">IMDb</div>
          <h1 className="text-xl font-semibold">Análise de Redes</h1>
        </div>
        <div className="flex gap-2">
           <input type="text" placeholder="Buscar filme..." className="bg-black border border-gray-700 rounded px-3 py-1 focus:outline-none focus:border-imdb" />
        </div>
      </header>

      <main className="flex flex-1 overflow-hidden">
        <div className="flex-1 p-4">
          <GrafoInterativo dadosGrafo={dadosGrafo} />
        </div>
        <PainelMetricas metricas={metricas} />
      </main>
    </div>
  );
}