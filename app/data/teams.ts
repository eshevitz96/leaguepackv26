
export interface Team {
  id: string;
  name: string;
  ticker: string;
  sport: 'CFB' | 'CBB';
  price: number;
  change: number;
  record: string;
  rank?: number;
  color: string;
  initial: string;
  prestige: number; // 1-100 (Blue Blood Status)
  hype: number;     // 1-10 (Market Volume/Sentiment)
}

export const TEAMS: Team[] = [
  // College Football (CFB)
  { id: 'cfb-1', name: 'Alabama Crimson Tide', ticker: 'BAMA', sport: 'CFB', price: 125.50, change: 2.4, record: '12-2', rank: 4, color: '#9E1B32', initial: 'A', prestige: 95, hype: 8 },
  { id: 'cfb-2', name: 'Georgia Bulldogs', ticker: 'UGA', sport: 'CFB', price: 130.20, change: -1.2, record: '13-1', rank: 2, color: '#BA0C2F', initial: 'G', prestige: 92, hype: 7 },
  { id: 'cfb-3', name: 'Ohio State Buckeyes', ticker: 'OSU', sport: 'CFB', price: 118.75, change: 0.8, record: '11-2', rank: 6, color: '#BB0000', initial: 'O', prestige: 90, hype: 9 },
  { id: 'cfb-4', name: 'Michigan Wolverines', ticker: 'MICH', sport: 'CFB', price: 140.00, change: 5.1, record: '15-0', rank: 1, color: '#00274C', initial: 'M', prestige: 88, hype: 10 },
  { id: 'cfb-5', name: 'Texas Longhorns', ticker: 'TEX', sport: 'CFB', price: 122.10, change: 1.5, record: '12-2', rank: 3, color: '#BF5700', initial: 'T', prestige: 94, hype: 8 },
  { id: 'cfb-6', name: 'Oregon Ducks', ticker: 'ORE', sport: 'CFB', price: 115.30, change: 3.2, record: '12-2', rank: 5, color: '#154733', initial: 'O', prestige: 85, hype: 9 },
  { id: 'cfb-7', name: 'LSU Tigers', ticker: 'LSU', sport: 'CFB', price: 98.40, change: -0.5, record: '10-3', rank: 12, color: '#461D7C', initial: 'L', prestige: 89, hype: 6 },
  { id: 'cfb-8', name: 'Clemson Tigers', ticker: 'CLEM', sport: 'CFB', price: 88.90, change: -2.1, record: '9-4', rank: 20, color: '#F56600', initial: 'C', prestige: 87, hype: 4 },

  // College Basketball (CBB)
  { id: 'cbb-1', name: 'Duke Blue Devils', ticker: 'DUKE', sport: 'CBB', price: 85.20, change: 1.2, record: '18-4', rank: 8, color: '#003087', initial: 'D', prestige: 98, hype: 7 },
  { id: 'cbb-2', name: 'UNC Tar Heels', ticker: 'UNC', sport: 'CBB', price: 82.50, change: -1.5, record: '19-5', rank: 7, color: '#99BADD', initial: 'N', prestige: 96, hype: 8 },
  { id: 'cbb-3', name: 'Kansas Jayhawks', ticker: 'KU', sport: 'CBB', price: 92.10, change: 0.5, record: '20-4', rank: 4, color: '#0051BA', initial: 'K', prestige: 97, hype: 8 },
  { id: 'cbb-4', name: 'UConn Huskies', ticker: 'UCONN', sport: 'CBB', price: 95.80, change: 2.8, record: '22-2', rank: 1, color: '#000E2F', initial: 'C', prestige: 90, hype: 10 },
  { id: 'cbb-5', name: 'Purdue Boilermakers', ticker: 'PUR', sport: 'CBB', price: 94.50, change: -0.2, record: '21-3', rank: 2, color: '#CEB888', initial: 'P', prestige: 80, hype: 9 },
  { id: 'cbb-6', name: 'Kentucky Wildcats', ticker: 'UK', sport: 'CBB', price: 78.30, change: 4.1, record: '17-6', rank: 15, color: '#0033A0', initial: 'K', prestige: 99, hype: 10 }, // Calipari/Pope hype
  { id: 'cbb-7', name: 'Houston Cougars', ticker: 'HOU', sport: 'CBB', price: 93.00, change: 1.1, record: '21-3', rank: 3, color: '#C8102E', initial: 'H', prestige: 75, hype: 8 },
  { id: 'cbb-8', name: 'Arizona Wildcats', ticker: 'ARIZ', sport: 'CBB', price: 88.75, change: -0.8, record: '19-5', rank: 5, color: '#CC0033', initial: 'A', prestige: 85, hype: 7 },
];
