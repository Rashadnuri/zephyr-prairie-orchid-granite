export type MetricKey = "population" | "gdpPc" | "life" | "internet" | "forest";

export type MetricDef = {
  key: MetricKey;
  label: string;
  short: string;
  hint: string;
};

export const METRICS: MetricDef[] = [
  {
    key: "population",
    label: "Əhali",
    short: "Əhali",
    hint: "Ən çox əhalisi olan ölkələr",
  },
  {
    key: "gdpPc",
    label: "ÜDM/nəfər",
    short: "ÜDM/nəfər",
    hint: "Adambaşına nominal ÜDM",
  },
  {
    key: "life",
    label: "Orta ömür",
    short: "Orta ömür",
    hint: "Doğuşda gözlənilən ömür müddəti",
  },
  {
    key: "internet",
    label: "İnternet",
    short: "İnternet",
    hint: "İnternetdən istifadə edən əhalinin payı",
  },
  {
    key: "forest",
    label: "Meşə örtüyü",
    short: "Meşə",
    hint: "Ərazinin meşə ilə örtülü payı",
  },
];

export const METRIC_BY_KEY: Record<MetricKey, MetricDef> = {
  population: METRICS[0],
  gdpPc: METRICS[1],
  life: METRICS[2],
  internet: METRICS[3],
  forest: METRICS[4],
};

function formatNumber(value: number, digits: number): string {
  const negative = value < 0;
  const fixed = Math.abs(value).toFixed(digits);
  const [whole, fraction = ""] = fixed.split(".");
  const grouped = whole.replace(/\B(?=(\d{3})+(?!\d))/g, "\u00a0");
  const trimmed = digits > 0 ? fraction.replace(/0+$/, "") : "";
  const body = trimmed ? `${grouped},${trimmed}` : grouped;
  return negative ? `-${body}` : body;
}

export function formatPopulation(value: number): string {
  if (value >= 1_000_000_000) return `${formatNumber(value / 1_000_000_000, 1)} mlrd`;
  if (value >= 1_000_000) return `${formatNumber(value / 1_000_000, 1)} mln`;
  return formatNumber(value, 0);
}

export function formatMetric(key: MetricKey, value: number | null): string {
  if (value == null) return "Məlumat yoxdur";
  switch (key) {
    case "population":
      return `${formatPopulation(value)} nəfər`;
    case "gdpPc":
      return `${formatNumber(value, 0)} $`;
    case "life":
      return `${formatNumber(value, 1)} il`;
    case "internet":
    case "forest":
      return `${formatNumber(value, 1)}%`;
  }
}

export function ordinal(n: number): string {
  const lastTwo = n % 100;
  const last = n % 10;
  if (last === 0) {
    const tens = lastTwo === 0 ? 0 : Math.floor(lastTwo / 10);
    const suffix =
      tens === 1 || tens === 3
        ? "cu"
        : tens === 4 || tens === 6 || tens === 9
          ? "cı"
          : tens === 0
            ? "cü"
            : "ci";
    return `${n}-${suffix}`;
  }
  const suffix =
    last === 3 || last === 4 ? "cü" : last === 6 ? "cı" : last === 9 ? "cu" : "ci";
  return `${n}-${suffix}`;
}
