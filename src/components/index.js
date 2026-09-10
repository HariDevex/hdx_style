import { buttonComponents } from './button.js';
import { inputComponents } from './input.js';
import { cardComponents } from './card.js';
import { badgeComponents } from './badge.js';
import { alertComponents } from './alert.js';
import { avatarComponents } from './avatar.js';
import { modalComponents } from './modal.js';
import { tableComponents } from './table.js';
import { containerComponent } from './container.js';
import { toastComponents } from './toast.js';
import { tooltipComponents } from './tooltip.js';
import { layoutComponents } from './layout.js';
import { interactiveComponents } from './interactive.js';
import { iconComponents } from './icon.js';
import { notificationComponents } from './notification.js';
import { navComponents } from './nav.js';

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
    ...toastComponents(config),
    ...tooltipComponents(config),
    ...layoutComponents(config),
    ...interactiveComponents(config),
    ...iconComponents(config),
    ...notificationComponents(config),
    ...navComponents(config),
    ...customComponents,
  ];
}
