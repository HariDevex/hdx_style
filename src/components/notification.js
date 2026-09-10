import { colorVariable } from '../generator/resolver.js';

/**
 * Notification component definitions — persistent indicators and list items.
 * Distinct from toasts (transient/auto-dismissing).
 *
 * @param {import('../core/types.js').HdxConfig} config
 * @returns {import('../core/types.js').ComponentDefinition[]}
 */
export function notificationComponents(config) {
  const prefix = config.prefix;
  const { fontSize, radius, shadows } = config.theme;
  const cv = (key) => colorVariable(key, prefix);

  return [
    // Small filled circle indicator (e.g. unread dot on an avatar or icon).
    // Positioned relative to a position:relative parent.
    {
      name: 'ui-notification-dot',
      css: `position: absolute;
top: 0;
right: 0;
width: 0.5rem;
height: 0.5rem;
border-radius: ${radius.full};
background-color: ${cv('danger')};
border: 2px solid ${cv('surface')};`,
      category: 'components',
    },

    // Count/text badge (e.g. "9", "99+") — same role as dot but sized for text.
    {
      name: 'ui-notification-badge',
      css: `position: absolute;
top: -0.25rem;
right: -0.25rem;
min-width: 1.25rem;
height: 1.25rem;
padding: 0 0.25rem;
border-radius: ${radius.full};
background-color: ${cv('danger')};
color: ${cv('on-accent')};
font-size: ${fontSize.xs};
font-weight: 600;
line-height: 1.25rem;
text-align: center;
white-space: nowrap;`,
      category: 'components',
    },

    // Row item for a notification list/panel: icon/avatar slot + text + timestamp.
    {
      name: 'ui-notification-item',
      css: `display: flex;
align-items: flex-start;
gap: 0.75rem;
padding: 0.75rem 1rem;
border-bottom: 1px solid ${cv('border')};
transition: background-color 150ms ease;
cursor: pointer;`,
      states: [
        {
          selector: ':hover',
          css: `background-color: ${cv('surface-secondary')};`,
        },
      ],
      category: 'components',
    },

    // Unread modifier — left accent border, slightly tinted background.
    {
      name: 'ui-notification-item-unread',
      css: `background-color: ${cv('surface-secondary')};
border-left: 3px solid ${cv('primary')};`,
      category: 'components',
    },

    // Scrollable container for notification items (persistent dropdown-style panel).
    {
      name: 'ui-notification-panel',
      css: `background-color: ${cv('surface')};
border: 1px solid ${cv('border')};
border-radius: ${radius.lg};
box-shadow: ${shadows.md};
max-height: 24rem;
overflow-y: auto;`,
      category: 'components',
    },
  ];
}
