import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@podyard/design-system/components/ui/popover";
import type { Meta, StoryObj } from "@storybook/react";

/**
 * Displays rich content in a portal, triggered by a button.
 */
const meta: Meta<typeof Popover> = {
  title: "ui/Popover",
  component: Popover,
  tags: ["autodocs"],
  argTypes: {},

  render: (args) => (
    <Popover {...args}>
      <PopoverTrigger>Open</PopoverTrigger>
      <PopoverContent>Place content for the popover here.</PopoverContent>
    </Popover>
  ),
  parameters: {
    layout: "centered",
  },
};

export default meta;

type Story = StoryObj<typeof meta>;

/**
 * The default form of the popover.
 */
export const Default: Story = {};
