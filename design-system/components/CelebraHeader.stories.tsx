import type { Meta, StoryObj } from "@storybook/react";
import CelebraHeader, { CelebraNavLink } from "./CelebraHeader";
import CelebraButton from "./CelebraButton";

const meta = {
  title: "Components/CelebraHeader",
  component: CelebraHeader,
  parameters: {
    layout: "fullscreen",
  },
  tags: ["autodocs"],
} satisfies Meta<typeof CelebraHeader>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {
    title: "CELEBRA",
    subtitle: "Plataforma de Música Católica",
  },
};

export const WithNavigation: Story = {
  args: {
    title: "CELEBRA",
    subtitle: "Plataforma de Música Católica",
    navigation: (
      <>
        <CelebraNavLink href="/" active={true}>
          Home
        </CelebraNavLink>
        <CelebraNavLink href="/catalog">
          Catálogo
        </CelebraNavLink>
        <CelebraNavLink href="/studio">
          Studio
        </CelebraNavLink>
        <CelebraNavLink href="/community">
          Comunidade
        </CelebraNavLink>
      </>
    ),
  },
};

export const WithActions: Story = {
  args: {
    title: "CELEBRA",
    subtitle: "Plataforma de Música Católica",
    actions: (
      <div className="flex gap-2">
        <CelebraButton variant="ghost" size="sm">
          Entrar
        </CelebraButton>
        <CelebraButton size="sm">
          Registrar
        </CelebraButton>
      </div>
    ),
  },
};

export const Sticky: Story = {
  args: {
    title: "CELEBRA",
    sticky: true,
    navigation: (
      <>
        <CelebraNavLink href="/" active={true}>
          Home
        </CelebraNavLink>
        <CelebraNavLink href="/catalog">
          Catálogo
        </CelebraNavLink>
        <CelebraNavLink href="/studio">
          Studio
        </CelebraNavLink>
      </>
    ),
  },
};

export const Complete: Story = {
  render: () => (
    <CelebraHeader
      title="CELEBRA"
      subtitle="Plataforma de Música Católica"
      sticky={true}
      actions={
        <div className="flex gap-2">
          <CelebraButton variant="ghost" size="sm">
            Entrar
          </CelebraButton>
          <CelebraButton size="sm">
            Registrar
          </CelebraButton>
        </div>
      }
      navigation={
        <>
          <CelebraNavLink href="/" active={true}>
            Home
          </CelebraNavLink>
          <CelebraNavLink href="/catalog">
            Catálogo
          </CelebraNavLink>
          <CelebraNavLink href="/studio">
            Studio
          </CelebraNavLink>
          <CelebraNavLink href="/community">
            Comunidade
          </CelebraNavLink>
          <CelebraNavLink href="/about">
            Sobre
          </CelebraNavLink>
        </>
      }
    />
  ),
};
