import { useState, useMemo } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { MapPin, Phone, Mail, Users, Search, Filter } from 'lucide-react';

interface Church {
  id: number;
  name: string;
  type: 'cathedral' | 'church' | 'chapel' | 'sanctuary' | 'basilica';
  city: string;
  state: string;
  address: string;
  phone: string;
  email: string;
  patronSaint: string;
  priests: number;
  capacity: number;
  photoUrl: string;
}

export function CityChurches() {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedState, setSelectedState] = useState<string>('');
  const [selectedCity, setSelectedCity] = useState<string>('');
  const [selectedType, setSelectedType] = useState<string>('');

  // Mock data - será substituído por dados reais da API
  const mockChurches: Church[] = [
    {
      id: 1,
      name: 'Catedral Metropolitana',
      type: 'cathedral',
      city: 'São Paulo',
      state: 'SP',
      address: 'Av. Paulista, 1000',
      phone: '(11) 3333-3333',
      email: 'catedral@sp.org.br',
      patronSaint: 'Nossa Senhora da Conceição',
      priests: 5,
      capacity: 5000,
      photoUrl: 'https://images.unsplash.com/photo-1577720643272-265e434f4fa0?w=500&h=300&fit=crop',
    },
    {
      id: 2,
      name: 'Igreja de Santo Antônio',
      type: 'church',
      city: 'São Paulo',
      state: 'SP',
      address: 'Rua Santo Antônio, 500',
      phone: '(11) 2222-2222',
      email: 'santo-antonio@sp.org.br',
      patronSaint: 'Santo Antônio de Pádua',
      priests: 2,
      capacity: 800,
      photoUrl: 'https://images.unsplash.com/photo-1464207687429-7505649dae38?w=500&h=300&fit=crop',
    },
    {
      id: 3,
      name: 'Capela de São Benedito',
      type: 'chapel',
      city: 'São Paulo',
      state: 'SP',
      address: 'Rua São Benedito, 200',
      phone: '(11) 1111-1111',
      email: 'sao-benedito@sp.org.br',
      patronSaint: 'São Benedito',
      priests: 1,
      capacity: 300,
      photoUrl: 'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=500&h=300&fit=crop',
    },
    {
      id: 4,
      name: 'Santuário de Nossa Senhora Aparecida',
      type: 'sanctuary',
      city: 'Guarulhos',
      state: 'SP',
      address: 'Av. Aparecida, 1500',
      phone: '(11) 4444-4444',
      email: 'aparecida@sp.org.br',
      patronSaint: 'Nossa Senhora Aparecida',
      priests: 3,
      capacity: 2000,
      photoUrl: 'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=500&h=300&fit=crop',
    },
    {
      id: 5,
      name: 'Igreja de São Jorge',
      type: 'church',
      city: 'Rio de Janeiro',
      state: 'RJ',
      address: 'Rua São Jorge, 100',
      phone: '(21) 5555-5555',
      email: 'sao-jorge@rj.org.br',
      patronSaint: 'São Jorge',
      priests: 2,
      capacity: 600,
      photoUrl: 'https://images.unsplash.com/photo-1577720643272-265e434f4fa0?w=500&h=300&fit=crop',
    },
    {
      id: 6,
      name: 'Basílica de São Bento',
      type: 'basilica',
      city: 'Rio de Janeiro',
      state: 'RJ',
      address: 'Rua São Bento, 50',
      phone: '(21) 6666-6666',
      email: 'sao-bento@rj.org.br',
      patronSaint: 'São Bento',
      priests: 4,
      capacity: 3000,
      photoUrl: 'https://images.unsplash.com/photo-1464207687429-7505649dae38?w=500&h=300&fit=crop',
    },
  ];

  const typeLabels = {
    cathedral: { label: 'Catedral', color: 'bg-red-100 text-red-800' },
    church: { label: 'Igreja', color: 'bg-blue-100 text-blue-800' },
    chapel: { label: 'Capela', color: 'bg-green-100 text-green-800' },
    sanctuary: { label: 'Santuário', color: 'bg-purple-100 text-purple-800' },
    basilica: { label: 'Basílica', color: 'bg-yellow-100 text-yellow-800' },
  };

  // Get unique states and cities
  const states = useMemo(() => {
    return Array.from(new Set(mockChurches.map(c => c.state))).sort();
  }, []);

  const cities = useMemo(() => {
    let filtered = mockChurches;
    if (selectedState) {
      filtered = filtered.filter(c => c.state === selectedState);
    }
    return Array.from(new Set(filtered.map(c => c.city))).sort();
  }, [selectedState]);

  // Filter churches
  const filteredChurches = useMemo(() => {
    return mockChurches.filter(church => {
      const matchesSearch = 
        church.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        church.city.toLowerCase().includes(searchQuery.toLowerCase()) ||
        church.patronSaint.toLowerCase().includes(searchQuery.toLowerCase());
      
      const matchesState = !selectedState || church.state === selectedState;
      const matchesCity = !selectedCity || church.city === selectedCity;
      const matchesType = !selectedType || church.type === selectedType;

      return matchesSearch && matchesState && matchesCity && matchesType;
    });
  }, [searchQuery, selectedState, selectedCity, selectedType]);

  // Group churches by city
  const churchesByCity = useMemo(() => {
    const grouped: { [key: string]: Church[] } = {};
    filteredChurches.forEach(church => {
      const key = `${church.city}, ${church.state}`;
      if (!grouped[key]) {
        grouped[key] = [];
      }
      grouped[key].push(church);
    });
    return grouped;
  }, [filteredChurches]);

  return (
    <div className="space-y-6 p-6">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold">Igrejas por Cidade</h1>
        <p className="text-gray-600 mt-1">Encontre igrejas, capelas e santuários por localização</p>
      </div>

      {/* Filters */}
      <Card className="bg-gradient-to-r from-blue-50 to-blue-100">
        <CardHeader>
          <CardTitle className="text-lg flex items-center gap-2">
            <Filter className="w-5 h-5" />
            Filtros de Busca
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          {/* Search */}
          <div className="relative">
            <Search className="absolute left-3 top-3 w-5 h-5 text-gray-400" />
            <Input
              placeholder="Buscar por nome, cidade ou padroeiro..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10"
            />
          </div>

          {/* Filter Grid */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {/* State Filter */}
            <div>
              <label className="block text-sm font-medium mb-2">Estado</label>
              <select
                value={selectedState}
                onChange={(e) => {
                  setSelectedState(e.target.value);
                  setSelectedCity(''); // Reset city when state changes
                }}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="">Todos os Estados</option>
                {states.map(state => (
                  <option key={state} value={state}>{state}</option>
                ))}
              </select>
            </div>

            {/* City Filter */}
            <div>
              <label className="block text-sm font-medium mb-2">Cidade</label>
              <select
                value={selectedCity}
                onChange={(e) => setSelectedCity(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                disabled={!selectedState && cities.length === 0}
              >
                <option value="">Todas as Cidades</option>
                {cities.map(city => (
                  <option key={city} value={city}>{city}</option>
                ))}
              </select>
            </div>

            {/* Type Filter */}
            <div>
              <label className="block text-sm font-medium mb-2">Tipo de Templo</label>
              <select
                value={selectedType}
                onChange={(e) => setSelectedType(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="">Todos os Tipos</option>
                <option value="cathedral">Catedral</option>
                <option value="church">Igreja</option>
                <option value="chapel">Capela</option>
                <option value="sanctuary">Santuário</option>
                <option value="basilica">Basílica</option>
              </select>
            </div>
          </div>

          {/* Clear Filters */}
          <div className="flex justify-end">
            <Button
              variant="outline"
              onClick={() => {
                setSearchQuery('');
                setSelectedState('');
                setSelectedCity('');
                setSelectedType('');
              }}
            >
              Limpar Filtros
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Results Summary */}
      <div className="text-sm text-gray-600">
        Exibindo <span className="font-semibold">{filteredChurches.length}</span> igrejas em <span className="font-semibold">{Object.keys(churchesByCity).length}</span> cidades
      </div>

      {/* Churches by City */}
      <div className="space-y-6">
        {Object.entries(churchesByCity).length === 0 ? (
          <Card className="text-center py-12">
            <p className="text-gray-500">Nenhuma igreja encontrada com os filtros selecionados.</p>
          </Card>
        ) : (
          Object.entries(churchesByCity).map(([cityKey, churches]) => (
            <div key={cityKey}>
              {/* City Header */}
              <div className="mb-4">
                <h2 className="text-2xl font-bold flex items-center gap-2">
                  <MapPin className="w-6 h-6 text-red-600" />
                  {cityKey}
                </h2>
                <p className="text-gray-600 mt-1">{churches.length} templo{churches.length !== 1 ? 's' : ''}</p>
              </div>

              {/* Churches Grid */}
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {churches.map(church => (
                  <Card key={church.id} className="overflow-hidden hover:shadow-lg transition-shadow">
                    {/* Photo */}
                    <img 
                      src={church.photoUrl}
                      alt={church.name}
                      className="w-full h-40 object-cover"
                    />

                    <CardHeader className="pb-3">
                      <div className="flex justify-between items-start gap-2">
                        <div className="flex-1">
                          <CardTitle className="text-lg">{church.name}</CardTitle>
                          <CardDescription className="text-xs mt-1">
                            Padroeiro: {church.patronSaint}
                          </CardDescription>
                        </div>
                        <Badge className={typeLabels[church.type]?.color}>
                          {typeLabels[church.type]?.label}
                        </Badge>
                      </div>
                    </CardHeader>

                    <CardContent className="space-y-3">
                      {/* Address */}
                      <div className="flex items-start gap-2 text-sm">
                        <MapPin className="w-4 h-4 text-red-600 mt-0.5 flex-shrink-0" />
                        <div>
                          <p className="text-gray-600">Endereço</p>
                          <p className="font-medium">{church.address}</p>
                        </div>
                      </div>

                      {/* Contact Info */}
                      <div className="grid grid-cols-2 gap-2 text-sm">
                        <div className="flex items-center gap-2">
                          <Phone className="w-4 h-4 text-blue-600" />
                          <div>
                            <p className="text-gray-600 text-xs">Telefone</p>
                            <p className="font-medium text-xs">{church.phone}</p>
                          </div>
                        </div>
                        <div className="flex items-center gap-2">
                          <Mail className="w-4 h-4 text-green-600" />
                          <div>
                            <p className="text-gray-600 text-xs">Email</p>
                            <p className="font-medium text-xs">{church.email}</p>
                          </div>
                        </div>
                      </div>

                      {/* Stats */}
                      <div className="grid grid-cols-2 gap-2 pt-2 border-t">
                        <div className="text-center py-2">
                          <p className="text-gray-600 text-xs">Padres</p>
                          <p className="text-lg font-bold text-blue-600">{church.priests}</p>
                        </div>
                        <div className="text-center py-2">
                          <p className="text-gray-600 text-xs">Capacidade</p>
                          <p className="text-lg font-bold text-purple-600">{church.capacity}</p>
                        </div>
                      </div>

                      {/* View Details Button */}
                      <Button variant="outline" className="w-full text-sm">
                        Ver Detalhes
                      </Button>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}
