// HDX Style — React (JSX) example
// ------------------------------------------------------------------
// Build the stylesheet (from the repo root):
//   node src/cli/index.js build -p -c examples/react/hdx.config.js
//
// This file is a runnable component: mount it in any Vite/Next.js/CRA
// React project and import the built CSS once:
//   import "@haridevx/hdx-style/css";   // published package
//   import "./dist/hdx.css";            // local build
//
// Note: the content scanner resolves static class strings. Dynamically
// concatenated classes (template-literal interpolation) can't be discovered —
// keep component class maps static, exactly like this Button:
// ------------------------------------------------------------------

const BTN_VARIANTS = {
  primary: 'hdx_btn-primary',
  outline: 'hdx_btn-outline',
  ghost: 'hdx_btn-ghost',
};

const Button = ({ variant = 'primary', children }) => (
  <button className={['hdx_btn', BTN_VARIANTS[variant] || BTN_VARIANTS.primary, 'hdx_btn-md', 'hdx_focus-ring'].join(' ')}>
    {children}
  </button>
);

export default function App() {
  const stats = [
    { label: 'Total Users', value: '12,345', trend: '+12%', trendClass: 'hdx_text-success' },
    { label: 'Revenue', value: '$45,678', trend: '+8%', trendClass: 'hdx_text-success' },
    { label: 'Orders', value: '1,234', trend: '-3%', trendClass: 'hdx_text-danger' },
    { label: 'Conversion', value: '3.2%', trend: '+0.5%', trendClass: 'hdx_text-success' },
  ];

  const tasks = [
    { name: 'Ship v0.2.4', done: true },
    { name: 'Write migration guide', done: false },
    { name: 'Add Svelte example', done: false },
  ];

  return (
    <div className="hdx_min-h-screen hdx_bg-background hdx_text-text hdx_dark_bg-background">
      <div className="hdx_container hdx_mx-auto hdx_p-6">

        {/* Header */}
        <header className="hdx_flex hdx_items-center hdx_justify-between hdx_mb-8">
          <div className="hdx_flex hdx_items-center hdx_gap-3">
            <div className="hdx_w-10 hdx_h-10 hdx_rounded-lg hdx_bg-primary hdx_flex hdx_items-center hdx_justify-center hdx_text-white hdx_font-bold">
              H
            </div>
            <h1 className="hdx_text-xl hdx_font-bold">HDX Style + React</h1>
          </div>
          <nav className="hdx_flex hdx_gap-2">
            <a href="#" className="hdx_text-sm hdx_text-text-secondary hdx_hover_text-primary">Docs</a>
            <a href="#" className="hdx_text-sm hdx_text-text-secondary hdx_hover_text-primary">GitHub</a>
          </nav>
        </header>

        {/* Stats grid */}
        <div className="hdx_grid hdx_grid-cols-1 hdx_sm_grid-cols-2 hdx_lg_grid-cols-4 hdx_gap-6 hdx_mb-8">
          {stats.map((s) => (
            <div key={s.label} className="hdx_card">
              <p className="hdx_text-sm hdx_text-text-muted">{s.label}</p>
              <p className="hdx_text-2xl hdx_font-bold hdx_mt-1">{s.value}</p>
              <p className={`hdx_text-xs hdx_mt-2 ${s.trendClass}`}>{s.trend} from last month</p>
            </div>
          ))}
        </div>

        <div className="hdx_grid hdx_grid-cols-1 hdx_lg_grid-cols-3 hdx_gap-6">

          {/* Component + state variants */}
          <div className="hdx_card hdx_lg_col-span-2">
            <div className="hdx_card-header">
              <h2 className="hdx_text-lg hdx_font-semibold">Components & variants</h2>
            </div>
            <div className="hdx_card-body hdx_flex hdx_flex-col hdx_gap-3">
              <p className="hdx_text-sm hdx_text-text-secondary">Drop-in components compose with state, dark, and responsive variants:</p>
              <div className="hdx_flex hdx_flex-wrap hdx_gap-3">
                <Button>Primary</Button>
                <Button variant="outline">Outline</Button>
                <Button variant="ghost">Ghost</Button>
                <button className="hdx_btn hdx_btn-primary hdx_btn-md hdx_active_scale-95 hdx_active_bg-primary-active">
                  Press me
                </button>
              </div>
              <span className="hdx_badge-success self-start hdx_dark_bg-success">Purchased</span>
              <span className="hdx_badge-danger self-start hdx_dark_bg-danger">Cancelled</span>
            </div>
          </div>

          {/* Form */}
          <div className="hdx_card">
            <div className="hdx_card-header">
              <h2 className="hdx_text-lg hdx_font-semibold">Inline form</h2>
            </div>
            <div className="hdx_card-body hdx_flex hdx_flex-col hdx_gap-4">
              <div>
                <label className="hdx_label">Email</label>
                <input
                  type="email"
                  className="hdx_input hdx_focus_border-primary hdx_invalid_border-danger hdx_invalid_text-danger"
                  placeholder="you@example.com"
                />
              </div>
              <div>
                <label className="hdx_label">Notes</label>
                <textarea className="hdx_textarea hdx_placeholder_text-text-muted" rows="3" placeholder="Anything else?" />
              </div>
              <button className="hdx_btn hdx_btn-primary hdx_w-full hdx_focus_ring">Subscribe</button>
            </div>
          </div>

        </div>
      </div>
    </div>
  );
}