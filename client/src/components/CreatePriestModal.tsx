import { useState } from 'react';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Plus, X } from 'lucide-react';

interface CreatePriestModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (data: any) => void;
}

export function CreatePriestModal({ isOpen, onClose, onSubmit }: CreatePriestModalProps) {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    role: 'priest',
    ordinationYear: new Date().getFullYear() - 10,
    bio: '',
  });

  const [errors, setErrors] = useState<Record<string, string>>({});

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: name === 'ordinationYear' ? parseInt(value) : value,
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
    if (formData.email && !formData.email.includes('@')) newErrors.email = 'Email inválido';

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (validateForm()) {
      const priestName = formData.name;
      onSubmit(formData);
      // Reset form
      setFormData({
        name: '',
        email: '',
        phone: '',
        role: 'priest',
        ordinationYear: new Date().getFullYear() - 10,
        bio: '',
      });
      alert(`✅ Padre "${priestName}" adicionado com sucesso!`);
      onClose();
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Plus className="w-5 h-5" />
            Adicionar Padre / Bispo
          </DialogTitle>
          <DialogDescription>
            Preencha os dados do novo padre ou bispo
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Row 1: Nome */}
          <div>
            <Label htmlFor="name">Nome Completo *</Label>
            <Input
              id="name"
              name="name"
              value={formData.name}
              onChange={handleChange}
              placeholder="Ex: Pe. João Silva"
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
                placeholder="Ex: joao@paroquia.org.br"
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
                placeholder="Ex: (11) 9999-9999"
              />
            </div>
          </div>

          {/* Row 3: Papel e Ano de Ordenação */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <Label htmlFor="role">Papel / Função</Label>
              <select
                id="role"
                name="role"
                value={formData.role}
                onChange={handleChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="bishop">Bispo</option>
                <option value="archbishop">Arcebispo</option>
                <option value="priest">Padre</option>
                <option value="vicar">Vigário</option>
                <option value="deacon">Diácono</option>
                <option value="chaplain">Capelão</option>
              </select>
            </div>
            <div>
              <Label htmlFor="ordinationYear">Ano de Ordenação</Label>
              <Input
                id="ordinationYear"
                name="ordinationYear"
                type="number"
                value={formData.ordinationYear}
                onChange={handleChange}
                min="1950"
                max={new Date().getFullYear()}
              />
            </div>
          </div>

          {/* Row 4: Biografia */}
          <div>
            <Label htmlFor="bio">Biografia / Informações</Label>
            <textarea
              id="bio"
              name="bio"
              value={formData.bio}
              onChange={handleChange}
              placeholder="Informações sobre o padre (formação, especialidades, etc.)..."
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
              Adicionar Padre
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
