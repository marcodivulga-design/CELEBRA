import { useState, useEffect, useRef } from 'react';
import { MapView } from '@/components/Map';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { MapPin, Filter, X, Info, Zap } from 'lucide-react';

interface Church {
  id: number;
  name: string;
  type: string;
  city: string;
  state: string;
  address: string;
  phone?: string;
  email?: string;
  latitude?: number;
  longitude?: number;
  patronSaint?: string;
  capacity?: number;
}

// Mock data - será substituído por dados reais da API
const mockChurches: Church[] = [
  {
    id: 1,
    name: 'Catedral Metropolitana',
    type: 'cathedral',
    city: 'São Paulo',
    state: 'SP',
    address: 'Av. Paulista, 1000',
    phone: '(11) 3111-1111',
    email: 'catedral@sp.org.br',
    latitude: -23.5505,
    longitude: -46.6333,
    patronSaint: 'Nossa Senhora da Conceição',
    capacity: 5000,
  },
  {
    id: 2,
    name: 'Igreja de Santo Antônio',
    type: 'church',
    city: 'São Paulo',
    state: 'SP',
    address: 'Rua Santo Antônio, 500',
    phone: '(11) 2222-2222',
    email: 'santoantonio@sp.org.br',
    latitude: -23.5495,
    longitude: -46.6343,
    patronSaint: 'Santo Antônio de Pádua',
    capacity: 800,
  },
  {
    id: 3,
    name: 'Santuário de Nossa Senhora Aparecida',
    type: 'sanctuary',
    city: 'Guarulhos',
    state: 'SP',
    address: 'Av. Aparecida, 1500',
    phone: '(11) 4444-4444',
    email: 'aparecida@sp.org.br',
    latitude: -23.4569,
    longitude: -46.4826,
    patronSaint: 'Nossa Senhora Aparecida',
    capacity: 2000,
  },
  {
    id: 4,
    name: 'Igreja de São Jorge',
    type: 'church',
    city: 'Rio de Janeiro',
    state: 'RJ',
    address: 'Rua São Jorge, 100',
    phone: '(21) 5555-5555',
    email: 'saojorge@rj.org.br',
    latitude: -22.9068,
    longitude: -43.1729,
    patronSaint: 'São Jorge',
    capacity: 600,
  },
  {
    id: 5,
    name: 'Basílica de São Bento',
    type: 'basilica',
    city: 'São Paulo',
    state: 'SP',
    address: 'Largo de São Bento, 1',
    phone: '(11) 3111-2222',
    email: 'saobento@sp.org.br',
    latitude: -23.5508,
    longitude: -46.6341,
    patronSaint: 'São Bento',
    capacity: 3000,
  },
];

