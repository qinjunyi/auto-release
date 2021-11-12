export interface ReleaseParams {
  currentVersion: string;
  npmRegistry: string;
  npmAuthToken: string;
  mainBranch?: string;
}
