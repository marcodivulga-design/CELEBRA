import type { Meta, StoryObj } from "@storybook/react";
import CelebraBadge from "./CelebraBadge";

const meta = {
  title: "Components/CelebraBadge",
  component: CelebraBadge,
  parameters: {
    layout: "centered",
  },
  tags: ["autodocs"],
  argTypes: {
    variant: {
      control: "select",
      options: ["purple", "gold", "green", "red", "blue", "gray"],
    },
    size: {
      control: "select",
      options: ["sm", "md", "lg"],
    },
  },
} satisfies Meta<typeof CelebraBadge>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Purple: Story = {
  args: {
    children: "Roxo - Penitência",
    variant: "purple",
    size: "md",
  },
};

export const Gold: Story = {
  args: {
    children: "Ouro - Festas",
    variant: "gold",
    size: "md",
  },
};

export const Green: Story = {
  args: {
    children: "Verde - Tempo Comum",
    variant: "green",
    size: "md",
  },
};

export const Red: Story = {
  args: {
    children: "Vermelho - Mártires",
    variant: "red",
    size: "md",
  },
};

export const Blue: Story = {
  args: {
    children: "Azul - Mãe de Deus",
    variant: "blue",
    size: "md",
  },
};

export const Gray: Story = {
  args: {
    children: "Cinza - Neutro",
    variant: "gray",
    size: "md",
  },
};

export const Small: Story = {
  args: {
    children: "Pequeno",
    size: "sm",
    variant: "purple",
  },
};

export const Large: Story = {
  args: {
    children: "Grande",
    size: "lg",
    variant: "gold",
  },
};

export const AllVariants: Story = {
  render: () => (
    <div className="flex flex-wrap gap-4">
      <CelebraBadge variant="purple">Roxo</CelebraBadge>
      <CelebraBadge variant="gold">Ouro</CelebraBadge>
      <CelebraBadge variant="green">Verde</CelebraBadge>
      <CelebraBadge variant="red">Vermelho</CelebraBadge>
      <CelebraBadge variant="blue">Azul</CelebraBadge>
      <CelebraBadge variant="gray">Cinza</CelebraBadge>
    </div>
  ),
};

export const AllSizes: Story = {
  render: () => (
    <div className="flex flex-wrap gap-4 items-center">
      <CelebraBadge size="sm">Pequeno</CelebraBadge>
      <CelebraBadge size="md">Médio</CelebraBadge>
      <CelebraBadge size="lg">Grande</CelebraBadge>
    </div>
  ),
};

export const LiturgicalColors: Story = {
  render: () => (
    <div className="space-y-4">
      <div className="flex gap-2 items-center">
        <CelebraBadge variant="purple" size="md">Roxo</CelebraBadge>
        <span className="text-sm text-[var(--text-secondary)]">Penitência e Advento</span>
      </div>
      <div className="flex gap-2 items-center">
        <CelebraBadge variant="gold" size="md">Ouro</CelebraBadge>
        <span className="text-sm text-[var(--text-secondary)]">Festas e Celebrações</span>
      </div>
      <div className="flex gap-2 items-center">
        <CelebraBadge variant="green" size="md">Verde</CelebraBadge>
        <span className="text-sm text-[var(--text-secondary)]">Tempo Comum</span>
      </div>
      <div className="flex gap-2 items-center">
        <CelebraBadge variant="red" size="md">Vermelho</CelebraBadge>
        <span className="text-sm text-[var(--text-secondary)]">Mártires e Paixão</span>
      </div>
    </div>
  ),
};
