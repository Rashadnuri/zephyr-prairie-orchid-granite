import { useEffect, useMemo, useRef, useState, type PointerEvent as ReactPointerEvent } from "react";
import { ChevronUp, Globe2, MapPin, Minus, Plus, Search, X } from "lucide-react";
import {
  COUNTRIES,
  COUNTRY_BY_KEY,
  countryValue,
  searchCountries,
  type Country,
} from "@/data/countries";
import {
  LAND_BY_NAME,
  LANDS,
  MAP_H,
  MAP_W,
  graticuleD,
  sphereD,
  type LandShape,
} from "@/data/geometry";
import {
  METRICS,
  METRIC_BY_KEY,
  formatMetric,
  ordinal,
  type MetricKey,
} from "@/data/metrics";

type Cam = { x: number; y: number; k: number };
type Scale = { min: number; max: number; edges: number[] };

const EMPTY_CAM: Cam = { x: 0, y: 0, k: 1 };

function buildScale(values: number[]): Scale {
  const sorted = [...values].sort((a, b) => a - b);
  const min = sorted[0] ?? 0;
  const max = sorted[sorted.length - 1] ?? 0;
  if (sorted.length === 0 || max === min) return { min, max, edges: [min, min, min, min] };
  const at = (portion: number) => {
    const index = portion * (sorted.length - 1);
    const low = Math.floor(index);
    const high = Math.ceil(index);
    const t = index - low;
    return sorted[low] * (1 - t) + sorted[high] * t;
  };
  const edges = [0.2, 0.4, 0.6, 0.8].map(at);
  const collapsed = edges.some((edge, index) => edge <= (index === 0 ? min : edges[index - 1]));
  if (collapsed) {
    const span = max - min;
    return { min, max, edges: [0.2, 0.4, 0.6, 0.8].map((portion) => min + span * portion) };
  }
  return { min, max, edges };
}

function binFor(value: number | null, scale: Scale): number {
  if (value == null) return 0;
  let bin = 1;
  for (const edge of scale.edges) {
    if (value > edge) bin += 1;
    else break;
  }
  return Math.min(5, bin);
}

function median(values: number[]): number {
  if (values.length === 0) return 0;
  const sorted = [...values].sort((a, b) => a - b);
  const mid = Math.floor(sorted.length / 2);
  return sorted.length % 2 === 0 ? (sorted[mid - 1] + sorted[mid]) / 2 : sorted[mid];
}

function clampCam(cam: Cam): Cam {
  const k = Math.min(14, Math.max(1, cam.k));
  if (k <= 1.001) return EMPTY_CAM;
  const slack = 72;
  return {
    k,
    x: Math.min(MAP_W * 0.5 + slack, Math.max(MAP_W * (0.5 - k) - slack, cam.x)),
    y: Math.min(MAP_H * 0.5 + slack, Math.max(MAP_H * (0.5 - k) - slack, cam.y)),
  };
}

function camFor(land: LandShape): Cam {
  const [[x0, y0], [x1, y1]] = land.bounds;
  const dx = Math.max(x1 - x0, 18);
  const dy = Math.max(y1 - y0, 18);
  const fit = 0.78 / Math.max(dx / MAP_W, dy / MAP_H);
  const k = Math.min(10, Math.max(1, fit));
  return clampCam({
    k,
    x: MAP_W / 2 - k * ((x0 + x1) / 2),
    y: MAP_H / 2 - k * ((y0 + y1) / 2),
  });
}

function clientToSvg(svg: SVGSVGElement, clientX: number, clientY: number) {
  const point = svg.createSVGPoint();
  point.x = clientX;
  point.y = clientY;
  const matrix = svg.getScreenCTM();
  if (!matrix) return { x: 0, y: 0 };
  const local = point.matrixTransform(matrix.inverse());
  return { x: local.x, y: local.y };
}

