import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";

/**
 * Exports an array of data to a CSV file.
 * @param {string} filename - The name of the downloaded file (e.g., "data.csv").
 * @param {string[]} headers - An array of column headers.
 * @param {Array<Array<string|number>>} dataArray - The 2D array of data rows.
 */
export const exportToCSV = (filename, headers, dataArray) => {
  // Wrap each cell in quotes to safely handle commas within text
  const csvData = dataArray.map((row) => row.map((cell) => `"${cell}"`));
  const csvContent = [headers, ...csvData].map((e) => e.join(",")).join("\n");
  
  const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
  const link = document.createElement("a");
  link.href = URL.createObjectURL(blob);
  link.download = filename;
  link.click();
};

/**
 * Exports an array of data to a styled PDF file.
 * @param {string} filename - The name of the downloaded file (e.g., "data.pdf").
 * @param {string} docTitle - The title printed at the top of the document.
 * @param {Array<Array<string>>} headers - A 2D array for table headers (e.g., [["Col 1", "Col 2"]]).
 * @param {Array<Array<any>>} tableData - The 2D array of data rows.
 * @param {Object|Function} customOptions - Additional jspdf-autotable options. Can be a function that receives the `doc` instance.
 */
export const exportToPDF = (filename, docTitle, headers, tableData, customOptions = {}) => {
  const doc = new jsPDF();

  // Customize the Document Title
  doc.setFontSize(20);
  doc.setTextColor(13, 148, 136); // Teal-600 to match app theme
  doc.text(docTitle, 14, 20);

  // Add a generation timestamp
  doc.setFontSize(10);
  doc.setTextColor(100);
  doc.text(`Generated on: ${new Date().toLocaleDateString()}`, 14, 28);

  // Evaluate custom options if it's a function (useful for accessing the `doc` instance for images)
  const options = typeof customOptions === "function" ? customOptions(doc) : customOptions;

  // Define base theme styling and merge it with custom options
  autoTable(doc, {
    head: headers,
    body: tableData,
    startY: 35,
    headStyles: { fillColor: [13, 148, 136], textColor: 255, fontStyle: "bold" },
    alternateRowStyles: { fillColor: [240, 253, 250] },
    styles: { fontSize: 10, cellPadding: 4 },
    ...options,
  });

  doc.save(filename);
};