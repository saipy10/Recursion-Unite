// utils/downloadCSV.jsx
export const downloadCSV = (data, filename = "data.csv") => {
    if (!data || !data.length) {
      alert("No data available to download!");
      return;
    }
  
    // Extract column headers
    const csvHeaders = Object.keys(data[0]).join(",");
    // Convert rows into CSV format
    const csvRows = data.map((row) => Object.values(row).join(","));
    const csvContent = [csvHeaders, ...csvRows].join("\n");
  
    // Create a Blob and trigger download
    const blob = new Blob([csvContent], { type: "text/csv" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = filename;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };
  