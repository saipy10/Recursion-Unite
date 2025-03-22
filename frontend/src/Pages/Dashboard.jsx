import { useEffect, useState } from "react";
import { ChartComponent, SeriesCollectionDirective, SeriesDirective, Inject, LineSeries, DateTime, Tooltip, Zoom } from "@syncfusion/ej2-react-charts";

const RealTimeAnalysis = () => {
  const [transactionsData, setTransactionsData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Function to fetch transactions data
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

  // Fetch data on component mount and set interval to fetch data every 5 seconds
  useEffect(() => {
    fetchTransactions();
    const interval = setInterval(() => {
      fetchTransactions();
    }, 5000);
    
    return () => clearInterval(interval); // Clean up interval on unmount
  }, []);

  // Function to format data for chart (converting createdAt to Date and summing amounts by time)
  const formatChartData = (data) => {
    const chartData = [];
    data.forEach((transaction) => {
      const time = new Date(transaction.createdAt).getTime(); // Convert createdAt to timestamp
      const existingDataPoint = chartData.find((point) => point.x === time);
      if (existingDataPoint) {
        existingDataPoint.y += transaction.amount; // Sum amounts for the same time
      } else {
        chartData.push({ x: time, y: transaction.amount });
      }
    });
    return chartData;
  };

  // Custom function to format date/time based on the same day or not
  const customLabelFormat = (args) => {
    const date = new Date(args.value);
    const today = new Date();
    if (
      date.getDate() === today.getDate() &&
      date.getMonth() === today.getMonth() &&
      date.getFullYear() === today.getFullYear()
    ) {
      return `${date.getHours()}:${date.getMinutes().toString().padStart(2, "0")}`; // Show hours:minutes if same day
    }
    return `${date.getDate()}/${date.getMonth() + 1}`; // Show day/month if not same day
  };

  return (
    <div className="m-2 md:m-10 p-2 md:p-10 bg-white rounded-3xl">
      {loading ? (
        <p>Loading real-time data...</p>
      ) : error ? (
        <p className="text-red-500">{error}</p>
      ) : (
        <ChartComponent
          id="realTimeChart"
          primaryXAxis={{
            valueType: "DateTime",
            labelFormat: "dd/MM/yyyy", // Default format for date when it's not today
            edgeLabelPlacement: "Shift",
            labelRotation: 45, // Optional: Adjust for better readability if needed
          }}
          primaryYAxis={{
            title: "Amount Spent (₹)",
            labelFormat: "₹{value}",
          }}
          tooltip={{
            enable: true,
            shared: true,
            format: "${point.x} : ${point.y}", // Format tooltip to show time and amount
          }}
          zoomSettings={{
            enableMouseWheelZooming: true, // Enable zoom with mouse wheel
            enablePinchZooming: true, // Enable pinch zooming on touch devices
          }}
        >
          <Inject services={[LineSeries, DateTime, Tooltip, Zoom]} />
          <SeriesCollectionDirective>
            <SeriesDirective
              dataSource={formatChartData(transactionsData)}
              xName="x"
              yName="y"
              type="Line"
              name="Amount Spent"
              width={2}
            />
          </SeriesCollectionDirective>
        </ChartComponent>
      )}
    </div>
  );
};

export default RealTimeAnalysis;
