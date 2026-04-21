import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Heart, ShoppingCart, DollarSign, Music, BookOpen, Gift } from "lucide-react";

interface DonationOption {
  id: number;
  title: string;
  description: string;
  amount: number;
  icon: React.ReactNode;
  color: string;
}

interface MarketplaceItem {
  id: number;
  title: string;
  description: string;
  price: number;
  category: "arrangements" | "resources" | "courses";
  image: string;
  author: string;
}

const donationOptions: DonationOption[] = [
  {
    id: 1,
    title: "Doação Pequena",
    description: "Apoie nossa missão",
    amount: 25,
    icon: <Heart className="w-8 h-8" />,
    color: "from-pink-500 to-rose-500",
  },
  {
    id: 2,
    title: "Doação Média",
    description: "Ajude a expandir",
    amount: 50,
    icon: <Heart className="w-8 h-8" />,
    color: "from-red-500 to-pink-500",
  },
  {
    id: 3,
    title: "Doação Grande",
    description: "Transforme comunidades",
    amount: 100,
    icon: <Heart className="w-8 h-8" />,
    color: "from-orange-500 to-red-500",
  },
  {
    id: 4,
    title: "Doação Personalizada",
    description: "Escolha o valor",
    amount: 0,
    icon: <Gift className="w-8 h-8" />,
    color: "from-yellow-500 to-orange-500",
  },
];

const marketplaceItems: MarketplaceItem[] = [
  {
    id: 1,
    title: "Arranjo Coral - Ave Maria",
    description: "Arranjo profissional para coral de 4 vozes",
    price: 29.9,
    category: "arrangements",
    image: "https://webdev-static-assets-prod.s3.us-east-1.amazonaws.com/hero-hands-prayer.png",
    author: "Maestro João Silva",
  },
  {
    id: 2,
    title: "Guia Completo de Liturgia das Horas",
    description: "Recurso digital com todos os textos e instruções",
    price: 19.9,
    category: "resources",
    image: "https://webdev-static-assets-prod.s3.us-east-1.amazonaws.com/hero-praying-church.png",
    author: "Padre Carlos",
  },
  {
    id: 3,
    title: "Curso: Técnica Vocal Litúrgica",
    description: "5 módulos com vídeos e exercícios práticos",
    price: 49.9,
    category: "courses",
    image: "https://webdev-static-assets-prod.s3.us-east-1.amazonaws.com/hero-community-celebration.png",
    author: "Cantora Marta",
  },
  {
    id: 4,
    title: "Arranjo Instrumental - Hino Nacional",
    description: "Partitura para orquestra de câmara",
    price: 39.9,
    category: "arrangements",
    image: "https://webdev-static-assets-prod.s3.us-east-1.amazonaws.com/hero-light-cathedral.png",
    author: "Compositor Pedro",
  },
  {
    id: 5,
    title: "Pacote: 50 Cifras Litúrgicas",
    description: "Coleção de cifras para violão e teclado",
    price: 34.9,
    category: "resources",
    image: "https://webdev-static-assets-prod.s3.us-east-1.amazonaws.com/hero-nature-spirituality.png",
    author: "Músico Lucas",
  },
  {
    id: 6,
    title: "Curso: Direção de Coro Católico",
    description: "Formação completa em 8 módulos",
    price: 79.9,
    category: "courses",
    image: "https://webdev-static-assets-prod.s3.us-east-1.amazonaws.com/hero-praying-church.png",
    author: "Maestro Roberto",
  },
];

