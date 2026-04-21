import type { Meta, StoryObj } from "@storybook/react";
import { useState } from "react";
import CelebraModal from "./CelebraModal";
import CelebraButton from "./CelebraButton";

const meta = {
  title: "Components/CelebraModal",
  component: CelebraModal,
  parameters: {
    layout: "centered",
  },
  tags: ["autodocs"],
  argTypes: {
    size: {
      control: "select",
      options: ["sm", "md", "lg", "xl"],
    },
  },
} satisfies Meta<typeof CelebraModal>;

export default meta;
type Story = StoryObj<typeof meta>;

const ModalDemo = (args: Record<string, any>) => {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <>
      <CelebraButton onClick={() => setIsOpen(true)}>
        Abrir Modal
      </CelebraButton>
      <CelebraModal
        {...args}
        isOpen={isOpen}
        onClose={() => setIsOpen(false)}
        children={args.children || <p>Conteúdo padrão</p>}
      />
    </>
  );
};

export const Default: Story = {
  render: (args: Record<string, any>) => (
    <ModalDemo
      {...args}
      title="Confirmar Ação"
      description="Tem certeza que deseja continuar?"
      footer={
        <div className="flex gap-2">
          <CelebraButton variant="ghost">Cancelar</CelebraButton>
          <CelebraButton>Confirmar</CelebraButton>
        </div>
      }
    >
      <p>Este é o conteúdo do modal. Você pode adicionar qualquer elemento aqui.</p>
    </ModalDemo>
  ),
};

export const Small: Story = {
  args: {
    size: "sm",
    title: "Modal Pequeno",
    description: "Este é um modal pequeno",
  },
  render: (args: Record<string, any>) => (
    <ModalDemo
      {...args}
      footer={
        <div className="flex gap-2">
          <CelebraButton variant="ghost" size="sm">
            Cancelar
          </CelebraButton>
          <CelebraButton size="sm">OK</CelebraButton>
        </div>
      }
    >
      <p>Conteúdo do modal pequeno</p>
    </ModalDemo>
  ),
};

export const Large: Story = {
  args: {
    size: "lg",
    title: "Modal Grande",
    description: "Este é um modal com mais espaço",
  },
  render: (args: Record<string, any>) => (
    <ModalDemo
      {...args}
      footer={
        <div className="flex gap-2">
          <CelebraButton variant="ghost">Cancelar</CelebraButton>
          <CelebraButton>Confirmar</CelebraButton>
        </div>
      }
    >
      <div className="space-y-4">
        <p>
          Este modal possui mais espaço para conteúdo. Você pode adicionar
          formulários, listas, imagens e outros elementos.
        </p>
        <div className="bg-[var(--celebra-purple)]/10 p-4 rounded-lg">
          <p className="text-sm">Exemplo de conteúdo formatado</p>
        </div>
      </div>
    </ModalDemo>
  ),
};

export const WithoutFooter: Story = {
  render: (args: Record<string, any>) => (
    <ModalDemo
      {...args}
      title="Informação"
      description="Modal sem rodapé"
    >
      <p>Este modal não possui botões de ação no rodapé.</p>
    </ModalDemo>
  ),
};

export const WithoutDescription: Story = {
  render: (args: Record<string, any>) => (
    <ModalDemo
      {...args}
      title="Apenas Título"
      footer={
        <div className="flex gap-2">
          <CelebraButton variant="ghost">Fechar</CelebraButton>
        </div>
      }
    >
      <p>Modal com apenas título, sem descrição.</p>
    </ModalDemo>
  ),
};
