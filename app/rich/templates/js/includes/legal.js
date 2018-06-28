const legalModal = new Element('legal-modal');
const legalTrigger = new Element('legal');
const legalClose = new Element('legal-modal-close');

legalTrigger.click(() => legalModal.show());
legalClose.click(() => legalModal.hide());