function place(value: number, scale: Scale) {
  if (scale.max === scale.min) return 100;
  return Math.min(100, Math.max(0, ((value - scale.min) / (scale.max - scale.min)) * 100));
}

export function AtlasView() {
  const [metric, setMetric] = useState<MetricKey>("gdpPc");
  const [selectedKey, setSelectedKey] = useState<string | null>(null);
  const [hoverKey, setHoverKey] = useState<string | null>(null);
  const [cam, setCam] = useState<Cam>(EMPTY_CAM);
  const [sheetOpen, setSheetOpen] = useState(false);
  const [query, setQuery] = useState("");
  const [searchOpen, setSearchOpen] = useState(false);
  const [activeResult, setActiveResult] = useState(0);
  const [tip, setTip] = useState({ x: 0, y: 0 });
  const svgRef = useRef<SVGSVGElement>(null);
  const frameRef = useRef<HTMLDivElement>(null);
  const camRef = useRef(cam);
  const animRef = useRef(0);
  const skipClick = useRef(false);
  const [mounted, setMounted] = useState(false);
  const dragRef = useRef<{
    id: number;
    x: number;
    y: number;
    cam: Cam;
    moved: boolean;
  } | null>(null);
  const pointers = useRef(new Map<number, { x: number; y: number }>());
  const pinchRef = useRef<{ dist: number; cam: Cam; mx: number; my: number } | null>(null);

  const scales = useMemo(() => {
    const next = {} as Record<MetricKey, Scale>;
    for (const item of METRICS) {
      const values = COUNTRIES.map((country) => country[item.key]).filter(
        (value): value is number => value != null,
      );
      next[item.key] = buildScale(values);
    }
    return next;
  }, []);

  const rankings = useMemo(() => {
    const next = {} as Record<MetricKey, Country[]>;
    for (const item of METRICS) {
      next[item.key] = COUNTRIES.filter((country) => country[item.key] != null).sort(
        (a, b) => (b[item.key] as number) - (a[item.key] as number),
      );
    }
    return next;
  }, []);

  const scale = scales[metric];
  const ranking = rankings[metric];
  const definition = METRIC_BY_KEY[metric];
  const selected = selectedKey ? (COUNTRY_BY_KEY.get(selectedKey) ?? null) : null;
  const hovered = hoverKey ? (COUNTRY_BY_KEY.get(hoverKey) ?? null) : null;
  const results = searchCountries(query);
  const med = median(ranking.map((country) => country[metric] as number));
  const highest = ranking[0];
  const lowest = ranking[ranking.length - 1];

  function remember(next: Cam) {
    const clamped = clampCam(next);
    camRef.current = clamped;
    setCam(clamped);
    return clamped;
  }

  function animateTo(target: Cam) {
    cancelAnimationFrame(animRef.current);
    const from = camRef.current;
    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (reduce) {
      remember(target);
      return;
    }
    const started = performance.now();
    const step = (now: number) => {
      const t = Math.min(1, (now - started) / 520);
      const eased = 1 - (1 - t) ** 3;
      remember({
        x: from.x + (target.x - from.x) * eased,
        y: from.y + (target.y - from.y) * eased,
        k: from.k + (target.k - from.k) * eased,
      });
      if (t < 1) animRef.current = requestAnimationFrame(step);
    };
    animRef.current = requestAnimationFrame(step);
  }

  function selectCountry(key: string) {
    setSelectedKey(key);
    setSheetOpen(true);
    setSearchOpen(false);
    setQuery("");
    const land = LAND_BY_NAME.get(key);
    if (land) animateTo(camFor(land));
  }

  function zoomBy(factor: number) {
    const svg = svgRef.current;
    if (!svg) return;
    const rect = svg.getBoundingClientRect();
    const mid = clientToSvg(svg, rect.left + rect.width / 2, rect.top + rect.height / 2);
    const current = camRef.current;
    const k = Math.min(14, Math.max(1, current.k * factor));
    const gx = (mid.x - current.x) / current.k;
    const gy = (mid.y - current.y) / current.k;
    animateTo({ k, x: mid.x - k * gx, y: mid.y - k * gy });
  }

  useEffect(() => {
    setMounted(true);
    return () => cancelAnimationFrame(animRef.current);
  }, []);

  useEffect(() => {
    const svg = svgRef.current;
    if (!svg || !mounted) return;
    const onWheel = (event: WheelEvent) => {
      event.preventDefault();
      cancelAnimationFrame(animRef.current);
      const current = camRef.current;
      const local = clientToSvg(svg, event.clientX, event.clientY);
      const factor = event.deltaY < 0 ? 1.12 : 1 / 1.12;
      const k = Math.min(14, Math.max(1, current.k * factor));
      const gx = (local.x - current.x) / current.k;
      const gy = (local.y - current.y) / current.k;
      remember({ k, x: local.x - k * gx, y: local.y - k * gy });
    };
    svg.addEventListener("wheel", onWheel, { passive: false });
    return () => svg.removeEventListener("wheel", onWheel);
  }, [mounted]);

  useEffect(() => {
    const onKey = (event: KeyboardEvent) => {
      const target = event.target as HTMLElement | null;
      const typing = target && (target.tagName === "INPUT" || target.tagName === "TEXTAREA");
      if (event.key === "/" && !typing) {
        event.preventDefault();
        document.getElementById("country-search")?.focus();
      }
      if (event.key === "Escape") {
        setSearchOpen(false);
        setHoverKey(null);
      }
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, []);

  function moveTip(event: ReactPointerEvent) {
    const frame = frameRef.current;
    if (!frame) return;
    const rect = frame.getBoundingClientRect();
    const width = 220;
    let x = event.clientX - rect.left + 16;
    let y = event.clientY - rect.top + 16;
    if (x + width > rect.width - 8) x = event.clientX - rect.left - width - 12;
    if (y + 92 > rect.height - 8) y = event.clientY - rect.top - 96;
    setTip({ x: Math.max(8, x), y: Math.max(8, y) });
  }

  function onPointerDown(event: ReactPointerEvent<SVGSVGElement>) {
    pointers.current.set(event.pointerId, { x: event.clientX, y: event.clientY });
    if (pointers.current.size === 2) {
      const [a, b] = [...pointers.current.values()];
      const svg = svgRef.current;
      if (!svg) return;
      const mid = clientToSvg(svg, (a.x + b.x) / 2, (a.y + b.y) / 2);
      pinchRef.current = {
        dist: Math.hypot(a.x - b.x, a.y - b.y),
        cam: camRef.current,
        mx: mid.x,
        my: mid.y,
      };
      dragRef.current = null;
      return;
    }
    cancelAnimationFrame(animRef.current);
    const svg = svgRef.current;
    if (!svg) return;
    const local = clientToSvg(svg, event.clientX, event.clientY);
    dragRef.current = {
      id: event.pointerId,
      x: local.x,
      y: local.y,
      cam: camRef.current,
      moved: false,
    };
    svg.setPointerCapture(event.pointerId);
  }

  function onPointerMove(event: ReactPointerEvent<SVGSVGElement>) {
    if (pointers.current.has(event.pointerId)) {
      pointers.current.set(event.pointerId, { x: event.clientX, y: event.clientY });
    }
    if (pointers.current.size === 2 && pinchRef.current) {
      const [a, b] = [...pointers.current.values()];
      const dist = Math.hypot(a.x - b.x, a.y - b.y);
      const svg = svgRef.current;
      if (!svg || pinchRef.current.dist === 0) return;
      const factor = dist / pinchRef.current.dist;
      const k = Math.min(14, Math.max(1, pinchRef.current.cam.k * factor));
      const gx = (pinchRef.current.mx - pinchRef.current.cam.x) / pinchRef.current.cam.k;
      const gy = (pinchRef.current.my - pinchRef.current.cam.y) / pinchRef.current.cam.k;
      remember({ k, x: pinchRef.current.mx - k * gx, y: pinchRef.current.my - k * gy });
      return;
    }
    const drag = dragRef.current;
    if (!drag || drag.id !== event.pointerId) {
      if (hoverKey) moveTip(event);
      return;
    }
    const svg = svgRef.current;
    if (!svg) return;
    const local = clientToSvg(svg, event.clientX, event.clientY);
    if (Math.hypot(local.x - drag.x, local.y - drag.y) > 3) drag.moved = true;
    remember({
      ...drag.cam,
      x: drag.cam.x + (local.x - drag.x),
      y: drag.cam.y + (local.y - drag.y),
    });
  }

  function onPointerUp(event: ReactPointerEvent<SVGSVGElement>) {
    pointers.current.delete(event.pointerId);
    if (pointers.current.size < 2) pinchRef.current = null;
    const drag = dragRef.current;
    if (drag?.id === event.pointerId) {
      if (drag.moved) skipClick.current = true;
      dragRef.current = null;
    }
  }

  function onCountryClick(key: string) {
    if (skipClick.current) {
      skipClick.current = false;
      return;
    }
    selectCountry(key);
  }

  const hotName = hoverKey ?? selectedKey;
  const hotLand = hotName ? LAND_BY_NAME.get(hotName) : undefined;
  const hotCountry = hotName ? COUNTRY_BY_KEY.get(hotName) : undefined;

  const rangeLabels = [scale.min, ...scale.edges, scale.max];

  return (
    <div className="flex h-dvh flex-col bg-paper-deep text-ink">
      <header className="shrink-0 px-4 pt-3 pb-2 lg:px-6 lg:pt-4">
        <div className="flex flex-col gap-3 lg:flex-row lg:items-center">
          <div className="flex items-center gap-3 lg:w-64 lg:shrink-0">
            <span className="grid size-11 place-items-center rounded-2xl bg-accent text-on-accent">
              <Globe2 className="size-5" aria-hidden="true" />
            </span>
            <div>
              <p className="text-sm font-semibold tracking-wide text-accent">Statistik atlas</p>
              <h1 className="font-display text-2xl leading-none font-semibold">Xəritəxana</h1>
            </div>
          </div>

          <div
            className="no-scrollbar flex gap-1 overflow-x-auto rounded-full bg-card p-1 lg:mx-auto"
            role="group"
            aria-label="Göstərici"
          >
            {METRICS.map((item) => {
              const active = item.key === metric;
              return (
                <button
                  key={item.key}
                  type="button"
                  aria-pressed={active}
                  onClick={() => setMetric(item.key)}
                  className={
                    "min-h-11 shrink-0 rounded-full px-4 text-sm font-semibold transition-colors " +
                    (active ? "bg-ink text-paper" : "text-ink hover:bg-paper-deep")
                  }
                >
                  {item.short}
                </button>
              );
            })}
          </div>

          <div className="relative lg:w-72 lg:shrink-0">
            <Search
              className="pointer-events-none absolute top-1/2 left-3 size-4 -translate-y-1/2 text-muted"
              aria-hidden="true"
            />
            <input
              id="country-search"
              value={query}
              placeholder="Ölkə və ya paytaxt"
              aria-label="Ölkə axtar"
              autoComplete="off"
              onChange={(event) => {
                setQuery(event.target.value);
                setSearchOpen(true);
                setActiveResult(0);
              }}
              onFocus={() => setSearchOpen(true)}
              onKeyDown={(event) => {
                if (event.key === "ArrowDown") {
                  event.preventDefault();
                  setActiveResult((index) => Math.min(results.length - 1, index + 1));
                } else if (event.key === "ArrowUp") {
                  event.preventDefault();
                  setActiveResult((index) => Math.max(0, index - 1));
                } else if (event.key === "Enter" && results[activeResult]) {
                  event.preventDefault();
                  selectCountry(results[activeResult].key);
                } else if (event.key === "Escape") {
                  setSearchOpen(false);
                }
              }}
              className="h-11 w-full rounded-full border border-line bg-card pr-11 pl-10 text-sm outline-none focus:border-accent"
            />
            {query ? (
              <button
                type="button"
                aria-label="Axtarışı təmizlə"
                onClick={() => {
                  setQuery("");
                  setSearchOpen(false);
                }}
                className="absolute top-1/2 right-2 grid size-8 -translate-y-1/2 place-items-center rounded-full text-muted hover:bg-paper-deep"
              >
                <X className="size-4" />
              </button>
            ) : null}
            {searchOpen && results.length > 0 ? (
              <ul className="absolute z-40 mt-2 w-full overflow-hidden rounded-2xl border border-line bg-card shadow-float">
                {results.map((country, index) => (
                  <li key={country.key}>
                    <button
                      type="button"
                      onMouseDown={(event) => event.preventDefault()}
                      onMouseEnter={() => setActiveResult(index)}
                      onClick={() => selectCountry(country.key)}
                      className={
                        "flex min-h-11 w-full items-center justify-between gap-3 px-3 text-left " +
                        (index === activeResult ? "bg-paper-deep" : "bg-card")
                      }
                    >
                      <span>
                        <span className="block text-sm font-semibold">{country.name}</span>
                        <span className="block text-sm text-muted">{country.capital}</span>
                      </span>
                      <span className="text-sm font-semibold tabular-nums">
                        {formatMetric(metric, countryValue(country, metric))}
                      </span>
                    </button>
                  </li>
                ))}
              </ul>
            ) : null}
          </div>
        </div>

        <div className="no-scrollbar mt-3 flex gap-2 overflow-x-auto">
          <div className="flex h-11 shrink-0 items-center gap-2 rounded-full border border-line bg-card px-3">
            <span className="text-sm text-muted">Median</span>
            <span className="text-sm font-semibold tabular-nums">
              {formatMetric(metric, med)}
            </span>
          </div>
          {highest ? (
            <button
              type="button"
              onClick={() => selectCountry(highest.key)}
              className="flex h-11 shrink-0 items-center gap-2 rounded-full border border-line bg-card px-3 hover:border-accent"
            >
              <span className="text-sm text-muted">Ən yüksək</span>
              <span className="text-sm font-semibold">{highest.name}</span>
            </button>
          ) : null}
          {lowest ? (
            <button
              type="button"
              onClick={() => selectCountry(lowest.key)}
              className="flex h-11 shrink-0 items-center gap-2 rounded-full border border-line bg-card px-3 hover:border-accent"
            >
              <span className="text-sm text-muted">Ən aşağı</span>
              <span className="text-sm font-semibold">{lowest.name}</span>
            </button>
          ) : null}
        </div>
      </header>

      <div className="relative flex min-h-0 flex-1 flex-col lg:flex-row">
        <div ref={frameRef} className="relative min-h-0 flex-1">
          <svg
            ref={svgRef}
            viewBox={`0 0 ${MAP_W} ${MAP_H}`}
            className="h-full w-full touch-none bg-ocean select-none"
            role="application"
            aria-label="Dünya xəritəsi. Ölkəni seçmək üçün toxunun və ya sürükləyərək gəzin."
            onPointerDown={onPointerDown}
            onPointerMove={onPointerMove}
            onPointerUp={onPointerUp}
            onPointerCancel={onPointerUp}
          >
            <g transform={`translate(${cam.x} ${cam.y}) scale(${cam.k})`}>
              {mounted ? (
                <>
                  <path
                    d={sphereD}
                    className="ocean"
                    onClick={() => {
                      if (skipClick.current) {
                        skipClick.current = false;
                        return;
                      }
                      setSelectedKey(null);
                    }}
                  />
                  <path d={graticuleD} className="graticule" />
                  {LANDS.map((land) => {
                    const country = COUNTRY_BY_KEY.get(land.name);
                    const value = country ? countryValue(country, metric) : null;
                    const bin = binFor(value, scale);
                    return (
                      <path
                        key={land.name}
                        d={land.d}
                        data-bin={bin}
                        className={
                          "land" +
                          (land.name === selectedKey ? " is-selected" : "") +
                          (land.name === hoverKey ? " is-hot" : "")
                        }
                        role="button"
                        tabIndex={0}
                        aria-label={`${country?.name ?? "Naməlum ərazi"}, ${formatMetric(metric, value)}`}
                        onPointerEnter={(event) => {
                          setHoverKey(land.name);
                          moveTip(event);
                        }}
                        onPointerLeave={() =>
                          setHoverKey((current) => (current === land.name ? null : current))
                        }
                        onClick={(event) => {
                          event.stopPropagation();
                          onCountryClick(land.name);
                        }}
                        onKeyDown={(event) => {
                          if (event.key === "Enter" || event.key === " ") {
                            event.preventDefault();
                            selectCountry(land.name);
                          }
                        }}
                      />
                    );
                  })}
                  {hotLand ? (
                    <path
                      d={hotLand.d}
                      data-bin={binFor(
                        hotCountry ? countryValue(hotCountry, metric) : null,
                        scale,
                      )}
                      className="land is-hot pointer-events-none"
                      aria-hidden="true"
                    />
                  ) : null}
                  <path d={sphereD} className="sphere-edge" />
                </>
              ) : null}
            </g>
          </svg>

          <div className="pointer-events-none absolute top-3 left-3 z-10 w-44 rounded-2xl border border-line bg-card/95 p-3 shadow-float lg:bottom-4 lg:top-auto lg:w-56">
            <p className="text-sm font-semibold">{definition.label}</p>
            <div className="mt-2 flex gap-1 lg:hidden" aria-hidden="true">
              {[1, 2, 3, 4, 5].map((bin) => (
                <span key={bin} data-bin={bin} className="swatch h-2.5 flex-1 rounded-sm" />
              ))}
            </div>
            <p className="mt-1 text-sm text-muted tabular-nums lg:hidden">
              {formatMetric(metric, scale.min)} – {formatMetric(metric, scale.max)}
            </p>
            <ol className="mt-2 hidden flex-col gap-1.5 lg:flex">
              {[5, 4, 3, 2, 1].map((bin) => (
                <li key={bin} className="flex items-center gap-2">
                  <span data-bin={bin} className="swatch size-4 shrink-0 rounded-sm" />
                  <span className="text-sm text-muted tabular-nums">
                    {formatMetric(metric, rangeLabels[bin - 1])} – {formatMetric(metric, rangeLabels[bin])}
                  </span>
                </li>
              ))}
            </ol>
            <div className="mt-2 flex items-center gap-2">
              <span className="swatch size-4 shrink-0 rounded-sm" />
              <span className="text-sm text-muted">Məlumat yoxdur</span>
            </div>
            <p className="mt-2 hidden text-sm text-muted lg:block">Hər rəng təxminən eyni sayda ölkəni tutur.</p>
          </div>

          <div className="absolute top-3 right-3 z-10 flex flex-col gap-2 lg:top-auto lg:right-4 lg:bottom-4">
            <button
              type="button"
              aria-label="Yaxınlaşdır"
              onClick={() => zoomBy(1.35)}
              className="grid size-11 place-items-center rounded-full border border-line bg-card text-ink shadow-float hover:border-accent"
            >
              <Plus className="size-5" />
            </button>
            <button
              type="button"
              aria-label="Uzaqlaşdır"
              onClick={() => zoomBy(1 / 1.35)}
              className="grid size-11 place-items-center rounded-full border border-line bg-card text-ink shadow-float hover:border-accent"
            >
              <Minus className="size-5" />
            </button>
            <button
              type="button"
              aria-label="Bütün dünyanı göstər"
              onClick={() => animateTo(EMPTY_CAM)}
              className="grid size-11 place-items-center rounded-full border border-line bg-card text-ink shadow-float hover:border-accent"
            >
              <Globe2 className="size-5" />
            </button>
          </div>

          {hovered ? (
            <div
              className="pointer-events-none absolute z-20 w-56 rounded-2xl border border-line bg-card px-3 py-2 shadow-float"
              style={{ left: tip.x, top: tip.y }}
            >
              <p className="font-display text-lg leading-tight font-semibold">{hovered.name}</p>
              <p className="text-sm text-muted">{definition.label}</p>
              <p className="text-sm font-semibold tabular-nums">
                {formatMetric(metric, countryValue(hovered, metric))}
              </p>
            </div>
          ) : null}
        </div>

        <aside
          className={
            "z-20 flex min-h-0 flex-col border-line bg-card lg:static lg:h-full lg:w-[22.5rem] lg:border-t-0 lg:border-l " +
            (sheetOpen
              ? "absolute inset-x-0 bottom-0 max-h-[68%] rounded-t-3xl border shadow-float lg:max-h-none lg:rounded-none lg:shadow-none"
              : "absolute inset-x-0 bottom-0 h-14 overflow-hidden border-t lg:h-full lg:overflow-hidden")
          }
        >
          <button
            type="button"
            className="flex h-14 w-full shrink-0 items-center justify-between px-4 lg:hidden"
            aria-expanded={sheetOpen}
            onClick={() => setSheetOpen((open) => !open)}
          >
            <span className="text-sm font-semibold">
              {selected ? selected.name : "Sıralama"}
            </span>
            <ChevronUp className={"size-5 transition-transform " + (sheetOpen ? "rotate-180" : "")} />
          </button>

          <div className={(sheetOpen ? "flex" : "hidden lg:flex") + " min-h-0 flex-1 flex-col"}>
            <div className="min-h-0 flex-1 overflow-y-auto px-4 pb-4 lg:px-5 lg:pt-5">
              {selected ? (
                <CountryDetail
                  country={selected}
                  metric={metric}
                  ranking={ranking}
                  scales={scales}
                  onClose={() => setSelectedKey(null)}
                  onFocus={() => {
                    const land = LAND_BY_NAME.get(selected.key);
                    if (land) animateTo(camFor(land));
                  }}
                />
              ) : (
                <Leaderboard
                  metric={metric}
                  hint={definition.hint}
                  ranking={ranking}
                  onSelect={selectCountry}
                />
              )}
            </div>
            <p className="shrink-0 border-t border-line px-4 py-3 text-sm text-muted lg:px-5">
              Nümunə məlumatlar · 2024-cü il təxminləri
            </p>
          </div>
        </aside>
      </div>
    </div>
  );
}

function Leaderboard({
  metric,
  hint,
  ranking,
  onSelect,
}: {
  metric: MetricKey;
  hint: string;
  ranking: Country[];
  onSelect: (key: string) => void;
}) {
  const top = ranking.slice(0, 8);
  const max = (top[0]?.[metric] as number) || 1;
  return (
    <div>
      <p className="text-sm font-semibold text-accent">Sıralama</p>
      <h2 className="mt-1 font-display text-3xl leading-tight font-semibold">{hint}</h2>
      <p className="mt-2 text-sm text-pretty text-muted">
        Xəritədən ölkə seçin. Rəng nə qədər tünddürsə, göstərici bir o qədər yüksəkdir.
      </p>
      <ol className="mt-4 flex flex-col">
        {top.map((country, index) => {
          const value = country[metric] as number;
          return (
            <li key={country.key}>
              <button
                type="button"
                onClick={() => onSelect(country.key)}
                className="flex min-h-14 w-full items-center gap-3 border-t border-line py-2 text-left hover:bg-paper"
              >
                <span className="w-6 text-sm font-semibold text-muted tabular-nums">{index + 1}</span>
                <span className="min-w-0 flex-1">
                  <span className="block truncate text-sm font-semibold">{country.name}</span>
                  <span className="mt-1 block h-1.5 overflow-hidden rounded-full bg-paper-deep">
                    <span
                      className="block h-full rounded-full bg-accent"
                      style={{ width: `${(value / max) * 100}%` }}
                    />
                  </span>
                </span>
                <span className="text-sm font-semibold tabular-nums">
                  {formatMetric(metric, value)}
                </span>
              </button>
            </li>
          );
        })}
      </ol>
    </div>
  );
}

function CountryDetail({
  country,
  metric,
  ranking,
  scales,
  onClose,
  onFocus,
}: {
  country: Country;
  metric: MetricKey;
  ranking: Country[];
  scales: Record<MetricKey, Scale>;
  onClose: () => void;
  onFocus: () => void;
}) {
  const value = countryValue(country, metric);
  const rank = ranking.findIndex((item) => item.key === country.key) + 1;
  return (
    <div>
      <div className="flex items-start justify-between gap-3">
        <p className="text-sm font-semibold text-accent">{country.region}</p>
        <button
          type="button"
          aria-label="Seçimi bağla"
          onClick={onClose}
          className="grid size-11 place-items-center rounded-full border border-line hover:border-accent"
        >
          <X className="size-4" />
        </button>
      </div>
      <h2 className="font-display text-4xl leading-tight font-semibold">{country.name}</h2>
      <p className="mt-1 flex items-center gap-1.5 text-sm text-muted">
        <MapPin className="size-4 shrink-0" aria-hidden="true" />
        Paytaxt: {country.capital}
      </p>
      <p className="mt-5 text-sm text-muted">{METRIC_BY_KEY[metric].label}</p>
      <p className="font-display text-4xl font-semibold tabular-nums">
        {formatMetric(metric, value)}
      </p>
      {rank > 0 ? (
        <p className="mt-1 text-sm text-muted">
          {ranking.length} ölkə arasında {ordinal(rank)} yer
        </p>
      ) : (
        <p className="mt-1 text-sm text-muted">Bu göstərici üçün məlumat yoxdur</p>
      )}
      {value != null ? (
        <div className="mt-3 h-2 overflow-hidden rounded-full bg-paper-deep">
          <div
            className="h-full rounded-full bg-accent"
            style={{ width: `${place(value, scales[metric])}%` }}
          />
        </div>
      ) : null}
      <button
        type="button"
        onClick={onFocus}
        className="mt-4 min-h-11 rounded-full bg-ink px-4 text-sm font-semibold text-paper"
      >
        Xəritədə göstər
      </button>
      <h3 className="mt-6 text-sm font-semibold">Bütün göstəricilər</h3>
      <ul className="mt-2 flex flex-col gap-3">
        {METRICS.map((item) => {
          const current = countryValue(country, item.key);
          return (
            <li key={item.key}>
              <div className="flex items-baseline justify-between gap-3">
                <span className={"text-sm " + (item.key === metric ? "font-semibold" : "text-muted")}>
                  {item.label}
                </span>
                <span className="text-sm font-semibold tabular-nums">
                  {formatMetric(item.key, current)}
                </span>
              </div>
              <div className="mt-1 h-1.5 overflow-hidden rounded-full bg-paper-deep">
                <div
                  className={"h-full rounded-full " + (item.key === metric ? "bg-accent" : "bg-ramp-3")}
                  style={{ width: current == null ? "0%" : `${place(current, scales[item.key])}%` }}
                />
              </div>
            </li>
          );
        })}
      </ul>
    </div>
  );
}
