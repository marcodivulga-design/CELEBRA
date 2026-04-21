import { useState } from "react";
import { useAuth } from "@/_core/hooks/useAuth";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { AlertCircle, Send, Clock, User } from "lucide-react";

interface PastoralMessage {
  id: number;
  title: string;
  content: string;
  author: string;
  createdAt: string;
  publishedAt?: string;
  status: "draft" | "published" | "scheduled";
}

export function PastoralMessagePage() {
  const { user } = useAuth();
  const [messages, setMessages] = useState<PastoralMessage[]>([
    {
      id: 1,
      title: "Mensagem do Domingo de Páscoa",
      content: "Neste domingo especial, celebramos a ressurreição de Cristo, símbolo de esperança e renovação para toda a humanidade...",
      author: "Pe. João Silva",
      createdAt: "2026-04-14",
      publishedAt: "2026-04-14",
      status: "published",
    },
    {
      id: 2,
      title: "Convite para o Retiro Espiritual",
      content: "Convido toda a comunidade para participar do retiro espiritual que acontecerá no próximo mês...",
      author: "Pe. Maria Santos",
      createdAt: "2026-04-10",
      publishedAt: "2026-04-10",
      status: "published",
    },
  ]);

  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState({
    title: "",
    content: "",
    status: "draft" as const,
  });

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handlePublish = () => {
    if (!formData.title.trim() || !formData.content.trim()) {
      alert("Por favor, preencha título e conteúdo");
      return;
    }

    const newMessage: PastoralMessage = {
      id: messages.length + 1,
      title: formData.title,
      content: formData.content,
      author: user?.name || "Anônimo",
      createdAt: new Date().toISOString().split("T")[0],
      publishedAt: (formData.status as string) === "published" ? new Date().toISOString().split("T")[0] : undefined,
      status: formData.status,
    };

    setMessages([newMessage, ...messages]);
    setFormData({ title: "", content: "", status: "draft" });
    setIsEditing(false);
  };

  const isPriest = user?.role === "admin" || user?.name?.includes("Pe.");

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-50 pt-24 pb-12">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-gray-900 mb-2">📢 Mensagem Pastoral</h1>
          <p className="text-gray-600">Compartilhe mensagens inspiradoras com a comunidade</p>
        </div>

        {/* Permission Alert */}
        {!isPriest && (
          <Card className="mb-6 border-orange-200 bg-orange-50">
            <CardContent className="pt-6 flex items-start gap-3">
              <AlertCircle className="text-orange-600 mt-1 flex-shrink-0" size={20} />
              <div>
                <p className="font-semibold text-orange-900">Acesso Restrito</p>
                <p className="text-sm text-orange-800">Apenas padres podem criar mensagens pastorais</p>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Editor Section */}
        {isPriest && (
          <Card className="mb-8 border-2 border-blue-200">
            <CardHeader className="bg-gradient-to-r from-blue-600 to-indigo-600 text-white rounded-t-lg">
              <CardTitle>✍️ Criar Nova Mensagem</CardTitle>
              <CardDescription className="text-blue-100">
                {isEditing ? "Editando mensagem" : "Escreva uma mensagem inspiradora para sua comunidade"}
              </CardDescription>
            </CardHeader>
            <CardContent className="pt-6 space-y-4">
              {/* Title Input */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Título</label>
                <Input
                  type="text"
                  name="title"
                  value={formData.title}
                  onChange={handleInputChange}
                  placeholder="Ex: Mensagem do Domingo de Páscoa"
                  className="w-full"
                />
              </div>

              {/* Content Editor */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Conteúdo</label>
                <div className="border-2 border-gray-200 rounded-lg overflow-hidden">
                  {/* Toolbar */}
                  <div className="bg-gray-100 p-3 border-b border-gray-200 flex gap-2 flex-wrap">
                    <button className="px-3 py-1 bg-white border border-gray-300 rounded hover:bg-gray-50 text-sm font-medium">
                      <strong>B</strong>
                    </button>
                    <button className="px-3 py-1 bg-white border border-gray-300 rounded hover:bg-gray-50 text-sm font-medium">
                      <em>I</em>
                    </button>
                    <button className="px-3 py-1 bg-white border border-gray-300 rounded hover:bg-gray-50 text-sm font-medium">
                      <u>U</u>
                    </button>
                    <div className="border-l border-gray-300"></div>
                    <button className="px-3 py-1 bg-white border border-gray-300 rounded hover:bg-gray-50 text-sm font-medium">
                      • Lista
                    </button>
                    <button className="px-3 py-1 bg-white border border-gray-300 rounded hover:bg-gray-50 text-sm font-medium">
                      1. Numerada
                    </button>
                  </div>

                  {/* Text Area */}
                  <Textarea
                    name="content"
                    value={formData.content}
                    onChange={handleInputChange}
                    placeholder="Escreva sua mensagem aqui..."
                    className="w-full border-0 rounded-none p-4 min-h-64 resize-none focus:ring-0"
                  />
                </div>
              </div>

              {/* Status Selection */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Status</label>
                <select
                  name="status"
                  value={formData.status}
                  onChange={handleInputChange}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                >
                  <option value="draft">Rascunho</option>
                  <option value="published">Publicar Agora</option>
                  <option value="scheduled">Agendar Publicação</option>
                </select>
              </div>

              {/* Action Buttons */}
              <div className="flex gap-3 pt-4">
                <Button
                  onClick={handlePublish}
                  className="flex-1 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white"
                >
                  <Send size={18} className="mr-2" />
                  {formData.status === "draft" ? "Salvar Rascunho" : "Publicar Mensagem"}
                </Button>
                <Button
                  onClick={() => {
                    setIsEditing(false);
                    setFormData({ title: "", content: "", status: "draft" });
                  }}
                  variant="outline"
                >
                  Cancelar
                </Button>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Messages List */}
        <div className="space-y-4">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">📖 Mensagens Publicadas</h2>

          {messages.length === 0 ? (
            <Card className="text-center py-12">
              <p className="text-gray-500">Nenhuma mensagem publicada ainda</p>
            </Card>
          ) : (
            messages.map((message) => (
              <Card key={message.id} className="hover:shadow-lg transition-shadow">
                <CardHeader>
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <CardTitle className="text-xl text-gray-900">{message.title}</CardTitle>
                      <CardDescription className="mt-2 flex items-center gap-4 text-sm">
                        <span className="flex items-center gap-1">
                          <User size={16} />
                          {message.author}
                        </span>
                        <span className="flex items-center gap-1">
                          <Clock size={16} />
                          {new Date(message.publishedAt || message.createdAt).toLocaleDateString("pt-BR")}
                        </span>
                        <span
                          className={`px-3 py-1 rounded-full text-xs font-semibold ${
                            message.status === "published"
                              ? "bg-green-100 text-green-800"
                              : message.status === "scheduled"
                              ? "bg-yellow-100 text-yellow-800"
                              : "bg-gray-100 text-gray-800"
                          }`}
                        >
                          {message.status === "published"
                            ? "Publicada"
                            : message.status === "scheduled"
                            ? "Agendada"
                            : "Rascunho"}
                        </span>
                      </CardDescription>
                    </div>
                  </div>
                </CardHeader>
                <CardContent>
                  <p className="text-gray-700 leading-relaxed line-clamp-3">{message.content}</p>
                  <Button variant="link" className="mt-4 text-blue-600 hover:text-blue-800">
                    Ler Mensagem Completa →
                  </Button>
                </CardContent>
              </Card>
            ))
          )}
        </div>
      </div>
    </div>
  );
}
