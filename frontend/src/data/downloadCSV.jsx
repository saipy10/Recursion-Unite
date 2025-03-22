export const downloadCSV = (data, filename) => {
  if (!data || data.length === 0) {
    console.error("No data provided for CSV download");
    return;
  }

  // Define CSV headers
  const headers = Object.keys(data[0]);
  const csvRows = [
    headers.join(","), // Header row
    ...data.map((row) =>
      headers.map((header) => `"${row[header] || ""}"`).join(",")
    ), // Data rows
  ];

  // Create CSV content
  const csvContent = csvRows.join("\n");

  // Create a Blob and trigger download
  const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
  const link = document.createElement("a");
  const url = URL.createObjectURL(blob);
  link.setAttribute("href", url);
  link.setAttribute("download", filename || "data_trans.csv");
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
};