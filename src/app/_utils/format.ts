export function capitalizeFirstLetter(str: string): string {
  return str.charAt(0).toUpperCase() + str.slice(1);
}

export function formatName(name: string): string {
  return name
    .split("-")
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
    .join(" ");
}

// Example: "https://pokeapi.co/api/v2/machine/61/"
// return 61
export function extractIdFromUrl(url: string): number {
  const parts = url.split("/");
  const lastPart = parts[parts.length - 2];
  return /^\d+$/.test(lastPart) ? parseInt(lastPart, 10) : -1;
}

export function extractResourceAndId(url: string): [string, string] {
  const match = url.match(/\/(\w+)\/(\d+)\//);
  if (match) {
    const [, resource, id] = match;
    return [resource, id];
  }
  return ["ability", "1"];
}

export function isNumber(s: string): boolean {
  return /^\d+$/.test(s);
}

export function stringToInt(s: string): number {
  return parseInt(s, 10);
}
