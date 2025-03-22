import React, { useState, useEffect, useRef } from "react";
import ReactMarkdown from "react-markdown";

interface Transaction {
  date: string;
  amount: number;
  note: string;
}

interface Message {
  role: string;
  text: string;
}

const BudgetRecommendation: React.FC = () => {
  const [messages, setMessages] = useState<Message[]>([]);
  const [inputMoney, setInputMoney] = useState<string>("");
  const [availableMoney, setAvailableMoney] = useState<number | null>(null);
  const [loading, setLoading] = useState<boolean>(false);
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const chatEndRef = useRef<HTMLDivElement>(null);

  const BASE_URL = "https://paypal-backend-gq9q.onrender.com";

  // Fetch transaction data on mount
  useEffect(() => {
    const fetchTransactions = async () => {
      const token = localStorage.getItem("token");
      if (!token) {
        setMessages([{ role: "assistant", text: "User not authenticated. Please log in." }]);
        return;
      }

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
        const transactionList = (data.transactions || data).map((txn: any) => ({
          date: new Date(txn.createdAt).toISOString().split("T")[0],
          amount: txn.amount,
          note: txn.note || "N/A",
        }));
        setTransactions(transactionList);
        setMessages([
          {
            role: "assistant",
            text: "Transactions loaded successfully. Please enter the amount of money you have available to get a spending forecast and budget recommendation.",
          },
        ]);
      } catch (err) {
        setMessages([{ role: "assistant", text: `Error fetching transactions: ${err.message}` }]);
      }
    };

    fetchTransactions();
  }, []);

  // Scroll to the bottom of the chat when messages update
  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  // Categorize transactions and calculate averages
  const categorizeTransaction = (note: string): string => {
    if (!note || note.trim() === "" || note === "N/A") return "Misc";
    const lowerNote = note.toLowerCase();
    if (lowerNote.includes("entertainment") || lowerNote.includes("movie") || lowerNote.includes("concert")) return "Entertainment";
    if (lowerNote.includes("grocery") || lowerNote.includes("food") || lowerNote.includes("supermarket")) return "Grocery";
    if (lowerNote.includes("medical") || lowerNote.includes("doctor") || lowerNote.includes("hospital")) return "Medical";
    if (lowerNote.includes("stokes") || lowerNote.includes("stock") || lowerNote.includes("investment")) return "Stokes";
    if (lowerNote.includes("rent") || lowerNote.includes("house") || lowerNote.includes("apartment")) return "Rent";
    return "Misc";
  };

  const generateForecastAndRecommendations = (money: number) => {
    if (transactions.length === 0) {
      return "No transaction data available to generate a forecast.";
    }

    const categoryTotals: { [key: string]: number } = {};
    const monthlyCounts: { [key: string]: number } = {};
    const uniqueMonths = new Set(transactions.map((txn) => txn.date.slice(0, 7)));
    const numMonths = uniqueMonths.size || 1;

    transactions.forEach((txn) => {
      const category = categorizeTransaction(txn.note);
      categoryTotals[category] = (categoryTotals[category] || 0) + txn.amount;
      monthlyCounts[category] = monthlyCounts[category] || 0;
    });

    const monthlyAverages: { [key: string]: number } = {};
    for (const category in categoryTotals) {
      monthlyAverages[category] = categoryTotals[category] / numMonths;
    }

    const totalMonthlyAverage = Object.values(monthlyAverages).reduce((sum, avg) => sum + avg, 0);

    let forecastText = "## Spending Forecast and Budget Recommendations\n\n";
    forecastText += `Based on your past ${numMonths} month(s) of transactions, here’s your monthly spending forecast and budget allocation for ₹${money.toFixed(2)}:\n\n`;

    forecastText += "### Monthly Spending Forecast\n";
    for (const category in monthlyAverages) {
      forecastText += `- **${category}**: ₹${monthlyAverages[category].toFixed(2)}\n`;
    }
    forecastText += `- **Total Monthly Average**: ₹${totalMonthlyAverage.toFixed(2)}\n\n`;

    forecastText += "### Budget Recommendations\n";
    if (totalMonthlyAverage > money) {
      forecastText += `**Warning**: Your average monthly spending (₹${totalMonthlyAverage.toFixed(2)}) exceeds your available money (₹${money.toFixed(2)}). Consider reducing expenses in the following areas:\n`;
      const reductionFactor = money / totalMonthlyAverage;
      for (const category in monthlyAverages) {
        const recommended = monthlyAverages[category] * reductionFactor;
        forecastText += `- **${category}**: Reduce from ₹${monthlyAverages[category].toFixed(2)} to ₹${recommended.toFixed(2)}\n`;
      }
    } else {
      forecastText += `**Good News**: Your available money (₹${money.toFixed(2)}) covers your average monthly spending (₹${totalMonthlyAverage.toFixed(2)}). Here’s a suggested allocation:\n`;
      const savings = money - totalMonthlyAverage;
      for (const category in monthlyAverages) {
        forecastText += `- **${category}**: ₹${monthlyAverages[category].toFixed(2)}\n`;
      }
      forecastText += `- **Savings/Investment**: ₹${savings.toFixed(2)}\n`;
      forecastText += "\n**Tip**: Consider investing the surplus in Stokes or savings for future financial security.";
    }

    return forecastText;
  };

  const handleSubmitMoney = () => {
    if (!inputMoney.trim() || isNaN(Number(inputMoney)) || Number(inputMoney) <= 0) {
      setMessages((prev) => [
        ...prev,
        { role: "assistant", text: "Please enter a valid amount of money." },
      ]);
      return;
    }

    setLoading(true);
    const money = Number(inputMoney);
    setAvailableMoney(money);
    const userMessage: Message = { role: "user", text: `I have ₹${money}` };
    const botMessage: Message = {
      role: "assistant",
      text: generateForecastAndRecommendations(money),
    };

    setMessages((prevMessages) => [...prevMessages, userMessage, botMessage]);
    setInputMoney("");
    setLoading(false);
  };

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text).then(() => {
      alert("Text copied to clipboard!");
    });
  };

  return (
    <div
      style={{
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        minHeight: "100vh", // Center vertically on the page
        backgroundColor: "#f0f0f0", // Light background for the page
      }}
    >
      <div
        style={{
          display: "flex",
          flexDirection: "column",
          width: "450px",
          height: "500px",
          backgroundColor: "#ffffff", // White container
          overflow: "hidden",
          boxShadow: "0px 4px 10px rgba(0, 0, 0, 0.2)",
          borderRadius: "10px",
        }}
      >
        <div
          style={{
            flex: 1,
            overflowY: "auto",
            padding: "15px",
            backgroundColor: "#f9f9f9", // Slightly off-white chat area
          }}
        >
          {messages.map((msg, index) => (
            <div
              key={index}
              style={{
                display: "flex",
                justifyContent: msg.role === "user" ? "flex-end" : "flex-start",
                marginBottom: "10px",
              }}
            >
              <div
                style={{
                  padding: "12px 15px",
                  borderRadius: "20px",
                  maxWidth: "70%",
                  wordWrap: "break-word",
                  overflowWrap: "break-word",
                  backgroundColor: msg.role === "user" ? "#007bff" : "#ffffff",
                  color: msg.role === "user" ? "white" : "black",
                  boxShadow: msg.role === "assistant" ? "0px 2px 5px rgba(0, 0, 0, 0.1)" : "none",
                }}
              >
                <ReactMarkdown
                  components={{
                    code({ children, ...props }) {
                      return (
                        <pre
                          style={{
                            whiteSpace: "pre-wrap",
                            wordBreak: "break-word",
                            overflowX: "auto",
                            backgroundColor: "#f0f0f0",
                            color: "#333",
                            padding: "8px",
                            borderRadius: "5px",
                            maxWidth: "100%",
                          }}
                        >
                          <code
                            {...props}
                            style={{ cursor: "pointer", display: "block" }}
                            onClick={() => copyToClipboard(String(children))}
                          >
                            {children}
                          </code>
                        </pre>
                      );
                    },
                  }}
                >
                  {msg.text}
                </ReactMarkdown>
              </div>
            </div>
          ))}
          <div ref={chatEndRef} />
        </div>

        <div
          style={{
            display: "flex",
            padding: "10px",
            borderTop: "1px solid #ddd",
            backgroundColor: "#ffffff",
          }}
        >
          <input
            type="text"
            value={inputMoney}
            onChange={(e) => setInputMoney(e.target.value)}
            onKeyUp={(e) => e.key === "Enter" && handleSubmitMoney()}
            style={{
              flex: 1,
              padding: "12px",
              border: "1px solid #ccc",
              borderRadius: "20px",
              fontSize: "16px",
              outline: "none",
              backgroundColor: "#ffffff",
              color: "#333",
            }}
            placeholder="Enter your available money (₹)..."
          />
          <button
            onClick={handleSubmitMoney}
            style={{
              marginLeft: "10px",
              padding: "8px 10px",
              fontSize: "16px",
              cursor: "pointer",
              color: "#333",
              border: "none",
              borderRadius: "50px",
              backgroundColor: "transparent",
            }}
            disabled={loading}
          >
            {loading ? (
              "..."
            ) : (
              <img
                width="25"
                height="25"
                src="https://img.icons8.com/ios-filled/50/000000/paper-plane.png"
                alt="send"
              />
            )}
          </button>
        </div>
      </div>
    </div>
  );
};

export default BudgetRecommendation;