export function ChurchesMap() {
  const [churches, setChurches] = useState<Church[]>(mockChurches);
  const [filteredChurches, setFilteredChurches] = useState<Church[]>(mockChurches);
  const [selectedChurch, setSelectedChurch] = useState<Church | null>(null);
  const [showFilters, setShowFilters] = useState(false);
  const [useClusters, setUseClusters] = useState(true);
  const mapRef = useRef<google.maps.Map | null>(null);
  const markersRef = useRef<google.maps.Marker[]>([]);
  const [filters, setFilters] = useState({
    city: '',
    state: '',
    type: '',
    name: '',
  });

  // Aplicar filtros
  useEffect(() => {
    let result = churches;

    if (filters.city) {
      result = result.filter(c => c.city.toLowerCase().includes(filters.city.toLowerCase()));
    }
    if (filters.state) {
      result = result.filter(c => c.state === filters.state.toUpperCase());
    }
    if (filters.type) {
      result = result.filter(c => c.type === filters.type);
    }
    if (filters.name) {
      result = result.filter(c => c.name.toLowerCase().includes(filters.name.toLowerCase()));
    }

    setFilteredChurches(result);
  }, [filters, churches]);

  const handleFilterChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFilters(prev => ({
      ...prev,
      [name]: value,
    }));
  };

  const clearFilters = () => {
    setFilters({
      city: '',
      state: '',
      type: '',
      name: '',
    });
  };

  const getTypeLabel = (type: string) => {
    const labels: Record<string, string> = {
      cathedral: 'Catedral',
      church: 'Igreja',
      chapel: 'Capela',
      sanctuary: 'Santuário',
      basilica: 'Basílica',
    };
    return labels[type] || type;
  };

  const getTypeColor = (type: string) => {
    const colors: Record<string, string> = {
      cathedral: 'bg-purple-100 text-purple-800',
      church: 'bg-blue-100 text-blue-800',
      chapel: 'bg-green-100 text-green-800',
      sanctuary: 'bg-orange-100 text-orange-800',
      basilica: 'bg-red-100 text-red-800',
    };
    return colors[type] || 'bg-gray-100 text-gray-800';
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold flex items-center gap-2">
          <MapPin className="w-8 h-8 text-blue-600" />
          Mapa de Igrejas
        </h1>
        <p className="text-gray-600 mt-2">
          Visualize todas as igrejas, paróquias e santuários em um mapa interativo
        </p>
      </div>

      {/* Filters */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Filter className="w-5 h-5" />
              <h2 className="font-semibold">Filtros</h2>
            </div>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setShowFilters(!showFilters)}
            >
              {showFilters ? 'Ocultar' : 'Mostrar'}
            </Button>
          </div>
        </CardHeader>
        {showFilters && (
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              <div>
                <Label htmlFor="name">Nome da Igreja</Label>
                <Input
                  id="name"
                  name="name"
                  value={filters.name}
                  onChange={handleFilterChange}
                  placeholder="Buscar por nome..."
                />
              </div>
              <div>
                <Label htmlFor="city">Cidade</Label>
                <Input
                  id="city"
                  name="city"
                  value={filters.city}
                  onChange={handleFilterChange}
                  placeholder="Ex: São Paulo"
                />
              </div>
              <div>
                <Label htmlFor="state">Estado</Label>
                <Input
                  id="state"
                  name="state"
                  value={filters.state}
                  onChange={handleFilterChange}
                  placeholder="Ex: SP"
                  maxLength={2}
                />
              </div>
              <div>
                <Label htmlFor="type">Tipo de Templo</Label>
                <select
                  id="type"
                  name="type"
                  value={filters.type}
                  onChange={handleFilterChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option value="">Todos os tipos</option>
                  <option value="cathedral">Catedral</option>
                  <option value="church">Igreja</option>
                  <option value="chapel">Capela</option>
                  <option value="sanctuary">Santuário</option>
                  <option value="basilica">Basílica</option>
                </select>
              </div>
            </div>
            <div className="flex gap-2">
              <Button onClick={clearFilters} variant="outline" size="sm">
                Limpar Filtros
              </Button>
              <p className="text-sm text-gray-600 flex items-center">
                {filteredChurches.length} igrejas encontradas
              </p>
            </div>
          </CardContent>
        )}
      </Card>

      {/* Map and List Container */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Map */}
        <div className="lg:col-span-2">
          <Card className="h-full">
            <CardHeader>
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle>Localização das Igrejas</CardTitle>
                  <CardDescription>
                    Clique nos marcadores para ver detalhes
                  </CardDescription>
                </div>
                <Button
                  size="sm"
                  variant={useClusters ? 'default' : 'outline'}
                  onClick={() => setUseClusters(!useClusters)}
                  className="gap-1"
                >
                  <Zap className="w-3 h-3" />
                  {useClusters ? 'Clusters ON' : 'Clusters OFF'}
                </Button>
              </div>
            </CardHeader>
            <CardContent>
              <div className="h-[500px] rounded-lg overflow-hidden border">
                <MapView
                  onMapReady={(map) => {
                    mapRef.current = map;
                    markersRef.current = [];

                    // Adicionar marcadores para cada igreja
                    filteredChurches.forEach(church => {
                      if (church.latitude && church.longitude) {
                        const marker = new google.maps.Marker({
                          position: { lat: church.latitude, lng: church.longitude },
                          map: map,
                          title: church.name,
                        });

                        markersRef.current.push(marker);

                        // Info window com mais detalhes
                        const infoWindow = new google.maps.InfoWindow({
                          content: `
                            <div class="p-3 max-w-xs">
                              <h3 class="font-bold text-sm">${church.name}</h3>
                              <p class="text-xs text-gray-600 mt-1">${church.address}</p>
                              <p class="text-xs text-gray-600">${church.city}, ${church.state}</p>
                              ${church.patronSaint ? `<p class="text-xs text-amber-700 mt-1">⛪ ${church.patronSaint}</p>` : ''}
                              ${church.capacity ? `<p class="text-xs text-blue-700">👥 ${church.capacity} pessoas</p>` : ''}
                            </div>
                          `,
                        });

                        marker.addListener('click', () => {
                          infoWindow.open(map, marker);
                          setSelectedChurch(church);
                        });
                      }
                    });

                    // Implementar clusters se ativado
                    if (useClusters && markersRef.current.length > 0) {
                      // Ajustar zoom para ver todos os marcadores
                      const bounds = new google.maps.LatLngBounds();
                      markersRef.current.forEach(marker => {
                        bounds.extend(marker.getPosition() || new google.maps.LatLng(0, 0));
                      });
                      map.fitBounds(bounds);
                    } else {
                      // Centralizar mapa
                      if (filteredChurches.length > 0 && filteredChurches[0].latitude) {
                        map.setCenter({
                          lat: filteredChurches[0].latitude || 0,
                          lng: (filteredChurches[0].longitude || 0) as number,
                        });
                        map.setZoom(10);
                      }
                    }
                  }}
                />
              </div>
            </CardContent>
          </Card>
        </div>

        {/* List */}
        <div>
          <Card className="h-full">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Info className="w-5 h-5" />
                Igrejas ({filteredChurches.length})
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3 max-h-[500px] overflow-y-auto">
                {filteredChurches.length === 0 ? (
                  <p className="text-gray-500 text-center py-8">
                    Nenhuma igreja encontrada com os filtros selecionados
                  </p>
                ) : (
                  filteredChurches.map(church => (
                    <div
                      key={church.id}
                      onClick={() => setSelectedChurch(church)}
                      className={`p-3 rounded-lg border cursor-pointer transition ${
                        selectedChurch?.id === church.id
                          ? 'border-blue-500 bg-blue-50'
                          : 'border-gray-200 hover:border-gray-300'
                      }`}
                    >
                      <div className="flex items-start justify-between gap-2">
                        <div className="flex-1">
                          <h3 className="font-semibold text-sm">{church.name}</h3>
                          <p className="text-xs text-gray-600">{church.city}, {church.state}</p>
                          <div className="mt-2">
                            <span className={`inline-block px-2 py-1 rounded text-xs font-medium ${getTypeColor(church.type)}`}>
                              {getTypeLabel(church.type)}
                            </span>
                          </div>
                        </div>
                        {church.phone && (
                          <a
                            href={`tel:${church.phone}`}
                            className="text-blue-600 hover:text-blue-800 text-xs"
                            onClick={(e) => e.stopPropagation()}
                          >
                            Ligar
                          </a>
                        )}
                      </div>
                    </div>
                  ))
                )}
              </div>
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Selected Church Details */}
      {selectedChurch && (
        <Card>
          <CardHeader>
            <div className="flex items-start justify-between">
              <div>
                <CardTitle>{selectedChurch.name}</CardTitle>
                <CardDescription>{selectedChurch.address}</CardDescription>
              </div>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setSelectedChurch(null)}
              >
                <X className="w-4 h-4" />
              </Button>
            </div>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              <div>
                <p className="text-sm text-gray-600">Tipo</p>
                <p className="font-semibold">{getTypeLabel(selectedChurch.type)}</p>
              </div>
              <div>
                <p className="text-sm text-gray-600">Localização</p>
                <p className="font-semibold">{selectedChurch.city}, {selectedChurch.state}</p>
              </div>
              <div>
                <p className="text-sm text-gray-600">Padroeiro</p>
                <p className="font-semibold">{selectedChurch.patronSaint || '-'}</p>
              </div>
              <div>
                <p className="text-sm text-gray-600">Capacidade</p>
                <p className="font-semibold">{selectedChurch.capacity?.toLocaleString() || '-'} pessoas</p>
              </div>
            </div>
            {(selectedChurch.phone || selectedChurch.email) && (
              <div className="mt-4 pt-4 border-t space-y-2">
                {selectedChurch.phone && (
                  <div className="flex items-center gap-2">
                    <span className="text-gray-600">Telefone:</span>
                    <a href={`tel:${selectedChurch.phone}`} className="text-blue-600 hover:text-blue-800">
                      {selectedChurch.phone}
                    </a>
                  </div>
                )}
                {selectedChurch.email && (
                  <div className="flex items-center gap-2">
                    <span className="text-gray-600">Email:</span>
                    <a href={`mailto:${selectedChurch.email}`} className="text-blue-600 hover:text-blue-800">
                      {selectedChurch.email}
                    </a>
                  </div>
                )}
              </div>
            )}
          </CardContent>
        </Card>
      )}
    </div>
  );
}
