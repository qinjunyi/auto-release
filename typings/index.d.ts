declare module '*.json';

export interface ReleaseParams {
  currentVersion: string;
  npmRegistry?: string;
  npmAuthToken?: string;
  mainBranch?: string;
  needPublish?: boolean;
}
