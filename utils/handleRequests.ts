import { Response } from "redaxios";

export function catchErrThrow401(err: Response<string> | any): string {
  if (err?.status === 401) throw err;
  return err?.body || "toString" in err ? err.toString() : JSON.stringify(err);
}
