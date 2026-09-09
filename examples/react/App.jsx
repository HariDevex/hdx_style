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
  primary: 'hdx-btn-primary',
  outline: 'hdx-btn-outline',
  ghost: 'hdx-btn-ghost',
};

const Button = ({ variant = 'primary', children }) => (
  <button className={['hdx-btn', BTN_VARIANTS[variant] || BTN_VARIANTS.primary, 'hdx-btn-md', 'hdx-focus-ring'].join(' ')}>
    {children}
  </button>
);

export default function App() {
  const stats = [
    { label: 'Total Users', value: '12,345', trend: '+12%', trendClass: 'hdx-text-success' },
    { label: 'Revenue', value: '$45,678', trend: '+8%', trendClass: 'hdx-text-success' },
    { label: 'Orders', value: '1,234', trend: '-3%', trendClass: 'hdx-text-danger' },
    { label: 'Conversion', value: '3.2%', trend: '+0.5%', trendClass: 'hdx-text-success' },
  ];

  const tasks = [
    { name: 'Ship v0.2.4', done: true },
    { name: 'Write migration guide', done: false },
    { name: 'Add Svelte example', done: false },
  ];

  return (
    <div className="hdx-min-h-screen hdx-bg-background hdx-text-text hdx-dark_bg-background">
      <div className="hdx-container hdx-mx-auto hdx-p-6">

        {/* Header */}
        <header className="hdx-flex hdx-items-center hdx-justify-between hdx-mb-8">
          <div className="hdx-flex hdx-items-center hdx-gap-3">
            <div className="hdx-w-10 hdx-h-10 hdx-rounded-lg hdx-bg-primary hdx-flex hdx-items-center hdx-justify-center hdx-text-white hdx-font-bold">
              H
            </div>
            <h1 className="hdx-text-xl hdx-font-bold">HDX Style + React</h1>
          </div>
          <nav className="hdx-flex hdx-gap-2">
            <a href="#" className="hdx-text-sm hdx-text-text-secondary hdx-hover_text-primary">Docs</a>
            <a href="#" className="hdx-text-sm hdx-text-text-secondary hdx-hover_text-primary">GitHub</a>
          </nav>
        </header>

        {/* Stats grid */}
        <div className="hdx-grid hdx-grid-cols-1 hdx-sm_grid-cols-2 hdx-lg_grid-cols-4 hdx-gap-6 hdx-mb-8">
          {stats.map((s) => (
            <div key={s.label} className="hdx-card">
              <p className="hdx-text-sm hdx-text-text-muted">{s.label}</p>
              <p className="hdx-text-2xl hdx-font-bold hdx-mt-1">{s.value}</p>
              <p className={`hdx-text-xs hdx-mt-2 ${s.trendClass}`}>{s.trend} from last month</p>
            </div>
          ))}
        </div>

        <div className="hdx-grid hdx-grid-cols-1 hdx-lg_grid-cols-3 hdx-gap-6">

          {/* Component + state variants */}
          <div className="hdx-card hdx-lg_col-span-2">
            <div className="hdx-card-header">
              <h2 className="hdx-text-lg hdx-font-semibold">Components & variants</h2>
            </div>
            <div className="hdx-card-body hdx-flex hdx-flex-col hdx-gap-3">
              <p className="hdx-text-sm hdx-text-text-secondary">Drop-in components compose with state, dark, and responsive variants:</p>
              <div className="hdx-flex hdx-flex-wrap hdx-gap-3">
                <Button>Primary</Button>
                <Button variant="outline">Outline</Button>
                <Button variant="ghost">Ghost</Button>
                <button className="hdx-btn hdx-btn-primary hdx-btn-md hdx-active_scale-95 hdx-active_bg-primary-active">
                  Press me
                </button>
              </div>
              <span className="hdx-badge-success self-start hdx-dark_bg-success">Purchased</span>
              <span className="hdx-badge-danger self-start hdx-dark_bg-danger">Cancelled</span>
            </div>
          </div>

          {/* Form */}
          <div className="hdx-card">
            <div className="hdx-card-header">
              <h2 className="hdx-text-lg hdx-font-semibold">Inline form</h2>
            </div>
            <div className="hdx-card-body hdx-flex hdx-flex-col hdx-gap-4">
              <div>
                <label className="hdx-label">Email</label>
                <input
                  type="email"
                  className="hdx-input hdx-focus_border-primary hdx-invalid_border-danger hdx-invalid_text-danger"
                  placeholder="you@example.com"
                />
              </div>
              <div>
                <label className="hdx-label">Notes</label>
                <textarea className="hdx-textarea hdx-placeholder_text-text-muted" rows="3" placeholder="Anything else?" />
              </div>
              <button className="hdx-btn hdx-btn-primary hdx-w-full hdx-focus_ring">Subscribe</button>
            </div>
          </div>

        </div>
      </div>
    </div>
  );
}