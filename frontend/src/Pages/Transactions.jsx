import { useEffect, useState } from "react";
import {
  GridComponent,
  ColumnsDirective,
  ColumnDirective,
  Resize,
  Sort,
  ContextMenu,
  Filter,
  Page,
  ExcelExport,
  PdfExport,
  Edit,
  Inject,
} from "@syncfusion/ej2-react-grids";
import { Header } from "../Components";
import { downloadCSV } from "../../utils/downloadCSV.jsx";
import Insights from "./Insights"; // Import the Insights component

const Transactions = () => {
  const [transactionsData, setTransactionsData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedTransaction, setSelectedTransaction] = useState(null);

  useEffect(() => {
    const fetchTransactions = async () => {
      const token = localStorage.getItem("token");
      if (!token) {
        setError("User not authenticated");
        setLoading(false);
        return;
      }
      try {
        const response = await fetch(
          "https://paypal-backend-gq9q.onrender.com/api/transactions",
          {
            method: "GET",
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${token}`,
            },
          }
        );
        if (!response.ok) throw new Error("Failed to fetch transactions");
        const data = await response.json();
        setTransactionsData(data);
      } catch (err) {
        setError(err.message);
      }
      setLoading(false);
    };
    fetchTransactions();
  }, []);

  // Function to format date/time
  const formatDateTime = (dateString) => {
    const date = new Date(dateString);
    const today = new Date();
    if (
      date.getDate() === today.getDate() &&
      date.getMonth() === today.getMonth() &&
      date.getFullYear() === today.getFullYear()
    ) {
      return date.toLocaleTimeString(); // Show time if today
    }
    return date.toLocaleDateString(); // Show date otherwise
  };

  // Handle clicking on transaction ID
  const handleTransactionClick = (transaction) => {
    setSelectedTransaction(transaction);
  };

  // Close modal
  const closeModal = () => {
    setSelectedTransaction(null);
  };

  const transactionsGrid = [
    {
      field: "_id",
      headerText: "ID",
      width: "100",
      textAlign: "Center",
      template: (props) => (
        <span
          className="text-blue-600 cursor-pointer underline"
          onClick={() => handleTransactionClick(props)}
        >
          {props._id}
        </span>
      ),
    },
    {
      field: "createdAt",
      headerText: "Date/Time",
      width: "150",
      textAlign: "Center",
      template: (props) => formatDateTime(props.createdAt),
    },
    {
      field: "amount",
      headerText: "Amount",
      width: "150",
      textAlign: "Center",
      template: (props) => `₹${props.amount}`, // Prepend ₹ to the amount
    },
    {
      field: "status",
      headerText: "Status",
      width: "150",
      textAlign: "Center",
    },
    { field: "note", headerText: "Note", width: "200", textAlign: "Center" },
  ];

  const handleDownload = () => {
    downloadCSV(transactionsData, "transactions.csv");
  };

  return (
    <div className="m-2 md:m-10 p-2 md:p-10 bg-white rounded-3xl">
      <Header category="Finance" title="Transactions" />

      <button
        type="button"
        onClick={handleDownload}
        className="text-md font-semibold text-blue-600 border border-blue-600 px-4 py-2 rounded-lg hover:bg-blue-600 hover:text-white transition"
      >
        Download CSV
      </button>

      {loading ? (
        <p>Loading transactions...</p>
      ) : error ? (
        <p className="text-red-500">{error}</p>
      ) : (
        <GridComponent
          id="gridcomp"
          dataSource={transactionsData}
          allowPaging
          allowSorting
        >
          <ColumnsDirective>
            {transactionsGrid.map((item, index) => (
              <ColumnDirective key={index} {...item} />
            ))}
          </ColumnsDirective>
          <Inject
            services={[Resize, Sort, ContextMenu, Filter, Page, ExcelExport, PdfExport, Edit]}
          />
        </GridComponent>
      )}

      {/* Transaction Details Modal */}
      {selectedTransaction && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center">
          <div className="bg-white p-6 rounded-lg shadow-lg w-96">
            <h2 className="text-lg font-bold mb-2">Transaction Details</h2>
            <p><strong>ID:</strong> {selectedTransaction._id}</p>
            <p><strong>Date:</strong> {formatDateTime(selectedTransaction.createdAt)}</p>
            <p><strong>Amount:</strong> ₹{selectedTransaction.amount}</p>
            <p><strong>Status:</strong> {selectedTransaction.status}</p>
            <p><strong>Note:</strong> {selectedTransaction.note || "N/A"}</p>
            <button
              onClick={closeModal}
              className="mt-4 px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700"
            >
              Close
            </button>
          </div>
        </div>
      )}

      {/* Insights Section */}
      {transactionsData.length > 0 && <Insights transactions={transactionsData} />}
    </div>
  );
};

export default Transactions;
