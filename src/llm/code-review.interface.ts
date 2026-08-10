export interface CodeReviewFile {
  fileName: string;
  language: string;
  patch: string;
  additions: number;
  deletions: number;
}