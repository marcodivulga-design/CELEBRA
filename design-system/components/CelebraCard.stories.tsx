import type { Meta, StoryObj } from "@storybook/react";
import CelebraCard, {
  CelebraCardHeader,
  CelebraCardTitle,
  CelebraCardDescription,
  CelebraCardContent,
  CelebraCardFooter,
} from "./CelebraCard";
import CelebraButton from "./CelebraButton";

const meta = {
  title: "Components/CelebraCard",
  component: CelebraCard,
  parameters: {
    layout: "centered",
  },
  tags: ["autodocs"],
  argTypes: {
    variant: {
      control: "select",
      options: ["default", "elevated", "outlined", "liturgical"],
    },
  },
} satisfies Meta<typeof CelebraCard>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {
    variant: "default",
    children: (
      <>
        <CelebraCardHeader>
          <CelebraCardTitle>Título do Card</CelebraCardTitle>
          <CelebraCardDescription>
            Descrição do card padrão
          </CelebraCardDescription>
        </CelebraCardHeader>
        <CelebraCardContent>
          Conteúdo principal do card com informações importantes.
        </CelebraCardContent>
        <CelebraCardFooter>
          <CelebraButton variant="ghost">Cancelar</CelebraButton>
          <CelebraButton>Confirmar</CelebraButton>
        </CelebraCardFooter>
      </>
    ),
  },
};

export const Elevated: Story = {
  args: {
    variant: "elevated",
    children: (
      <>
        <CelebraCardHeader>
          <CelebraCardTitle>Card Elevado</CelebraCardTitle>
          <CelebraCardDescription>
            Com sombra elevada
          </CelebraCardDescription>
        </CelebraCardHeader>
        <CelebraCardContent>
          Este card possui uma sombra mais pronunciada, ideal para destaque.
        </CelebraCardContent>
      </>
    ),
  },
};

export const Outlined: Story = {
  args: {
    variant: "outlined",
    children: (
      <>
        <CelebraCardHeader>
          <CelebraCardTitle>Card Contornado</CelebraCardTitle>
          <CelebraCardDescription>
            Com borda destacada
          </CelebraCardDescription>
        </CelebraCardHeader>
        <CelebraCardContent>
          Este card possui apenas uma borda destacada em roxo.
        </CelebraCardContent>
      </>
    ),
  },
};

export const Liturgical: Story = {
  args: {
    variant: "liturgical",
    children: (
      <>
        <CelebraCardHeader>
          <CelebraCardTitle>Card Litúrgico</CelebraCardTitle>
          <CelebraCardDescription>
            Com gradiente de cores litúrgicas
          </CelebraCardDescription>
        </CelebraCardHeader>
        <CelebraCardContent>
          Este card possui um gradiente com cores litúrgicas (roxo e ouro).
        </CelebraCardContent>
      </>
    ),
  },
};

export const WithContent: Story = {
  render: () => (
    <CelebraCard variant="elevated" className="w-96">
      <CelebraCardHeader>
        <CelebraCardTitle>Música Católica</CelebraCardTitle>
        <CelebraCardDescription>
          Descubra novas composições litúrgicas
        </CelebraCardDescription>
      </CelebraCardHeader>
      <CelebraCardContent className="space-y-4">
        <div>
          <h4 className="font-semibold mb-2">Características:</h4>
          <ul className="list-disc list-inside space-y-1 text-sm text-[var(--text-secondary)]">
            <li>Catálogo com 10.000+ músicas</li>
            <li>Reprodutor integrado</li>
            <li>Recomendações por IA</li>
            <li>Comunidade colaborativa</li>
          </ul>
        </div>
      </CelebraCardContent>
      <CelebraCardFooter>
        <CelebraButton variant="outline">Saiba Mais</CelebraButton>
        <CelebraButton>Começar</CelebraButton>
      </CelebraCardFooter>
    </CelebraCard>
  ),
};
