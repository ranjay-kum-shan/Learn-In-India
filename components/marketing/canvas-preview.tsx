/**
 * Static SVG preview of the design canvas — used on the landing hero before
 * the heavy tldraw bundle loads. Stylized to feel like the real grader's UX.
 * Server component (no client JS).
 */
export function CanvasPreview() {
  return (
    <div className="relative overflow-hidden rounded-2xl border border-border/80 bg-card/40 shadow-2xl shadow-brand-500/10 backdrop-blur">
      <div className="flex items-center justify-between border-b border-border/60 bg-background/40 px-4 py-2.5">
        <div className="flex items-center gap-2">
          <span className="h-3 w-3 rounded-full bg-rose-400/80" />
          <span className="h-3 w-3 rounded-full bg-amber-400/80" />
          <span className="h-3 w-3 rounded-full bg-emerald-400/80" />
        </div>
        <div className="text-xs text-muted-foreground">Design — URL Shortener</div>
        <div className="flex gap-2">
          <div className="h-6 w-16 rounded-md bg-muted/70" />
          <div className="h-6 w-16 rounded-md bg-brand-500/80 text-[10px] font-medium leading-6 text-white text-center">
            Compile
          </div>
        </div>
      </div>

      <div className="relative aspect-[16/10] bg-grid-faint">
        <svg
          viewBox="0 0 800 500"
          className="absolute inset-0 h-full w-full"
          xmlns="http://www.w3.org/2000/svg"
        >
          {/* edges */}
          <defs>
            <marker
              id="arrow"
              markerWidth="8"
              markerHeight="8"
              refX="7"
              refY="4"
              orient="auto"
            >
              <path d="M0,0 L0,8 L8,4 z" fill="hsl(199 89% 55%)" />
            </marker>
          </defs>

          <Edge x1={120} y1={250} x2={210} y2={250} />
          <Edge x1={330} y1={250} x2={420} y2={170} />
          <Edge x1={330} y1={250} x2={420} y2={250} />
          <Edge x1={330} y1={250} x2={420} y2={330} />
          <Edge x1={540} y1={170} x2={620} y2={130} />
          <Edge x1={540} y1={250} x2={620} y2={250} />
          <Edge x1={540} y1={330} x2={620} y2={370} />

          {/* Nodes */}
          <Node x={50} y={210} w={140} h={80} label="Client" sub="web · mobile" hue={208} />
          <Node x={210} y={210} w={120} h={80} label="API Gateway" sub="JWT · TLS" hue={170} />
          <Node x={420} y={130} w={120} h={80} label="Shortener Svc" sub="× 6 instances" hue={199} />
          <Node x={420} y={210} w={120} h={80} label="Redirect Svc" sub="× 12 instances" hue={199} />
          <Node x={420} y={290} w={120} h={80} label="Analytics Svc" sub="async" hue={252} />
          <Node x={620} y={90} w={130} h={80} label="Postgres" sub="primary + 2RR" hue={26} />
          <Node x={620} y={210} w={130} h={80} label="Redis" sub="hot key cache" hue={0} />
          <Node x={620} y={330} w={130} h={80} label="Kafka" sub="click events" hue={42} />
        </svg>

        {/* Floating feedback chip */}
        <div className="absolute bottom-4 right-4 max-w-[260px] rounded-xl border border-emerald-500/30 bg-emerald-500/10 p-3 text-xs shadow-lg backdrop-blur">
          <div className="flex items-center gap-2 font-semibold text-emerald-500">
            <span className="inline-block h-2 w-2 rounded-full bg-emerald-500 animate-pulse" />
            Score: 84 / 100
          </div>
          <div className="mt-1 text-emerald-200/90">
            Strong: read path, hot-key cache.
            <br />
            Gap: cite write-coalescing on counter.
          </div>
        </div>
      </div>
    </div>
  )
}

function Node({
  x,
  y,
  w,
  h,
  label,
  sub,
  hue,
}: {
  x: number
  y: number
  w: number
  h: number
  label: string
  sub: string
  hue: number
}) {
  return (
    <g>
      <rect
        x={x}
        y={y}
        width={w}
        height={h}
        rx={14}
        fill={`hsl(${hue} 90% 18%)`}
        stroke={`hsl(${hue} 90% 55%)`}
        strokeOpacity={0.7}
        strokeWidth={1.5}
      />
      <text
        x={x + 14}
        y={y + 28}
        fontFamily="ui-sans-serif"
        fontSize={13}
        fontWeight={600}
        fill="white"
      >
        {label}
      </text>
      <text
        x={x + 14}
        y={y + 48}
        fontFamily="ui-sans-serif"
        fontSize={11}
        fill={`hsl(${hue} 90% 75%)`}
      >
        {sub}
      </text>
    </g>
  )
}

function Edge({
  x1,
  y1,
  x2,
  y2,
}: {
  x1: number
  y1: number
  x2: number
  y2: number
}) {
  const mx = (x1 + x2) / 2
  return (
    <path
      d={`M ${x1} ${y1} C ${mx} ${y1}, ${mx} ${y2}, ${x2} ${y2}`}
      fill="none"
      stroke="hsl(199 89% 55%)"
      strokeOpacity={0.65}
      strokeWidth={1.5}
      markerEnd="url(#arrow)"
    />
  )
}
