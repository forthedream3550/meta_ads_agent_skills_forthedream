import { appendFile, mkdir } from "node:fs/promises";
import { dirname } from "node:path";

export async function appendAuditRecord(record: Record<string, unknown>): Promise<void> {
  const path = process.env.META_ADS_AUDIT_LOG_PATH || "./data/audit-log.jsonl";
  await mkdir(dirname(path), { recursive: true });
  const safeRecord = {
    ...record,
    timestamp: new Date().toISOString()
  };
  await appendFile(path, `${JSON.stringify(safeRecord)}\n`, { encoding: "utf8" });
}
