const escapeCsv = (value) => `"${String(value ?? '').replace(/"/g, '""')}"`;

const toCsv = (columns, rows) => {
  const header = columns.map((column) => escapeCsv(column.header)).join(',');
  const body = rows.map((row) => columns.map((column) => escapeCsv(column.value(row))).join(',')).join('\n');
  return [header, body].filter(Boolean).join('\n');
};

module.exports = { toCsv };
