const STOOQ_SYMBOLS = {
  gold: "xauusd",
  silver: "xagusd",
  oil: "cl.f",
  nasdaq: "nq.f",
};

const parseStooqClose = (csv) => {
  const line = csv.trim().split("\n")[1];
  if (!line) return null;
  const columns = line.split(",");
  const rawClose = columns[6]?.trim();
  if (!rawClose || rawClose.toLowerCase() === "n/d") return null;
  const close = Number(rawClose);
  return Number.isFinite(close) && close > 0 ? close : null;
};

const fetchWithTimeout = (url, options = {}) =>
  fetch(url, {
    ...options,
    signal: AbortSignal.timeout(4500),
  });

const fetchStooq = async (symbol) => {
  try {
    const response = await fetchWithTimeout(`https://stooq.com/q/l/?s=${symbol}&f=sd2t2ohlcv&h&e=csv`, {
      headers: { "User-Agent": "Dubai-Time-Market-Ticker/1.0" },
    });
    if (!response.ok) return null;
    return parseStooqClose(await response.text());
  } catch {
    return null;
  }
};

const fetchUsdAed = async () => {
  try {
    const response = await fetchWithTimeout("https://open.er-api.com/v6/latest/USD");
    if (!response.ok) return 3.6725;
    const payload = await response.json();
    const rate = Number(payload.rates?.AED);
    return Number.isFinite(rate) && rate > 0 ? rate : 3.6725;
  } catch {
    return 3.6725;
  }
};

const fetchBitcoin = async () => {
  try {
    const response = await fetchWithTimeout("https://api.binance.com/api/v3/ticker/price?symbol=BTCUSDT");
    if (!response.ok) return null;
    const payload = await response.json();
    const price = Number(payload.price);
    return Number.isFinite(price) && price > 0 ? price : null;
  } catch {
    return null;
  }
};

export default async function handler(_request, response) {
  try {
    const [gold, silver, oil, nasdaq, usdAed, bitcoin] = await Promise.all([
      fetchStooq(STOOQ_SYMBOLS.gold),
      fetchStooq(STOOQ_SYMBOLS.silver),
      fetchStooq(STOOQ_SYMBOLS.oil),
      fetchStooq(STOOQ_SYMBOLS.nasdaq),
      fetchUsdAed(),
      fetchBitcoin(),
    ]);

    response.setHeader("Cache-Control", "s-maxage=60, stale-while-revalidate=240");
    response.status(200).json({
      updatedAt: new Date().toISOString(),
      markets: {
        "GC=F": gold,
        "SI=F": silver,
        "CL=F": oil,
        "AED=X": usdAed,
        "BTC-USD": bitcoin,
        "NQ=F": nasdaq,
      },
    });
  } catch {
    response.setHeader("Cache-Control", "s-maxage=30, stale-while-revalidate=120");
    response.status(200).json({
      updatedAt: new Date().toISOString(),
      markets: {
        "AED=X": 3.6725,
      },
    });
  }
}
