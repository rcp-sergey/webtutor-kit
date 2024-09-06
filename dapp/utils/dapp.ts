export const dappTemplateSelector = 'template[data-dapp-template]';
export const spaTeleportNodeClass = 'zone-main-wrapper';

export function removeDappAsyncHideIfNoTemplates() {
    const optTemplate = document.querySelector(dappTemplateSelector);
    if (!optTemplate) {
        removeDappAsyncHide();
    }
}

export function removeDappAsyncHide() {
    console.log('reset hide');
    const htmlNodeWithClass = document.querySelector('.dapp-async-hide');
    if (htmlNodeWithClass) {
        htmlNodeWithClass.classList.remove('dapp-async-hide');
        console.log('done');
    }
}

export function createSpaDevRootNode() {
    let spaTeleportNode = document.querySelector(`.${spaTeleportNodeClass}`);
    if (!spaTeleportNode) {
        spaTeleportNode = document.createElement('div');
        spaTeleportNode.classList.add(spaTeleportNodeClass);
        document.body.appendChild(spaTeleportNode);
    }
}
