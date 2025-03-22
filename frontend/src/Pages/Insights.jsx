import React, { useState, useEffect } from "react";
import ReactMarkdown from "react-markdown";

const Insights = () => {
  const [transactions, setTransactions] = useState([]);
  const [insights, setInsights] = useState([]);
  const [categoryTotals, setCategoryTotals] = useState({});
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const BASE_URL = "https://paypal-backend-gq9q.onrender.com";

  // Fetch transaction data on mount and generate insights
  useEffect(() => {
    const fetchTransactionsAndGenerateInsights = async () => {
      const token = localStorage.getItem("token");
      if (!token) {
        setError("User not authenticated. Please log in.");
        return;
      }

      setLoading(true);
      try {
        const response = await fetch(`${BASE_URL}/api/transactions`, {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        });

        if (!response.ok) throw new Error("Failed to fetch transactions");
        const data = await response.json();
        const transactionList = (data.transactions || data).map((txn) => ({
          date: new Date(txn.createdAt).toISOString().split("T")[0],
          amount: txn.amount,
          note: txn.note || "N/A",
        }));
        setTransactions(transactionList);

        // Generate insights and category totals after fetching transactions
        const insightsData = generateInsights(transactionList);
        const categoryTotalsData = generateCategoryTotals(transactionList);
        setInsights(insightsData);
        setCategoryTotals(categoryTotalsData);
      } catch (err) {
        setError(`Error fetching transactions: ${err.message}`);
      } finally {
        setLoading(false);
      }
    };

    fetchTransactionsAndGenerateInsights();
  }, []);

  // Categorize transactions
  const categorizeTransaction = (note) => {
    if (!note || note.trim() === "" || note === "N/A") return "Misc";
    const lowerNote = note.toLowerCase();
    if (
      lowerNote.includes("entertainment") ||
      lowerNote.includes("movie") ||
      lowerNote.includes("concert")
    )
      return "Entertainment";
    if (
      lowerNote.includes("grocery") ||
      lowerNote.includes("food") ||
      lowerNote.includes("supermarket")
    )
      return "Grocery";
    if (
      lowerNote.includes("medical") ||
      lowerNote.includes("doctor") ||
      lowerNote.includes("hospital")
    )
      return "Medical";
    if (
      lowerNote.includes("stokes") ||
      lowerNote.includes("stock") ||
      lowerNote.includes("investment")
    )
      return "Stokes";
    if (
      lowerNote.includes("rent") ||
      lowerNote.includes("house") ||
      lowerNote.includes("apartment")
    )
      return "Rent";
    return "Misc";
  };

  // Generate category totals
  const generateCategoryTotals = (transactions) => {
    const totals = {};
    transactions.forEach((txn) => {
      const category = categorizeTransaction(txn.note);
      totals[category] = (totals[category] || 0) + txn.amount;
    });
    return totals;
  };

  // Generate insights with 5 good and 5 bad points
  const generateInsights = (transactions) => {
    if (transactions.length === 0) {
      return [];
    }

    const uniqueMonths = new Set(
      transactions.map((txn) => txn.date.slice(0, 7))
    );
    const numMonths = uniqueMonths.size || 1;
    const totalSpending = transactions.reduce(
      (sum, txn) => sum + txn.amount,
      0
    );
    const monthlyAverage = totalSpending / numMonths;

    const insightsData = [];

    // Good Habits (Green)
    insightsData.push({
      text: `\n- **Consistent Spending**: Your total spending averages ₹${monthlyAverage.toFixed(
        2
      )} per month, showing a stable pattern.`,
      color: "green",
    });
    insightsData.push({
      text: `- **Essential Spending**: You prioritize essentials like groceries (₹${
        categoryTotals["Grocery"] || 0
      }) and rent (₹${categoryTotals["Rent"] || 0}).`,
      color: "green",
    });
    insightsData.push({
      text: `- **Low Entertainment**: Entertainment is only ${
        ((categoryTotals["Entertainment"] || 0) / totalSpending) * 100
      }% of your spending (₹${categoryTotals["Entertainment"] || 0}).`,
      color: "green",
    });
    insightsData.push({
      text: `- **Diversified Categories**: You’ve spent across ${
        Object.keys(categoryTotals).length
      } categories, indicating varied usage of funds.`,
      color: "green",
    });
    insightsData.push({
      text: `- **Potential Savings**: Miscellaneous spending is low (${
        ((categoryTotals["Misc"] || 0) / totalSpending) * 100
      }% of total).`,
      color: "green",
    });

    // Bad Habits (Red)
    insightsData.push({
      text: `\n- **High Fixed Costs**: Rent takes up ${
        ((categoryTotals["Rent"] || 0) / totalSpending) * 100
      }% of your spending (₹${categoryTotals["Rent"] || 0}).`,
      color: "red",
    });
    insightsData.push({
      text: `- **Untracked Spending**: Miscellaneous spending totals ₹${
        categoryTotals["Misc"] || 0
      }, which indicates untracked expenses.`,
      color: "red",
    });
    insightsData.push({
      text: `- **No Investments**: No investment-related transactions detected. Consider allocating funds towards investments.`,
      color: "red",
    });
    insightsData.push({
      text: `- **Potential Overspending**: Your monthly average (₹${monthlyAverage.toFixed(
        2
      )}) is high, suggesting potential overspending.`,
      color: "red",
    });
    insightsData.push({
      text: `- **Medical Costs**: Medical expenses could indicate recurring costs. Keep an eye on this category.`,
      color: "red",
    });

    // Tips (Orange)
    insightsData.push({
      text: `\n- **Tip**: Track your expenses regularly to identify unnecessary spending.`,
      color: "orange",
    });
    insightsData.push({
      text: `- **Tip**: Set aside a portion of your monthly income for investments.`,
      color: "orange",
    });
    insightsData.push({
      text: `- **Tip**: Consider reducing entertainment and dining out expenses to optimize savings.`,
      color: "orange",
    });
    insightsData.push({
      text: `- **Tip**: Review your rent and housing-related spending for any possible savings opportunities.`,
      color: "orange",
    });
    insightsData.push({
      text: `- **Tip**: Keep track of medical expenses and consider insurance or health savings plans.`,
      color: "orange",
    });

    return insightsData;
  };

  // Custom render for colored insights
  const renderInsight = (insight) => {
    return (
      <div
        key={insight.text}
        style={{ color: insight.color, marginBottom: "10px" }}
      >
        <ReactMarkdown>{insight.text}</ReactMarkdown>
      </div>
    );
  };

  // Render table with categories and spending in card-like design
  const renderCategoryTable = () => {
    return (
      <div
        style={{
          marginTop: "20px",
          padding: "20px",
          backgroundColor: "#fff",
          borderRadius: "8px",
          boxShadow: "0 4px 8px rgba(0, 0, 0, 0.1)",
        }}
      >
        <h3 style={{ fontSize: "1.5rem", marginBottom: "15px" }}>
          Spending per Category
        </h3>
        <table
          border="1"
          cellPadding="10"
          style={{
            width: "100%",
            textAlign: "left",
            borderCollapse: "collapse",
          }}
        >
          <thead>
            <tr>
              <th>Category</th>
              <th>Spending (₹)</th>
            </tr>
          </thead>
          <tbody>
            {Object.keys(categoryTotals).map((category) => (
              <tr key={category}>
                <td>{category}</td>
                <td>{categoryTotals[category].toFixed(2)}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    );
  };

  return (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        padding: "20px",
      }}
    >
      <h2
        style={{ fontSize: "2rem", fontWeight: "bold", marginBottom: "20px" }}
      >
        Transaction Insights
      </h2>
      {loading && <p>Loading insights...</p>}
      {error && <p style={{ color: "red" }}>{error}</p>}

      {/* Display table with spending per category in card */}
      {renderCategoryTable()}

      <div
        style={{
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          marginTop: "20px",
          padding: "20px",
          backgroundColor: "#f9f9f9",
          borderRadius: "8px",
          boxShadow: "0 4px 8px rgba(0, 0, 0, 0.1)",
        }}
      >
        <div
          style={{
            marginBottom: "30px",
            padding: "20px",
            backgroundColor: "#fff",
            borderRadius: "8px",
            boxShadow: "0 4px 8px rgba(0, 0, 0, 0.1)",
          }}
        >
          <h3 style={{ fontSize: "1.8rem", marginBottom: "15px" }}>
            Good Habits
          </h3>
          {insights
            .filter((insight) => insight.color === "green")
            .map(renderInsight)}
        </div>

        {/* Center Tips for Improvement Section */}
        <div
          style={{
            marginBottom: "30px",
            padding: "20px",
            backgroundColor: "#fff",
            borderRadius: "8px",
            boxShadow: "0 4px 8px rgba(0, 0, 0, 0.1)",
            alignSelf: "center",
          }}
        >
          <h3 style={{ fontSize: "1.8rem", marginBottom: "15px" }}>
            Tips for Improvement
          </h3>
          {insights
            .filter((insight) => insight.color === "orange")
            .map(renderInsight)}
        </div>

        <div
          style={{
            marginBottom: "30px",
            padding: "20px",
            backgroundColor: "#fff",
            borderRadius: "8px",
            boxShadow: "0 4px 8px rgba(0, 0, 0, 0.1)",
          }}
        >
          <h3 style={{ fontSize: "1.8rem", marginBottom: "15px" }}>
            Bad Habits
          </h3>
          {insights
            .filter((insight) => insight.color === "red")
            .map(renderInsight)}
        </div>
      </div>
    </div>
  );
};

export default Insights;
