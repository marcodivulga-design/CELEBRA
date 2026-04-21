import type { Meta, StoryObj } from "@storybook/react";
import CelebraInput from "./CelebraInput";

const meta = {
  title: "Components/CelebraInput",
  component: CelebraInput,
  parameters: {
    layout: "centered",
  },
  tags: ["autodocs"],
} satisfies Meta<typeof CelebraInput>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {
    label: "Email",
    placeholder: "seu@email.com",
    type: "email",
  },
};

export const WithHelperText: Story = {
  args: {
    label: "Senha",
    placeholder: "Digite sua senha",
    type: "password",
    helperText: "Mínimo 8 caracteres",
  },
};

export const WithError: Story = {
  args: {
    label: "Email",
    placeholder: "seu@email.com",
    type: "email",
    error: "Email inválido",
  },
};

export const Disabled: Story = {
  args: {
    label: "Campo desabilitado",
    placeholder: "Não pode editar",
    disabled: true,
  },
};

export const WithValue: Story = {
  args: {
    label: "Nome",
    placeholder: "Digite seu nome",
    defaultValue: "João Silva",
  },
};

export const WithLongText: Story = {
  args: {
    label: "Descrição",
    placeholder: "Digite uma descrição longa...",
    defaultValue: "Lorem ipsum dolor sit amet, consectetur adipiscing elit.",
  },
};

export const AllStates: Story = {
  render: () => (
    <div className="space-y-6 w-96">
      <CelebraInput
        label="Padrão"
        placeholder="Digite algo..."
      />
      <CelebraInput
        label="Com ajuda"
        placeholder="Digite seu email..."
        helperText="Usaremos para contato"
      />
      <CelebraInput
        label="Com erro"
        placeholder="Digite algo..."
        error="Este campo é obrigatório"
      />
      <CelebraInput
        label="Desabilitado"
        placeholder="Não pode editar..."
        disabled
      />
    </div>
  ),
};
