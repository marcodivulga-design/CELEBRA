import { useState } from 'react';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Plus, X } from 'lucide-react';

interface CreateParishModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (data: any) => void;
}

export function CreateParishModal({ isOpen, onClose, onSubmit }: CreateParishModalProps) {
  const [formData, setFormData] = useState({
    name: '',
    city: '',
    state: '',
    address: '',
    phone: '',
    email: '',
    website: '',
    patronSaint: '',
    foundedYear: new Date().getFullYear(),
    description: '',
  });

  const [errors, setErrors] = useState<Record<string, string>>({});

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: name === 'foundedYear' ? parseInt(value) : value,
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

  const validateForm = () => {
    const newErrors: Record<string, string> = {};

    if (!formData.name.trim()) newErrors.name = 'Nome é obrigatório';
    if (!formData.city.trim()) newErrors.city = 'Cidade é obrigatória';
    if (!formData.state.trim()) newErrors.state = 'Estado é obrigatório';

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (validateForm()) {
      const parishName = formData.name;
      onSubmit(formData);
      // Reset form
      setFormData({
        name: '',
        city: '',
        state: '',
        address: '',
        phone: '',
        email: '',
        website: '',
        patronSaint: '',
        foundedYear: new Date().getFullYear(),
        description: '',
      });
      alert(`✅ Paróquia "${parishName}" criada com sucesso!`);
      onClose();
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Plus className="w-5 h-5" />
            Criar Nova Paróquia
          </DialogTitle>
          <DialogDescription>
            Preencha os dados da nova paróquia
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Row 1: Nome */}
          <div>
            <Label htmlFor="name">Nome da Paróquia *</Label>
            <Input
              id="name"
              name="name"
              value={formData.name}
              onChange={handleChange}
              placeholder="Ex: Paróquia de Santo Antônio"
              className={errors.name ? 'border-red-500' : ''}
            />
            {errors.name && <p className="text-red-500 text-sm mt-1">{errors.name}</p>}
          </div>

          {/* Row 2: Cidade e Estado */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
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

          {/* Row 3: Endereço */}
          <div>
            <Label htmlFor="address">Endereço</Label>
            <Input
              id="address"
              name="address"
              value={formData.address}
              onChange={handleChange}
              placeholder="Ex: Rua Santo Antônio, 500"
            />
          </div>

          {/* Row 4: Telefone e Email */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <Label htmlFor="phone">Telefone</Label>
              <Input
                id="phone"
                name="phone"
                value={formData.phone}
                onChange={handleChange}
                placeholder="Ex: (11) 2222-2222"
              />
            </div>
            <div>
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                name="email"
                type="email"
                value={formData.email}
                onChange={handleChange}
                placeholder="Ex: contato@paroquia.org.br"
              />
            </div>
          </div>

          {/* Row 5: Website */}
          <div>
            <Label htmlFor="website">Website</Label>
            <Input
              id="website"
              name="website"
              value={formData.website}
              onChange={handleChange}
              placeholder="Ex: www.paroquia.org.br"
            />
          </div>

          {/* Row 6: Padroeiro e Ano de Fundação */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <Label htmlFor="patronSaint">Padroeiro</Label>
              <Input
                id="patronSaint"
                name="patronSaint"
                value={formData.patronSaint}
                onChange={handleChange}
                placeholder="Ex: Santo Antônio de Pádua"
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

          {/* Row 7: Descrição */}
          <div>
            <Label htmlFor="description">Descrição</Label>
            <textarea
              id="description"
              name="description"
              value={formData.description}
              onChange={handleChange}
              placeholder="Informações adicionais sobre a paróquia..."
              rows={3}
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
              Criar Paróquia
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