export default function DonationsMarketplacePage() {
  const [selectedTab, setSelectedTab] = useState<"donations" | "marketplace">(
    "donations"
  );
  const [customAmount, setCustomAmount] = useState("");
  const [selectedCategory, setSelectedCategory] = useState<
    "all" | "arrangements" | "resources" | "courses"
  >("all");
  const [cart, setCart] = useState<MarketplaceItem[]>([]);

  const filteredItems =
    selectedCategory === "all"
      ? marketplaceItems
      : marketplaceItems.filter((item) => item.category === selectedCategory);

  const addToCart = (item: MarketplaceItem) => {
    setCart([...cart, item]);
  };

  const removeFromCart = (itemId: number) => {
    setCart(cart.filter((item) => item.id !== itemId));
  };

  const cartTotal = cart.reduce((sum, item) => sum + item.price, 0);

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-blue-100 to-blue-50 p-4 md:p-8">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-blue-900 mb-2">
            Doações e Marketplace
          </h1>
          <p className="text-blue-700">
            Apoie a comunidade católica e acesse recursos exclusivos
          </p>
        </div>

        {/* Tabs */}
        <div className="flex gap-4 mb-8">
          <Button
            variant={selectedTab === "donations" ? "default" : "outline"}
            onClick={() => setSelectedTab("donations")}
            className={
              selectedTab === "donations"
                ? "bg-blue-600 hover:bg-blue-700"
                : "border-blue-200"
            }
          >
            <Heart className="w-4 h-4 mr-2" />
            Doações
          </Button>
          <Button
            variant={selectedTab === "marketplace" ? "default" : "outline"}
            onClick={() => setSelectedTab("marketplace")}
            className={
              selectedTab === "marketplace"
                ? "bg-blue-600 hover:bg-blue-700"
                : "border-blue-200"
            }
          >
            <ShoppingCart className="w-4 h-4 mr-2" />
            Marketplace
          </Button>
        </div>

        {/* Donations Section */}
        {selectedTab === "donations" && (
          <div className="space-y-8">
            <div>
              <h2 className="text-2xl font-bold text-blue-900 mb-6">
                Escolha uma forma de apoiar
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                {donationOptions.map((option) => (
                  <Card
                    key={option.id}
                    className={`p-6 border-blue-200 bg-gradient-to-br ${option.color} text-white cursor-pointer hover:shadow-lg transition-shadow`}
                  >
                    <div className="mb-4">{option.icon}</div>
                    <h3 className="font-bold text-lg mb-1">{option.title}</h3>
                    <p className="text-sm opacity-90 mb-4">{option.description}</p>
                    {option.amount > 0 ? (
                      <p className="text-2xl font-bold">R$ {option.amount}</p>
                    ) : (
                      <div className="flex gap-2">
                        <Input
                          type="number"
                          placeholder="R$"
                          value={customAmount}
                          onChange={(e) => setCustomAmount(e.target.value)}
                          className="bg-white text-blue-900 border-0"
                        />
                      </div>
                    )}
                  </Card>
                ))}
              </div>
            </div>

            <Card className="p-8 border-blue-200 bg-white">
              <h3 className="text-xl font-bold text-blue-900 mb-4">
                Informações da Doação
              </h3>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-semibold text-blue-900 mb-2">
                    Nome Completo
                  </label>
                  <Input
                    placeholder="Seu nome"
                    className="border-blue-200 text-blue-900"
                  />
                </div>
                <div>
                  <label className="block text-sm font-semibold text-blue-900 mb-2">
                    Email
                  </label>
                  <Input
                    type="email"
                    placeholder="seu@email.com"
                    className="border-blue-200 text-blue-900"
                  />
                </div>
                <div>
                  <label className="block text-sm font-semibold text-blue-900 mb-2">
                    Mensagem (Opcional)
                  </label>
                  <textarea
                    placeholder="Deixe uma mensagem de apoio..."
                    className="w-full p-3 border border-blue-200 rounded-lg text-blue-900 focus:outline-none focus:ring-2 focus:ring-blue-500"
                    rows={4}
                  />
                </div>
                <Button className="w-full bg-blue-600 hover:bg-blue-700 text-white">
                  <Heart className="w-4 h-4 mr-2" />
                  Fazer Doação
                </Button>
              </div>
            </Card>
          </div>
        )}

        {/* Marketplace Section */}
        {selectedTab === "marketplace" && (
          <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
            {/* Sidebar */}
            <div>
              <Card className="border-blue-200 bg-white p-6">
                <h3 className="font-bold text-blue-900 mb-4">Categorias</h3>
                <div className="space-y-2">
                  {[
                    { id: "all", label: "Todos" },
                    { id: "arrangements", label: "Arranjos" },
                    { id: "resources", label: "Recursos" },
                    { id: "courses", label: "Cursos" },
                  ].map((cat) => (
                    <button
                      key={cat.id}
                      onClick={() =>
                        setSelectedCategory(
                          cat.id as
                            | "all"
                            | "arrangements"
                            | "resources"
                            | "courses"
                        )
                      }
                      className={`w-full text-left px-4 py-2 rounded-lg transition-colors ${
                        selectedCategory === cat.id
                          ? "bg-blue-600 text-white"
                          : "hover:bg-blue-50 text-blue-900"
                      }`}
                    >
                      {cat.label}
                    </button>
                  ))}
                </div>

                {cart.length > 0 && (
                  <div className="mt-8 pt-8 border-t border-blue-200">
                    <h3 className="font-bold text-blue-900 mb-4">
                      Carrinho ({cart.length})
                    </h3>
                    <div className="space-y-2 mb-4 max-h-48 overflow-y-auto">
                      {cart.map((item) => (
                        <div
                          key={item.id}
                          className="flex justify-between items-start bg-blue-50 p-2 rounded text-sm"
                        >
                          <div className="flex-1">
                            <p className="font-semibold text-blue-900">
                              {item.title}
                            </p>
                            <p className="text-blue-600">R$ {item.price}</p>
                          </div>
                          <button
                            onClick={() => removeFromCart(item.id)}
                            className="text-red-500 hover:text-red-700"
                          >
                            ✕
                          </button>
                        </div>
                      ))}
                    </div>
                    <div className="bg-blue-100 p-3 rounded-lg mb-4">
                      <p className="text-sm text-blue-600">Total</p>
                      <p className="text-2xl font-bold text-blue-900">
                        R$ {cartTotal.toFixed(2)}
                      </p>
                    </div>
                    <Button className="w-full bg-blue-600 hover:bg-blue-700 text-white">
                      Finalizar Compra
                    </Button>
                  </div>
                )}
              </Card>
            </div>

            {/* Products Grid */}
            <div className="lg:col-span-3">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {filteredItems.map((item) => (
                  <Card
                    key={item.id}
                    className="overflow-hidden border-blue-200 bg-white hover:shadow-lg transition-shadow"
                  >
                    <div className="aspect-video overflow-hidden bg-blue-100">
                      <img
                        src={item.image}
                        alt={item.title}
                        className="w-full h-full object-cover hover:scale-105 transition-transform"
                      />
                    </div>
                    <div className="p-4">
                      <div className="flex items-start justify-between mb-2">
                        <div>
                          <p className="text-xs font-semibold text-blue-600 uppercase">
                            {item.category === "arrangements"
                              ? "Arranjo"
                              : item.category === "resources"
                                ? "Recurso"
                                : "Curso"}
                          </p>
                          <h3 className="font-bold text-blue-900">
                            {item.title}
                          </h3>
                        </div>
                      </div>
                      <p className="text-sm text-blue-700 mb-3">
                        {item.description}
                      </p>
                      <p className="text-xs text-blue-600 mb-4">
                        Por: {item.author}
                      </p>
                      <div className="flex items-center justify-between">
                        <p className="text-2xl font-bold text-blue-900">
                          R$ {item.price}
                        </p>
                        <Button
                          onClick={() => addToCart(item)}
                          className="bg-blue-600 hover:bg-blue-700 text-white"
                        >
                          <ShoppingCart className="w-4 h-4" />
                        </Button>
                      </div>
                    </div>
                  </Card>
                ))}
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
