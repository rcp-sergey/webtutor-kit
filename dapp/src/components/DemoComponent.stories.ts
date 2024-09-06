import type { Meta, StoryObj } from '@storybook/vue3'
import DemoComponent from './DemoComponent.vue'

// More on how to set up stories at: https://storybook.js.org/docs/writing-stories
const meta = {
  title: 'Dapp/DemoComponent',
  component: DemoComponent,
  // This component will have an automatically generated docsPage entry: https://storybook.js.org/docs/writing-docs/autodocs
  tags: ['autodocs'],
  argTypes: {
    demoText: {
      control: 'text'
    }
  },
  args: {
    demoText: 'Hello World!'
    // Use `fn` to spy on the onClick arg, which will appear in the actions panel once invoked: https://storybook.js.org/docs/essentials/actions#action-args
  }
} satisfies Meta<typeof DemoComponent>

export default meta
type Story = StoryObj<typeof meta>
/*
 *👇 Render functions are a framework specific feature to allow you control on how the component renders.
 * See https://storybook.js.org/docs/api/csf
 * to learn how to use render functions.
 */
export const Example: Story = {
  args: {
    demoText: 'Storybook Example'
  }
}
