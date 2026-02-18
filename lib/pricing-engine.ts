import { Team } from "@/app/data/teams";

/**
 * Calculates the market price of a team based on the "Composite Pricing" model.
 * 
 * Formula:
 * Price = (Prestige Component) + (Performance Component) + (Hype Component)
 * 
 * 1. Prestige (30% weight roughly): Base value from historical status (0-100).
 * 2. Performance (50% weight roughly): Wins add value, Losses subtract. Big boost for Top 25 rank.
 * 3. Hype (20% weight roughly): Market sentiment multiplier.
 */
export function calculateTeamPrice(team: Team): number {
    // 1. Prestige Component
    // Base scale: $20 - $80 based on prestige (0-100)
    const prestigeValue = 30 + (team.prestige * 0.6);

    // 2. Performance Component (Sport Adjusted)
    const [wins, losses] = parseRecord(team.record);

    // CFB: Fewer games, so each win is worth MORE.
    // CBB: More games, so each win is worth LESS (to normalize).
    const winMultiplier = team.sport === 'CFB' ? 10 : 3.5;
    const lossPenalty = team.sport === 'CFB' ? 5 : 2;

    const winValue = wins * winMultiplier;
    const lossValue = losses * lossPenalty;

    // Rank Bonus: (26 - Rank) * 2. Example: Rank 1 gets $50 bonus. Unranked gets $0.
    let rankBonus = 0;
    if (team.rank && team.rank <= 25) {
        rankBonus = (26 - team.rank) * 2;
    }

    const performanceValue = winValue - lossValue + rankBonus;

    // 3. Hype Component
    // 1-10 scale. 5 is neutral. Each point above 5 adds 5% value.
    const hypeValue = (team.hype - 5) * 5;

    // Total Calculation
    let rawPrice = prestigeValue + performanceValue + hypeValue;

    // Safety floors
    return Math.max(rawPrice, 10.00); // Minimum price $10
}

function parseRecord(record: string): [number, number] {
    try {
        const parts = record.split('-');
        return [parseInt(parts[0]), parseInt(parts[1])];
    } catch (e) {
        return [0, 0];
    }
}
