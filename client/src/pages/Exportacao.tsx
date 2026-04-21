import React, { useState } from "react";
import {
  FileText,
  Download,
  Copy,
  Share2,
  Printer,
  Music,
  Users,
  BookOpen,
} from "lucide-react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

export default function Exportacao() {
  const [selectedCelebracao, setSelectedCelebracao] = useState(1);
  const [exportFormat, setExportFormat] = useState<string | null>(null);

  const celebracoes = [
    {
      id: 1,
      titulo: "Missa Dominical",
      data: "14 de Abril, 10:00",
      musicas: 8,
      leituras: 3,
      membros: 5,
    },
    {
      id: 2,
      titulo: "Celebração da Palavra",
      data: "15 de Abril, 19:00",
      musicas: 5,
      leituras: 2,
      membros: 4,
    },
  ];

  const exportOptions = [
    {
      id: "roteiro",
      titulo: "Roteiro Completo",
      descricao: "Ordem de celebração com músicas, leituras e equipe",
      icon: FileText,
      color: "from-blue-500 to-blue-600",
      formato: "PDF",
    },
    {
      id: "folha-canto",
      titulo: "Folha de Canto",
      descricao: "Letra e cifras de todas as músicas",
      icon: Music,
      color: "from-pink-500 to-pink-600",
      formato: "PDF",
    },
    {
      id: "folha-equipe",
      titulo: "Folha da Equipe",
      descricao: "Escalação, funções e instruções",
      icon: Users,
      color: "from-purple-500 to-purple-600",
      formato: "PDF",
    },
    {
      id: "leituras",
      titulo: "Leituras",
      descricao: "Textos completos das leituras do dia",
      icon: BookOpen,
      color: "from-green-500 to-green-600",
      formato: "PDF",
    },
  ];

  const selectedCelebracaoData = celebracoes.find((c) => c.id === selectedCelebracao);

  return (
    <div className="p-8 space-y-8">
      {/* Header */}
      <div className="space-y-2">
        <h1 className="text-4xl font-bold text-white">Exportação</h1>
        <p className="text-sky-700">
          Exporte celebrações em diferentes formatos
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Main Content */}
        <div className="lg:col-span-2 space-y-6">
          {/* Seleção de Celebração */}
          <Card className="bg-gradient-to-br from-blue-100 to-blue-50 border-sky-300/50">
            <div className="p-6 space-y-4">
              <h2 className="text-lg font-bold text-white">Selecione a Celebração</h2>
              <div className="space-y-2">
                {celebracoes.map((celebracao) => (
                  <button
                    key={celebracao.id}
                    onClick={() => setSelectedCelebracao(celebracao.id)}
                    className={`w-full p-4 rounded-lg text-left transition-all border-2 ${
                      selectedCelebracao === celebracao.id
                        ? "bg-gradient-to-r from-amber-500/20 to-amber-600/20 border-amber-500/50"
                        : "bg-slate-700/30 border-sky-300/50 hover:border-amber-500/30"
                    }`}
                  >
                    <div className="flex items-start justify-between">
                      <div>
                        <p className="font-semibold text-white">
                          {celebracao.titulo}
                        </p>
                        <p className="text-sm text-sky-700 mt-1">
                          {celebracao.data}
                        </p>
                      </div>
                      <div className="flex gap-4 text-sm">
                        <span className="text-amber-400">
                          🎵 {celebracao.musicas}
                        </span>
                        <span className="text-green-400">
                          📖 {celebracao.leituras}
                        </span>
                        <span className="text-sky-600">
                          👥 {celebracao.membros}
                        </span>
                      </div>
                    </div>
                  </button>
                ))}
              </div>
            </div>
          </Card>

          {/* Opções de Exportação */}
          <div className="space-y-4">
            <h2 className="text-lg font-bold text-white">Formatos de Exportação</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {exportOptions.map((option) => {
                const Icon = option.icon;
                return (
                  <Card
                    key={option.id}
                    className={`bg-gradient-to-br from-blue-100 to-blue-50 border-2 cursor-pointer transition-all group hover:border-amber-500/50 ${
                      exportFormat === option.id
                        ? "border-amber-500/50"
                        : "border-sky-300/50"
                    }`}
                    onClick={() => setExportFormat(option.id)}
                  >
                    <div className="p-6 space-y-4">
                      <div className="flex items-start justify-between">
                        <div
                          className={`w-12 h-12 rounded-lg bg-gradient-to-br ${option.color} flex items-center justify-center`}
                        >
                          <Icon className="w-6 h-6 text-white" />
                        </div>
                        <span className="text-xs px-2 py-1 rounded bg-slate-700 text-sky-800">
                          {option.formato}
                        </span>
                      </div>
                      <div>
                        <h3 className="font-semibold text-white group-hover:text-amber-400 transition-colors">
                          {option.titulo}
                        </h3>
                        <p className="text-sm text-sky-700 mt-1">
                          {option.descricao}
                        </p>
                      </div>
                    </div>
                  </Card>
                );
              })}
            </div>
          </div>

          {/* Preview */}
          {exportFormat && (
            <Card className="bg-gradient-to-br from-blue-100 to-blue-50 border-sky-300/50">
              <div className="p-6 space-y-4">
                <h3 className="text-lg font-bold text-white">
                  Preview - {exportOptions.find((o) => o.id === exportFormat)?.titulo}
                </h3>
                <div className="bg-white text-slate-900 p-6 rounded-lg space-y-4 max-h-96 overflow-y-auto">
                  <div className="text-center border-b pb-4">
                    <h2 className="text-2xl font-bold">
                      {selectedCelebracaoData?.titulo}
                    </h2>
                    <p className="text-sm text-slate-600">
                      {selectedCelebracaoData?.data}
                    </p>
                  </div>

                  {exportFormat === "roteiro" && (
                    <div className="space-y-3">
                      <div>
                        <h4 className="font-bold text-sm">Ordem da Celebração</h4>
                        <ol className="text-sm space-y-1 mt-2">
                          <li>1. Entrada - "A Alegria Está no Coração"</li>
                          <li>2. Kyrie - "Senhor, Tende Piedade"</li>
                          <li>3. Glória - "Glória a Deus nas Alturas"</li>
                          <li>4. Leitura - Atos 4, 32-35</li>
                          <li>5. Evangelho - João 20, 19-31</li>
                          <li>6. Santo - "Santo, Santo, Santo"</li>
                          <li>7. Comunhão - "Vinde Todos"</li>
                          <li>8. Saída - "Celebrai com Júbilo"</li>
                        </ol>
                      </div>
                    </div>
                  )}

                  {exportFormat === "folha-canto" && (
                    <div className="space-y-3">
                      <div>
                        <h4 className="font-bold text-sm">A Alegria Está no Coração</h4>
                        <p className="text-xs text-slate-600 mt-1">
                          Comunidade Católica
                        </p>
                        <p className="text-sm mt-2">
                          A alegria está no coração<br/>
                          De quem segue a Jesus<br/>
                          Com fé e devoção<br/>
                          Caminhamos na luz
                        </p>
                        <p className="text-sm font-mono mt-2">
                          Am - Dm - G - C<br/>
                          F - Bb - C - Am
                        </p>
                      </div>
                    </div>
                  )}

                  {exportFormat === "folha-equipe" && (
                    <div className="space-y-3">
                      <div>
                        <h4 className="font-bold text-sm">Escalação</h4>
                        <table className="text-xs w-full mt-2">
                          <tbody>
                            <tr className="border-b">
                              <td className="py-1">Maria Silva</td>
                              <td>Maestro</td>
                            </tr>
                            <tr className="border-b">
                              <td className="py-1">João Santos</td>
                              <td>Organista</td>
                            </tr>
                            <tr>
                              <td className="py-1">Pedro Oliveira</td>
                              <td>Acompanhador</td>
                            </tr>
                          </tbody>
                        </table>
                      </div>
                    </div>
                  )}

                  {exportFormat === "leituras" && (
                    <div className="space-y-3">
                      <div>
                        <h4 className="font-bold text-sm">Primeira Leitura</h4>
                        <p className="text-xs text-slate-600">Atos 4, 32-35</p>
                        <p className="text-sm mt-2">
                          Toda a multidão dos crentes era um só coração e uma só
                          alma...
                        </p>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </Card>
          )}
        </div>

        {/* Sidebar */}
        <div className="space-y-6">
          {/* Informações */}
          {selectedCelebracaoData && (
            <Card className="bg-gradient-to-br from-blue-100 to-blue-50 border-sky-300/50">
              <div className="p-6 space-y-4">
                <h3 className="font-semibold text-white">Informações</h3>
                <div className="space-y-3">
                  <div>
                    <p className="text-xs text-sky-700">Celebração</p>
                    <p className="font-semibold text-white">
                      {selectedCelebracaoData.titulo}
                    </p>
                  </div>
                  <div>
                    <p className="text-xs text-sky-700">Data e Hora</p>
                    <p className="font-semibold text-white">
                      {selectedCelebracaoData.data}
                    </p>
                  </div>
                  <div className="grid grid-cols-3 gap-2 pt-2 border-t border-sky-300">
                    <div>
                      <p className="text-xs text-sky-700">Músicas</p>
                      <p className="text-lg font-bold text-amber-400">
                        {selectedCelebracaoData.musicas}
                      </p>
                    </div>
                    <div>
                      <p className="text-xs text-sky-700">Leituras</p>
                      <p className="text-lg font-bold text-green-400">
                        {selectedCelebracaoData.leituras}
                      </p>
                    </div>
                    <div>
                      <p className="text-xs text-sky-700">Membros</p>
                      <p className="text-lg font-bold text-sky-600">
                        {selectedCelebracaoData.membros}
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </Card>
          )}

          {/* Ações */}
          <Card className="bg-gradient-to-br from-blue-100 to-blue-50 border-sky-300/50">
            <div className="p-6 space-y-3">
              <Button
                disabled={!exportFormat}
                className="w-full bg-gradient-to-r from-green-500 to-green-600 hover:from-green-600 hover:to-green-700 text-white border-0 justify-start disabled:opacity-50"
              >
                <Download size={16} className="mr-2" />
                Baixar PDF
              </Button>
              <Button
                disabled={!exportFormat}
                className="w-full bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 text-white border-0 justify-start disabled:opacity-50"
              >
                <Printer size={16} className="mr-2" />
                Imprimir
              </Button>
              <Button
                disabled={!exportFormat}
                className="w-full bg-gradient-to-r from-purple-500 to-purple-600 hover:from-purple-600 hover:to-purple-700 text-white border-0 justify-start disabled:opacity-50"
              >
                <Share2 size={16} className="mr-2" />
                Compartilhar
              </Button>
              <Button
                disabled={!exportFormat}
                className="w-full bg-gradient-to-r from-slate-700 to-blue-50 hover:from-slate-600 hover:to-slate-700 text-white border-0 justify-start disabled:opacity-50"
              >
                <Copy size={16} className="mr-2" />
                Copiar Link
              </Button>
            </div>
          </Card>

          {/* Dicas */}
          <Card className="bg-gradient-to-br from-blue-100 to-blue-50 border-sky-300/50">
            <div className="p-6 space-y-3">
              <h3 className="font-semibold text-white text-sm">Dicas</h3>
              <ul className="text-xs text-sky-700 space-y-2">
                <li>• Exporte com antecedência</li>
                <li>• Compartilhe com a equipe</li>
                <li>• Imprima para o dia da celebração</li>
                <li>• Guarde cópia digital</li>
              </ul>
            </div>
          </Card>
        </div>
      </div>
    </div>
  );
}
