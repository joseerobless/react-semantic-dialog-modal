import type { Meta, StoryObj } from '@storybook/react';
import { fn } from '@storybook/test';
import {Modal} from '../Modal';
import React, { useState } from 'react';

const meta: Meta<typeof Modal> = {
  title: 'Component/Modal',
  component: Modal,
  parameters: {
    layout: 'centered',
  },
  tags: ['autodocs'],
};

export default meta;
type Story = StoryObj<typeof Modal>;

export const Default: Story = (args: any) => {
    const [showModal, setShowModal] = useState(false);
    const onClick = () => {
      setShowModal(!showModal);
    };

    return <>
    <button onClick={onClick}>
      {showModal ? "Hide Modal" : "Show Modal"}
    </button>
    <Modal
      {...args}
      onClose={() => {onClick(); args?.onClose()}}
      open={showModal}
    >
      {args.children}
    </Modal>
  </>
};

Default.args = {
  children: (onClose: () => void) => (
    <div style={{ display: "flex" }}>
      <p onClick={onClose}>
      Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.
      </p>
    </div>
  ),
  header: <h2>Welcome to my modal</h2>,
  onClose: fn(),
  showCloseButton: true,
  animationOptions: {
    direction: "left",
    speed: "1000ms",
    closeDirections: {
      left: "modalSlideOutBottom",
    },
  }
}
