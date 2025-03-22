import { useState, useEffect } from "react";
import {
  ScheduleComponent,
  Month,
  Inject,
  Resize,
  DragAndDrop,
} from "@syncfusion/ej2-react-schedule";
import { Header } from "../Components";

const Calendar = () => {
  const [transactionData, setTransactionData] = useState([]);
  const [selectedTransactions, setSelectedTransactions] = useState([]);
  const [selectedDate, setSelectedDate] = useState("");
  const [showModal, setShowModal] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Fetch transaction data from the backend
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
        const transactions = data.transactions || data;
        setTransactionData(
          transactions.map((txn) => ({
            date: new Date(txn.createdAt).toISOString().split("T")[0],
            amount: txn.amount,
            note: txn.note || "N/A", // Keep original note, default to "N/A" if empty
          }))
        );
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchTransactions();
  }, []);

  // Function to handle day click and fetch transactions for that date
  const onCellClick = (args) => {
    const clickedDate = args.startTime.toISOString().split("T")[0];
    const filteredTransactions = transactionData.filter(
      (txn) => txn.date === clickedDate
    );
    setSelectedTransactions(filteredTransactions);
    setSelectedDate(clickedDate);
    setShowModal(true);
  };

  return (
    <div className="m-2 md:m-10 mt-24 p-2 md:p-10 bg-white rounded-3xl">
      <Header category="App" title="Scheduler" />

      {loading ? (
        <p className="text-gray-600">Loading transactions...</p>
      ) : error ? (
        <p className="text-red-500">{error}</p>
      ) : (
        <ScheduleComponent
          height="650px"
          currentView="Month"
          selectedDate={new Date()}
          cellClick={onCellClick}
          showQuickInfo={false}
        >
          <Inject services={[Month, Resize, DragAndDrop]} />
        </ScheduleComponent>
      )}

      {/* Transactions Popup */}
      {showModal && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
          <div className="bg-white p-6 rounded-lg shadow-lg w-[400px] h-[400px] overflow-y-auto">
            <h2 className="text-lg font-bold mb-3">
              Transactions on {selectedDate}
            </h2>
            {selectedTransactions.length > 0 ? (
              <ul className="max-h-[300px] overflow-y-auto">
                {selectedTransactions.map((txn, index) => (
                  <li key={index} className="p-2 border-b">
                    {txn.note}:{" "}
                    <span className="font-semibold">₹{txn.amount}</span>
                  </li>
                ))}
              </ul>
            ) : (
              <p>No transactions found.</p>
            )}
            <button
              className="mt-4 px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-700 w-full"
              onClick={() => setShowModal(false)}
            >
              Close
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default Calendar;