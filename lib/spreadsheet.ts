import * as XLSX from "xlsx";

export type SpreadsheetRow = {
  name: string;
  email: string;
  phone: string;
  city: string;
  companyPosition: string;
  onERMIS: string;
  contactPerson: string;
  previousCourses: string[];
  notifications: string[];
};

export type ImportedFileInfo = {
  name: string;
  size: number;
  rows: number;
};

const fieldAliases: Record<keyof SpreadsheetRow, string[]> = {
  name: ["name", "full name"],
  email: ["email", "email address"],
  phone: ["phone", "mobile", "telephone"],
  city: ["city", "location"],
  companyPosition: [
    "companyposition",
    "company position",
    "company / position",
  ],
  onERMIS: ["onermis", "on ermis", "ermis", "is on ermis", "ermis status"],
  contactPerson: [
    "contactperson",
    "contact person",
    "contact person name",
    "contact",
  ],
  previousCourses: ["previouscourses", "previous courses", "courses"],
  notifications: [
    "notifications",
    "notification",
    "notif",
    "notify",
    "alerts",
    "notification method",
    "notification methods",
    "notification channel",
    "notification channels",
    "contact method",
    "contact methods",
    "preferred contact",
    "preferred contact method",
    "communication",
    "communication channel",
    "channel",
  ],
};

function normalizeHeader(value: string) {
  return value.toLowerCase().replace(/[^a-z0-9]/g, "");
}

function headerMatches(normalizedHeader: string, alias: string) {
  return (
    normalizedHeader === alias ||
    normalizedHeader.includes(alias) ||
    alias.includes(normalizedHeader)
  );
}

function parseListValue(value: unknown) {
  if (Array.isArray(value)) {
    return value
      .map((entry) => String(entry).trim())
      .filter(Boolean)
      .filter((entry, index, array) => array.indexOf(entry) === index);
  }

  const text = String(value ?? "").trim();
  if (!text) return [];

  return text
    .split(/[\n,;|/&]/)
    .map((entry) => entry.trim())
    .filter(Boolean)
    .filter((entry, index, array) => array.indexOf(entry) === index);
}

function parseERMISValue(value: unknown) {
  const text = String(value ?? "")
    .trim()
    .toLowerCase();

  if (["yes", "y", "true", "1", "on"].includes(text)) return "Yes";
  if (["no", "n", "false", "0", "off"].includes(text)) return "No";
  if (text === "yes" || text === "no") {
    return text[0].toUpperCase() + text.slice(1);
  }

  return String(value ?? "").trim();
}

function extractValue(
  lookup: Map<string, unknown>,
  field: keyof SpreadsheetRow,
) {
  const aliases = fieldAliases[field].map(normalizeHeader);

  for (const [key, value] of lookup.entries()) {
    if (aliases.some((alias) => headerMatches(key, alias))) {
      return value;
    }
  }

  return "";
}

function extractValues(
  lookup: Map<string, unknown>,
  field: keyof SpreadsheetRow,
) {
  const aliases = fieldAliases[field].map(normalizeHeader);
  const values: unknown[] = [];

  for (const [key, value] of lookup.entries()) {
    if (aliases.some((alias) => headerMatches(key, alias)) && value !== "") {
      values.push(value);
    }
  }

  if (field === "notifications" && values.length === 0) {
    for (const [key, value] of lookup.entries()) {
      if (
        (key.includes("notif") ||
          key.includes("notify") ||
          key.includes("contactmethod") ||
          key.includes("preferredcontact") ||
          key.includes("communication") ||
          key.includes("channel")) &&
        value !== ""
      ) {
        values.push(value);
      }
    }
  }

  return values;
}

function mapSpreadsheetRow(row: Record<string, unknown>): SpreadsheetRow {
  const normalizedEntries = Object.entries(row).map(
    ([key, value]) => [normalizeHeader(key), value] as const,
  );
  const lookup = new Map(normalizedEntries);

  const combinedListValues = (field: "previousCourses" | "notifications") => {
    const allValues = extractValues(lookup, field);
    return allValues
      .flatMap((value) => parseListValue(value))
      .filter((entry, index, array) => array.indexOf(entry) === index);
  };

  return {
    name: String(extractValue(lookup, "name") ?? "").trim(),
    email: String(extractValue(lookup, "email") ?? "").trim(),
    phone: String(extractValue(lookup, "phone") ?? "").trim(),
    city: String(extractValue(lookup, "city") ?? "").trim(),
    companyPosition: String(
      extractValue(lookup, "companyPosition") ?? "",
    ).trim(),
    onERMIS: parseERMISValue(extractValue(lookup, "onERMIS")),
    contactPerson: String(extractValue(lookup, "contactPerson") ?? "").trim(),
    previousCourses: combinedListValues("previousCourses"),
    notifications: combinedListValues("notifications"),
  };
}

function isEmptyRow(row: SpreadsheetRow) {
  return (
    !row.name &&
    !row.email &&
    !row.phone &&
    !row.city &&
    !row.companyPosition &&
    !row.onERMIS &&
    !row.contactPerson &&
    row.previousCourses.length === 0 &&
    row.notifications.length === 0
  );
}

export function formatFileSize(size: number) {
  if (size < 1024) return `${size} B`;

  const units = ["KB", "MB", "GB"];
  let currentSize = size / 1024;
  let unitIndex = 0;

  while (currentSize >= 1024 && unitIndex < units.length - 1) {
    currentSize /= 1024;
    unitIndex += 1;
  }

  return `${currentSize.toFixed(currentSize >= 10 ? 0 : 1)} ${units[unitIndex]}`;
}

export async function parseSpreadsheetFile(file: File) {
  const buffer = await file.arrayBuffer();
  const workbook = XLSX.read(buffer, { type: "array" });
  const firstSheetName = workbook.SheetNames[0];

  if (!firstSheetName) {
    throw new Error("The uploaded file does not contain any sheets.");
  }

  const sheet = workbook.Sheets[firstSheetName];
  const sheetRows = XLSX.utils.sheet_to_json<Record<string, unknown>>(sheet, {
    defval: "",
    raw: false,
  });

  const rows = sheetRows
    .map(mapSpreadsheetRow)
    .filter((row) => !isEmptyRow(row));

  if (rows.length === 0) {
    throw new Error(
      "No usable rows were found. Make sure the spreadsheet has headers for name, email, phone, city, company position, on ERMIS, contact person, previous courses, and notifications.",
    );
  }

  return {
    rows,
    fileInfo: {
      name: file.name,
      size: file.size,
      rows: rows.length,
    } satisfies ImportedFileInfo,
  };
}
