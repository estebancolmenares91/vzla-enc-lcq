export const EVENT = {
  dateISO: "2026-07-04T15:00:00-04:00",
  dateLabel: "4 JUL 2026",
  timeLabel: "3:00 PM VET",
  twitchChannel: "ninoccikai",
  host: "ninoccikai",
  gofundme: "https://www.gofundme.com/f/venezuela-fg-community-earthquake-relief",
  goalUSD: 18000,
  raisedUSD: 4323,
  hashtag: "#EncClasificatorio",
};

export interface Player {
  name: string;
  gt: string;
  char: string;
  charImg: string;
  record: string;
  accent: "cyan" | "flame";
  pct: number;
}

export const P1: Player = {
  name: "CELFCOOL",
  gt: "{{PLAYER_1_GT}}",
  char: "Deejay",
  charImg: "deejay",
  record: "23-4",
  accent: "cyan",
  pct: 52,
};

export const P2: Player = {
  name: "FOREVERCARLONE",
  gt: "{{PLAYER_2_GT}}",
  char: "Zangief",
  charImg: "zangief",
  record: "21-6",
  accent: "flame",
  pct: 48,
};

export const VOTE_TOTAL = 0;
