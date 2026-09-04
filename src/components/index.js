import { buttonComponents } from './button.js';
import { inputComponents } from './input.js';
import { cardComponents } from './card.js';
import { badgeComponents } from './badge.js';
import { alertComponents } from './alert.js';
import { avatarComponents } from './avatar.js';
import { modalComponents } from './modal.js';
import { tableComponents } from './table.js';
import { containerComponent } from './container.js';

/**
 * Get all component definitions
 * @param {import('../core/types.js').HdxConfig} config
 * @returns {import('../core/types.js').ComponentDefinition[]}
 */
export function getAllComponents(config) {
  const customComponents = config._customComponents || [];

  return [
    ...buttonComponents(config),
    ...inputComponents(config),
    ...cardComponents(config),
    ...badgeComponents(config),
    ...alertComponents(config),
    ...avatarComponents(config),
    ...modalComponents(config),
    ...tableComponents(config),
    ...containerComponent(config),
    ...customComponents,
  ];
}
