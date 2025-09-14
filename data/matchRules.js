import rules from "../out/rules.json" assert { type: "json" };

export function matchRules({
  seats,
  alcohol = false,
  servingFood = false,
  gas = false,
}) {
  const nSeats = Number(seats) || 0;

  const matched = [];

  if (nSeats <= rules[0].condition.seating_lte && alcohol === false) {
    matched.push(rules[0]);
  }

  if (servingFood) {
    matched.push(rules[1]);
  }

  if (gas) {
    matched.push(rules[2]);
  }

  return matched;
}
