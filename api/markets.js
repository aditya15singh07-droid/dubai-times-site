const STOOQ_SYMBOLS = {
  "GC=F": "xauusd",
  "SI=F": "xagusd",
  "CL=F": "cl.f",
  "NQ=F": "nq.f",
};

const FALLBACK_MARKETS = {
  "GC=F": 4481.86,
  "SI=F": 75.46,
  "CL=F": 102.4,
  "AED=X": 3.6725,
  "BTC-USD": 77443,
  "NQ=F": 29076.5,
};

const parseStooqClose = (csv) => {
  const [headerLine, line] = csv.trim().split("\n");
  if (!line) return null;
  const headers = headerLine.split(",").map((item) => item.trim().toLowerCase());
  const columns = line.split(",");
  const closeIndex = headers.indexOf("close");
  const rawClose = columns[closeIndex === -1 ? columns.length - 1 : closeIndex]?.trim();
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
    const response = await fetchWithTimeout(`https://stooq.com/q/l/?s=${symbol}&f=sd2t2c&h&e=csv`, {
      headers: { "User-Agent": "Mozilla/5.0 DubaiTime/1.0" },
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
    const response = await fetchWithTimeout("https://api.coingecko.com/api/v3/simple/price?ids=bitcoin&vs_currencies=usd");
    if (response.ok) {
      const payload = await response.json();
      const price = Number(payload.bitcoin?.usd);
      if (Number.isFinite(price) && price > 0) return price;
    }
  } catch {
    // Try Binance below.
  }
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
      fetchStooq(STOOQ_SYMBOLS["GC=F"]),
      fetchStooq(STOOQ_SYMBOLS["SI=F"]),
      fetchStooq(STOOQ_SYMBOLS["CL=F"]),
      fetchStooq(STOOQ_SYMBOLS["NQ=F"]),
      fetchUsdAed(),
      fetchBitcoin(),
    ]);

    response.setHeader("Cache-Control", "s-maxage=60, stale-while-revalidate=240");
    response.status(200).json({
      updatedAt: new Date().toISOString(),
      markets: {
        "GC=F": gold ?? FALLBACK_MARKETS["GC=F"],
        "SI=F": silver ?? FALLBACK_MARKETS["SI=F"],
        "CL=F": oil ?? FALLBACK_MARKETS["CL=F"],
        "AED=X": usdAed ?? FALLBACK_MARKETS["AED=X"],
        "BTC-USD": bitcoin ?? FALLBACK_MARKETS["BTC-USD"],
        "NQ=F": nasdaq ?? FALLBACK_MARKETS["NQ=F"],
      },
    });
  } catch {
    response.setHeader("Cache-Control", "s-maxage=30, stale-while-revalidate=120");
    response.status(200).json({
      updatedAt: new Date().toISOString(),
      markets: FALLBACK_MARKETS,
    });
  }
}
