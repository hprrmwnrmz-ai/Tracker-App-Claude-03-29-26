export type InjectionSite =
  | 'abdomen-lower-left'
  | 'abdomen-lower-right'
  | 'abdomen-upper-left'
  | 'abdomen-upper-right'
  | 'thigh-left'
  | 'thigh-right'
  | 'upper-arm-left'
  | 'upper-arm-right';

export const INJECTION_SITE_LABELS: Record<InjectionSite, string> = {
  'abdomen-lower-left': 'Stomach - Lower Left',
  'abdomen-lower-right': 'Stomach - Lower Right',
  'abdomen-upper-left': 'Stomach - Upper Left',
  'abdomen-upper-right': 'Stomach - Upper Right',
  'thigh-left': 'Thigh - Left',
  'thigh-right': 'Thigh - Right',
  'upper-arm-left': 'Upper Arm - Left',
  'upper-arm-right': 'Upper Arm - Right',
};

export const INJECTION_SITE_ROTATION: InjectionSite[] = [
  'abdomen-lower-left',
  'abdomen-lower-right',
  'abdomen-upper-left',
  'abdomen-upper-right',
  'thigh-left',
  'thigh-right',
  'upper-arm-left',
  'upper-arm-right',
];

export interface ShotEntry {
  id: string;
  timestamp: string; // ISO 8601
  dose: number;      // mg — supports any dose (3.25, 5, 7.5, etc.)
  site: InjectionSite;
  notes: string;
}
