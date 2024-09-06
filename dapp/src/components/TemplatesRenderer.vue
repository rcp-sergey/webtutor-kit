<script setup lang="ts">
import { ref, h, Teleport, resolveComponent, type VNode, Suspense, onMounted } from 'vue';
import { dappTemplateSelector } from '@/utils/dapp';

interface DappNodeElem {
  type: string;
  props: object;
  children: DappNodeElem[];
  text: string | null;
  teleport?: string;
}

const props = defineProps<{
  dev: boolean;
}>();

const emit = defineEmits<{
  (e: 'ready'): void;
}>();

const nodesStructure = ref(getNodesStructure());
const renderReadyPromises = ref<Promise<void>[]>([]);

if (!nodesStructure.value?.children.length) {
  emit('ready');
}

const TemplateComponents = renderNode(nodesStructure.value);

onMounted(async () => {
  await Promise.all(renderReadyPromises.value).then(() => {
    emit('ready');
  });
});

// log nodes structure for debugging
if (props.dev) {
  console.log(nodesStructure);
}

function renderNode(node: DappNodeElem): VNode {
  const component = resolveComponent(node.type) || node.type;
  const componentChildren: Array<VNode | string> = Array.isArray(node.children)
    ? node.children.map(renderNode)
    : [];

  if (node.text) {
    componentChildren.push(node.text);
  }

  if (node.teleport?.length) {
    let resolvePromise: () => void;

    const renderReadyPromise = new Promise<void>((resolve) => {
      resolvePromise = resolve;
    });

    renderReadyPromises.value.push(renderReadyPromise);

    return h(
      Teleport,
      { to: node.teleport },
      h(
        Suspense,
        { onResolve: () => resolvePromise() },
        h(component, { ...node.props, class: 'dapp-template' }, componentChildren)
      )
    );
  }

  return h(component, node.props, componentChildren);
}

function extractElementParams(templateNode: Element) {
  const paramNodes = templateNode.querySelectorAll(':scope > [data-prop]');
  const params: Record<string, unknown> = {};

  paramNodes.forEach((pn) => {
    const paramName: string = pn.getAttribute('data-prop') || '';
    let paramValueString = pn.getAttribute('data-value');

    if (paramValueString && paramValueString !== 'undefined') {
      let paramValue;

      if (isBase64(paramValueString)) {
        let paramValueObject = JSON.parse(
          new TextDecoder().decode(base64ToBytes(paramValueString))
        );

        const paramType = paramValueObject.type;
        paramValue = paramValueObject.value;

        if (paramValue) {
          switch (paramType) {
            case 'number':
              paramValue = convertToNumberOrBigint(paramValue);
              break;
            case 'date':
              paramValue = new Date(paramValue.toString());
              break;
          }
        }
      } else {
        paramValue = paramValueString;
      }

      if (paramName) params[paramName] = paramValue;
    }
  });

  return params;
}

function getNodeChildStructure(node: Element): DappNodeElem {
  const nodeType = toPascalCase(node.tagName.toLowerCase());
  const nodeProps = extractElementParams(node);
  const nodeChildren = node.querySelectorAll<HTMLElement>(':scope > :not([data-prop])');
  const nodeText: string | null = !nodeChildren.length ? node.textContent : null;

  const nodeStructure: DappNodeElem = {
    type: nodeType,
    props: nodeProps,
    children: [],
    text: nodeText,
  };

  Array.from(nodeChildren).forEach((child) => {
    const nodeChildStructure = getNodeChildStructure(child);
    nodeStructure.children.push(nodeChildStructure);
  });

  return nodeStructure;
}

function createTeleportNode(node: HTMLElement, uniqueKey: number): string {
  const teleportTargetId = `dapp-template-target-${uniqueKey}`;
  const newDiv = document.createElement('div');
  newDiv.id = teleportTargetId;
  node.insertAdjacentElement('afterend', newDiv);

  return teleportTargetId;
}

function getNodesStructure() {
  const nodesStructure: DappNodeElem = {
    type: 'section',
    props: {},
    children: [],
    text: null,
  };

  const templates = document.querySelectorAll<HTMLTemplateElement>(dappTemplateSelector);

  templates.forEach((template, index) => {
    const teleportNodeId = createTeleportNode(template, index);

    const templateStructure: DappNodeElem = {
      type: 'section',
      props: new Array<unknown>(),
      children: [],
      text: null,
      teleport: `#${teleportNodeId}`,
    };

    const templateChildren = template.content.children;

    Array.from(templateChildren).forEach((node) => {
      const nodeChildStructure = getNodeChildStructure(node);
      templateStructure.children.push(nodeChildStructure);
    });

    if (templateStructure.children.length) {
      nodesStructure.children.push(templateStructure);
    }

    if (!props.dev) {
      template.remove();
    }
  });

  return nodesStructure;
}

// helper functions

function toPascalCase(text: string): string {
  return text.replace(/(^\w|-\w)/g, clearAndUpper);
}

function isBase64(text: string): boolean {
  try {
    return btoa(atob(text)) === text;
  } catch (error) {
    return false;
  }
}

function clearAndUpper(text: string): string {
  return text.replace(/-/, '').toUpperCase();
}

function base64ToBytes(base64: string): Uint8Array {
  const binString = atob(base64);
  return Uint8Array.from(binString, (m) => m.codePointAt(0) || 0);
}

function convertToNumberOrBigint(strValue: string) {
  const bigIntRepresentation = BigInt(strValue);
  if (
    bigIntRepresentation <= BigInt(Number.MAX_SAFE_INTEGER) &&
    bigIntRepresentation >= BigInt(Number.MIN_SAFE_INTEGER)
  ) {
    return Number(strValue);
  } else return bigIntRepresentation;
}
</script>

<template>
  <TemplateComponents v-if="nodesStructure.children.length" />
</template>
