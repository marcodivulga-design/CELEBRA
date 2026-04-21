import { useState } from 'react';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Plus, X, MapPin, Loader } from 'lucide-react';

interface CreateChurchModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (data: any) => void;
}

export function CreateChurchModal({ isOpen, onClose, onSubmit }: CreateChurchModalProps) {
  const [formData, setFormData] = useState({
    name: '',
    type: 'church',
    city: '',
    state: '',
    address: '',
    phone: '',
    email: '',
    patronSaint: '',
    foundedYear: new Date().getFullYear(),
    capacity: 500,
    description: '',
    latitude: 0,
    longitude: 0,
  });

  const [errors, setErrors] = useState<Record<string, string>>({});
  const [geocoding, setGeocoding] = useState(false);
  const [coordinates, setCoordinates] = useState<{ lat?: number; lng?: number }>({});

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: name === 'capacity' || name === 'foundedYear' ? parseInt(value) : value,
    }));
    // Clear error for this field
    if (errors[name]) {
      setErrors(prev => {
        const newErrors = { ...prev };
        delete newErrors[name];
        return newErrors;
      });
    }
  };

  const handleGeocoding = async () => {
    if (!formData.address || !formData.city) {
      alert('Por favor, preencha o endereço e a cidade primeiro');
      return;
    }

    setGeocoding(true);
    try {
      const fullAddress = `${formData.address}, ${formData.city}, ${formData.state}`;
      const response = await fetch(
        `https://maps.googleapis.com/maps/api/geocode/json?address=${encodeURIComponent(fullAddress)}&key=AIzaSyBlHmZyRer_DUSBmDdn3-ItxKukTFfX7iQ`
      );
      const data = await response.json();

      if (data.results && data.results.length > 0) {
        const { lat, lng } = data.results[0].geometry.location;
        setCoordinates({ lat, lng });
        setFormData(prev => ({
          ...prev,
          latitude: lat,
          longitude: lng,
        }));
        alert(`✅ Coordenadas encontradas: ${lat.toFixed(4)}, ${lng.toFixed(4)}`);
      } else {
        alert('❌ Endereço não encontrado. Verifique os dados.');
      }
    } catch (error) {
      console.error('Erro ao geocodificar:', error);
      alert('❌ Erro ao buscar coordenadas');
    } finally {
      setGeocoding(false);
    }
  };

  const validateForm = () => {
    const newErrors: Record<string, string> = {};

    if (!formData.name.trim()) newErrors.name = 'Nome é obrigatório';
    if (!formData.city.trim()) newErrors.city = 'Cidade é obrigatória';
    if (!formData.address.trim()) newErrors.address = 'Endereço é obrigatório';
    if (!formData.state.trim()) newErrors.state = 'Estado é obrigatório';
    if (formData.email && !formData.email.includes('@')) newErrors.email = 'Email inválido';

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (validateForm()) {
      onSubmit(formData);
      // Reset form
      setFormData({
        name: '',
        type: 'church',
        city: '',
        state: '',
        address: '',
        phone: '',
        email: '',
        patronSaint: '',
        foundedYear: new Date().getFullYear(),
        capacity: 500,
        description: '',
        latitude: 0,
        longitude: 0,
      });
      setCoordinates({});
      onClose();
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Plus className="w-5 h-5" />
            Criar Nova Igreja
          </DialogTitle>
          <DialogDescription>
            Preencha os dados da nova igreja ou templo
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Row 1: Nome */}
          <div>
            <Label htmlFor="name">Nome da Igreja *</Label>
            <Input
              id="name"
              name="name"
              value={formData.name}
              onChange={handleChange}
              placeholder="Ex: Catedral Metropolitana"
              className={errors.name ? 'border-red-500' : ''}
            />
            {errors.name && <p className="text-red-500 text-sm mt-1">{errors.name}</p>}
          </div>

          {/* Row 2: Email e Telefone */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                name="email"
                type="email"
                value={formData.email}
                onChange={handleChange}
                placeholder="Ex: contato@igreja.org.br"
                className={errors.email ? 'border-red-500' : ''}
              />
              {errors.email && <p className="text-red-500 text-sm mt-1">{errors.email}</p>}
            </div>
            <div>
              <Label htmlFor="phone">Telefone</Label>
              <Input
                id="phone"
                name="phone"
                value={formData.phone}
                onChange={handleChange}
                placeholder="Ex: (11) 3333-3333"
              />
            </div>
          </div>

          {/* Row 3: Endereço e Cidade */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <Label htmlFor="address">Endereço *</Label>
              <Input
                id="address"
                name="address"
                value={formData.address}
                onChange={handleChange}
                placeholder="Ex: Av. Paulista, 1000"
                className={errors.address ? 'border-red-500' : ''}
              />
              {errors.address && <p className="text-red-500 text-sm mt-1">{errors.address}</p>}
            </div>
            <div>
              <Label htmlFor="city">Cidade *</Label>
              <Input
                id="city"
                name="city"
                value={formData.city}
                onChange={handleChange}
                placeholder="Ex: São Paulo"
                className={errors.city ? 'border-red-500' : ''}
              />
              {errors.city && <p className="text-red-500 text-sm mt-1">{errors.city}</p>}
            </div>
          </div>

          {/* Geocoding Button */}
          <div>
            <Button
              type="button"
              onClick={handleGeocoding}
              disabled={geocoding}
              className="w-full gap-2"
              variant="outline"
            >
              {geocoding ? (
                <>
                  <Loader className="w-4 h-4 animate-spin" />
                  Buscando coordenadas...
                </>
              ) : (
                <>
                  <MapPin className="w-4 h-4" />
                  Buscar Coordenadas (Geocoding)
                </>
              )}
            </Button>
            {coordinates.lat && coordinates.lng && (
              <p className="text-sm text-green-600 mt-2">✅ Coordenadas: {coordinates.lat.toFixed(4)}, {coordinates.lng.toFixed(4)}</p>
            )}
          </div>

          {/* Row 4: Tipo e Estado */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <Label htmlFor="type">Tipo de Templo *</Label>
              <select
                id="type"
                name="type"
                value={formData.type}
                onChange={handleChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="church">Igreja</option>
                <option value="cathedral">Catedral</option>
                <option value="chapel">Capela</option>
                <option value="sanctuary">Santuário</option>
                <option value="basilica">Basílica</option>
              </select>
            </div>
            <div>
              <Label htmlFor="state">Estado *</Label>
              <Input
                id="state"
                name="state"
                value={formData.state}
                onChange={handleChange}
                placeholder="Ex: SP"
                maxLength={2}
                className={errors.state ? 'border-red-500' : ''}
              />
              {errors.state && <p className="text-red-500 text-sm mt-1">{errors.state}</p>}
            </div>
          </div>

          {/* Row 5: Capacidade e Ano Fundação */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <Label htmlFor="capacity">Capacidade (pessoas)</Label>
              <Input
                id="capacity"
                name="capacity"
                type="number"
                value={formData.capacity}
                onChange={handleChange}
                min="1"
              />
            </div>
            <div>
              <Label htmlFor="foundedYear">Ano de Fundação</Label>
              <Input
                id="foundedYear"
                name="foundedYear"
                type="number"
                value={formData.foundedYear}
                onChange={handleChange}
                min="1500"
                max={new Date().getFullYear()}
              />
            </div>
          </div>

          {/* Row 6: Padroeiro */}
          <div>
            <Label htmlFor="patronSaint">Padroeiro / Santo Padroeiro</Label>
            <Input
              id="patronSaint"
              name="patronSaint"
              value={formData.patronSaint}
              onChange={handleChange}
              placeholder="Ex: Nossa Senhora da Conceição"
            />
          </div>

          {/* Row 7: Descrição */}
          <div>
            <Label htmlFor="description">Descrição / Informações</Label>
            <textarea
              id="description"
              name="description"
              value={formData.description}
              onChange={handleChange}
              placeholder="Informações sobre a história, arquitetura, importância histórica, etc..."
              rows={4}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          {/* Actions */}
          <div className="flex justify-end gap-3 pt-4 border-t">
            <Button
              type="button"
              variant="outline"
              onClick={onClose}
              className="gap-2"
            >
              <X className="w-4 h-4" />
              Cancelar
            </Button>
            <Button
              type="submit"
              className="gap-2"
            >
              <Plus className="w-4 h-4" />
              Criar Igreja
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
