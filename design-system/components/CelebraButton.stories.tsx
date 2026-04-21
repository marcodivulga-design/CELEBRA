import type { Meta, StoryObj } from "@storybook/react";
import CelebraButton from "./CelebraButton";

const meta = {
  title: "Components/CelebraButton",
  component: CelebraButton,
  parameters: {
    layout: "centered",
  },
  tags: ["autodocs"],
  argTypes: {
    variant: {
      control: "select",
      options: ["primary", "secondary", "accent", "ghost", "outline"],
    },
    size: {
      control: "select",
      options: ["sm", "md", "lg"],
    },
    isLoading: {
      control: "boolean",
    },
    disabled: {
      control: "boolean",
    },
  },
} satisfies Meta<typeof CelebraButton>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Primary: Story = {
  args: {
    children: "Botão Primário",
    variant: "primary",
    size: "md",
  },
};

export const Secondary: Story = {
  args: {
    children: "Botão Secundário",
    variant: "secondary",
    size: "md",
  },
};

export const Accent: Story = {
  args: {
    children: "Botão Accent",
    variant: "accent",
    size: "md",
  },
};

export const Ghost: Story = {
  args: {
    children: "Botão Ghost",
    variant: "ghost",
    size: "md",
  },
};

export const Outline: Story = {
  args: {
    children: "Botão Outline",
    variant: "outline",
    size: "md",
  },
};

export const Small: Story = {
  args: {
    children: "Pequeno",
    size: "sm",
    variant: "primary",
  },
};

export const Large: Story = {
  args: {
    children: "Grande",
    size: "lg",
    variant: "primary",
  },
};

export const Loading: Story = {
  args: {
    children: "Carregando",
    isLoading: true,
    variant: "primary",
  },
};

export const Disabled: Story = {
  args: {
    children: "Desabilitado",
    disabled: true,
    variant: "primary",
  },
};

export const AllVariants: Story = {
  render: () => (
    <div className="flex flex-wrap gap-4">
      <CelebraButton variant="primary">Primary</CelebraButton>
      <CelebraButton variant="secondary">Secondary</CelebraButton>
      <CelebraButton variant="accent">Accent</CelebraButton>
      <CelebraButton variant="ghost">Ghost</CelebraButton>
      <CelebraButton variant="outline">Outline</CelebraButton>
    </div>
  ),
};

export const AllSizes: Story = {
  render: () => (
    <div className="flex flex-wrap gap-4 items-center">
      <CelebraButton size="sm">Pequeno</CelebraButton>
      <CelebraButton size="md">Médio</CelebraButton>
      <CelebraButton size="lg">Grande</CelebraButton>
    </div>
  ),
};
