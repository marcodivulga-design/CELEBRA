import { useState } from "react";
import { MessageCircle, ThumbsUp, User, Plus, Search } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

const FORUM_TOPICS = [
  {
    id: 1,
    title: "Melhor forma de organizar um ministério de música",
    category: "Ministério",
    author: "Pe. João",
    date: new Date(),
    replies: 12,
    likes: 45,
    excerpt: "Gostaria de compartilhar experiências sobre como organizar um ministério de música eficiente...",
    posts: [
      {
        id: 1,
        author: "Pe. João",
        content: "Gostaria de compartilhar experiências sobre como organizar um ministério de música eficiente na paróquia.",
        date: new Date(),
        likes: 10
      },
      {
        id: 2,
        author: "Maria Silva",
        content: "Ótima pergunta! Na nossa paróquia fazemos reuniões mensais para planejar as celebrações...",
        date: new Date(Date.now() - 1 * 60 * 60 * 1000),
        likes: 8
      }
    ]
  },
  {
    id: 2,
    title: "Dúvidas sobre interpretação de cifras",
    category: "Música",
    author: "Carlos",
    date: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000),
    replies: 8,
    likes: 23,
    excerpt: "Tenho dúvidas sobre como interpretar algumas cifras em músicas litúrgicas..."
  },
  {
    id: 3,
    title: "Experiências com Suno para arranjos",
    category: "Tecnologia",
    author: "Ana",
    date: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000),
    replies: 15,
    likes: 67,
    excerpt: "Alguém já usou Suno para criar arranjos de músicas católicas? Gostaria de saber as experiências..."
  }
];

export default function ForumPage() {
  const [selectedTopic, setSelectedTopic] = useState<typeof FORUM_TOPICS[0] | null>(FORUM_TOPICS[0]);
  const [searchQuery, setSearchQuery] = useState("");
  const [newPost, setNewPost] = useState("");

  const filteredTopics = FORUM_TOPICS.filter(topic =>
    topic.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
    topic.category.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handlePostReply = () => {
    if (newPost.trim()) {
      alert("Post adicionado com sucesso!");
      setNewPost("");
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-sky-50 to-white py-8 px-4">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-sky-900 mb-2 font-playfair">
            Fórum de Discussão
          </h1>
          <p className="text-gray-600">
            Compartilhe experiências e tire dúvidas com a comunidade CELEBRA
          </p>
        </div>

        {/* Search and New Topic */}
        <div className="flex gap-3 mb-6 flex-wrap">
          <div className="flex-1 min-w-64 relative">
            <Search className="absolute left-3 top-3 w-5 h-5 text-gray-400" />
            <Input
              placeholder="Buscar tópicos..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10 border-sky-200"
            />
          </div>
          <Button className="bg-green-500 hover:bg-green-600 text-white flex items-center gap-2">
            <Plus className="w-5 h-5" />
            Novo Tópico
          </Button>
        </div>

        {/* Main Content */}
        <div className="grid lg:grid-cols-3 gap-6">
          {/* Topics List */}
          <div className="lg:col-span-1">
            <div className="space-y-2">
              {filteredTopics.map((topic) => (
                <div
                  key={topic.id}
                  onClick={() => setSelectedTopic(topic)}
                  className={`p-4 rounded-lg cursor-pointer transition-all border ${
                    selectedTopic?.id === topic.id
                      ? "bg-sky-100 border-sky-400 shadow-md"
                      : "bg-white border-sky-200 hover:bg-sky-50"
                  }`}
                >
                  <div className="flex items-start justify-between gap-2 mb-2">
                    <span className="text-xs font-semibold text-sky-600 bg-sky-100 px-2 py-1 rounded">
                      {topic.category}
                    </span>
                    <span className="text-xs text-gray-500">
                      {topic.replies}
                    </span>
                  </div>
                  <h3 className="font-semibold text-sky-900 text-sm line-clamp-2 mb-1">
                    {topic.title}
                  </h3>
                  <p className="text-xs text-gray-500">
                    por {topic.author}
                  </p>
                </div>
              ))}
            </div>
          </div>

          {/* Topic Detail */}
          <div className="lg:col-span-2">
            {selectedTopic && (
              <div className="bg-white rounded-2xl shadow-lg p-6 border-l-4 border-sky-400">
                {/* Topic Header */}
                <div className="mb-6 pb-6 border-b border-sky-200">
                  <div className="flex items-center gap-2 mb-3">
                    <span className="text-xs font-semibold text-sky-600 bg-sky-100 px-2 py-1 rounded">
                      {selectedTopic.category}
                    </span>
                  </div>
                  <h2 className="text-2xl font-bold text-sky-900 mb-3 font-playfair">
                    {selectedTopic.title}
                  </h2>
                  <p className="text-sm text-gray-600 mb-3">
                    Iniciado por <strong>{selectedTopic.author}</strong> em{" "}
                    {selectedTopic.date.toLocaleDateString("pt-BR")}
                  </p>
                  <div className="flex gap-4 text-sm text-gray-600">
                    <span className="flex items-center gap-1">
                      <MessageCircle className="w-4 h-4" />
                      {selectedTopic.replies} respostas
                    </span>
                    <span className="flex items-center gap-1">
                      <ThumbsUp className="w-4 h-4" />
                      {selectedTopic.likes} curtidas
                    </span>
                  </div>
                </div>

                {/* Posts */}
                {selectedTopic.posts && (
                  <div className="space-y-4 mb-6">
                    {selectedTopic.posts.map((post) => (
                      <div key={post.id} className="bg-sky-50 rounded-lg p-4 border border-sky-200">
                        <div className="flex items-center gap-2 mb-3">
                          <div className="w-8 h-8 rounded-full bg-sky-300 flex items-center justify-center">
                            <User className="w-4 h-4 text-white" />
                          </div>
                          <div>
                            <p className="font-semibold text-sky-900 text-sm">
                              {post.author}
                            </p>
                            <p className="text-xs text-gray-500">
                              {post.date.toLocaleDateString("pt-BR")}
                            </p>
                          </div>
                        </div>
                        <p className="text-gray-700 mb-3">
                          {post.content}
                        </p>
                        <button className="text-xs text-sky-600 hover:text-sky-700 flex items-center gap-1">
                          <ThumbsUp className="w-3 h-3" />
                          {post.likes} curtidas
                        </button>
                      </div>
                    ))}
                  </div>
                )}

                {/* New Reply */}
                <div className="border-t border-sky-200 pt-6">
                  <h3 className="font-semibold text-sky-900 mb-3">
                    Adicionar Resposta
                  </h3>
                  <textarea
                    value={newPost}
                    onChange={(e) => setNewPost(e.target.value)}
                    placeholder="Compartilhe sua experiência ou tire uma dúvida..."
                    className="w-full p-3 border border-sky-200 rounded-lg mb-3 focus:outline-none focus:ring-2 focus:ring-sky-400"
                    rows={4}
                  />
                  <Button
                    onClick={handlePostReply}
                    className="bg-sky-500 hover:bg-sky-600 text-white"
                  >
                    Enviar Resposta
                  </Button>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
