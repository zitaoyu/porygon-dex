export enum DetailType {
  ABILITY = "ability",
  ITEM = "item",
  MOVE = "move",
  UNKNOWN = "Unknown",
}

export interface DetailPanelData {
  type: DetailType;
  friendlyName: string;
  detail: string;
}
