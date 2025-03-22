import { BsCurrencyRupee } from "react-icons/bs";
import { GoDotFill } from "react-icons/go";
import { IoIosMore } from "react-icons/io";
import { DropDownListComponent } from "@syncfusion/ej2-react-dropdowns";
import { downloadCSV } from "../data/downloadCSV.jsx";

import { Stacked, Button, Sparkline, LineChart } from "../Components/index.jsx";
import {
  earningData,
  finTrackerSummary,
  recentTransactions,
  weeklyStats,
  dropdownData,
  SparklineAreaData,
  ecomPieChartData,
  giftCards,
} from "../data/dummy.jsx";
import { useStateContext } from "../Context/ContextProvider.jsx";
import welcomeBg from "../data/welcome-bg.svg";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const handleAddClick = () => {
  // Show toast notification
  toast.success("Your file is downloading...");

  // Call the downloadCSV function
  downloadCSV(recentTransactions, "transactions.csv");
};

const DropDown = ({ currentMode }) => (
  <div className="w-28 border-1 border-color px-2 py-1 rounded-md">
    <DropDownListComponent
      id="time"
      fields={{ text: "Time", value: "Id" }}
      style={{ border: "none", color: currentMode === "Dark" && "white" }}
      value="1"
      dataSource={dropdownData}
      popupHeight="220px"
      popupWidth="120px"
    />
  </div>
);

const Ecommerce = () => {
  const { currentColor, currentMode } = useStateContext();
  const displayedTransactions = recentTransactions.slice(0, 5);

  return (
    <div className="mt-5">
      <div className="flex flex-wrap justify-center gap-4">
        {/* First Section: Aligning all 5 boxes in one row */}
        <div
          className="relative bg-white dark:text-gray-200 dark:bg-secondary-dark-bg h-40 rounded-xl w-full lg:w-1/5 xl:w-1/5 2xl:w-1/5 p-4 pt-3 m-2 bg-no-repeat bg-cover bg-center"
          style={{ backgroundImage: `url(${welcomeBg})` }}
        >
          <div className="flex justify-between items-center">
            <div>
              <p className="font-bold text-gray-400">Current Expenses</p>
              <p className="text-xl">₹5,600</p>
            </div>
          </div>
          <div
            className="absolute top-4 right-4 flex items-center justify-center h-10 w-10 rounded-full"
            style={{ backgroundColor: currentColor }}
          >
            <BsCurrencyRupee className="text-white text-2xl" />
          </div>

          <div className="mt-4">
            <Button
              color="white"
              bgColor={currentColor}
              text="Download"
              onClick={handleAddClick}
              borderRadius="8px"
              size="sm"
            />
          </div>
        </div>

        {/* Earning data boxes */}
        {earningData.map((item) => (
          <div
            key={item.title}
            className="bg-white dark:text-gray-200 dark:bg-secondary-dark-bg h-40 rounded-xl w-full md:w-1/5 xl:w-1/5 2xl:w-1/5 p-4 pt-3 m-2"
          >
            <button
              type="button"
              style={{ color: item.iconColor, backgroundColor: item.iconBg }}
              className="text-xl opacity-90 rounded-full p-3 hover:drop-shadow-xl mt-3"
            >
              {item.icon}
            </button>
            <p className="mt-2">
              <span className="text-lg font-semibold">{item.amount}</span>
              <span className={`text-sm text-${item.pcColor} ml-2`}>
                {item.percentage}
              </span>
            </p>
            <p className="text-sm text-gray-400 mt-1">{item.title}</p>
          </div>
        ))}
      </div>

      {/* Other sections */}
      <div className="flex gap-10 flex-wrap justify-center">
        <div className="bg-white dark:text-gray-200 dark:bg-secondary-dark-bg m-3 rounded-2xl md:w-780 p-4">
          <div className="flex justify-between">
            <p className="font-semibold text-xl ml-3">Revenue Updates</p>
            <div className="flex items-center gap-4">
              <p className="flex items-center gap-2 text-gray-600 hover:drop-shadow-xl mr-3">
                <span>
                  <GoDotFill />
                </span>
                <span>Expense</span>
              </p>
              <p className="flex items-center gap-2 text-green-400 hover:drop-shadow-xl mr-3">
                <span>
                  <GoDotFill />
                </span>
                <span>Budget</span>
              </p>
            </div>
          </div>
          <div className="mt-10 flex gap-10 flex-wrap justify-center">
            <div className="border-r-1 border-color m-4 pr-10">
              <div>
                <p>
                  <span className="text-3xl font-semibold">₹8,000</span>
                  <span className="p-1.5 hover:drop-shadow-xl cursor-pointer rounded-full text-white bg-green-400 ml-3 text-xs">
                    10%
                  </span>
                </p>
                <p className="text-gray-500 mt-1">Budget</p>
              </div>

              <div className="mt-8">
                <p>
                  <span className="text-3xl font-semibold">₹6,500</span>
                </p>
                <p className="text-gray-500 mt-1">Expense</p>
              </div>

              <div className="mt-5">
                <Sparkline
                  currentColor={currentColor}
                  id="line-sparkline"
                  type="Line"
                  height="80px"
                  width="250px"
                  data={SparklineAreaData}
                  color={currentColor}
                />
              </div>

              <div className="mt-10">
                <Button
                  color="white"
                  bgColor={currentColor}
                  text="Download Report"
                  borderRadius="10px"
                />
              </div>
            </div>
            <div>
              <Stacked width="320px" height="360px" />
            </div>
          </div>
        </div>
      </div>

      {/* Gift Cards Section (re-added inside finTrackerSummary) */}
      <div className="flex gap-5 flex-wrap justify-center lg:justify-between lg:flex-nowrap ml-10 mr-10">
        <div className="bg-white dark:text-gray-200 dark:bg-secondary-dark-bg p-6 rounded-2xl w-full lg:w-1/2">
          <div className="flex justify-between items-center gap-2 mb-10">
            <p className="text-xl font-semibold">FinTrack Summary</p>
          </div>

          {/* Date */}
          <p className="text-xs font-semibold rounded-lg w-24 bg-orange-400 py-1 px-2 text-white mt-5 text-center">
            21 APR, 2025
          </p>

          {/* Summary Data */}
          <div className="grid grid-cols-2 gap-4 border-b border-gray-200 py-4">
            {finTrackerSummary.data.map((item) => (
              <div key={item.title} className="border-r border-gray-200 pr-4">
                <p className="text-xs text-gray-500">{item.title}</p>
                <p className="text-sm font-medium">{item.desc}</p>
              </div>
            ))}
          </div>

          {/* Recent Transactions */}
          <div className="border-b border-gray-200 py-4">
            <p className="text-md font-semibold mb-3">Recent Transactions</p>
            <div className="flex flex-wrap gap-3">
              {finTrackerSummary.recentTransactions.map((item) => (
                <p
                  key={item.name}
                  style={{ background: item.color }}
                  className="cursor-pointer hover:drop-shadow-xl text-white py-1 px-3 rounded-lg text-xs transition"
                >
                  {item.name}
                </p>
              ))}
            </div>
          </div>

          {/* Gift Card Section (inside FinTrack Summary) */}
          <div className="mt-5">
            <p className="text-md font-semibold mb-3">Gift Cards</p>
            <div className="flex flex-wrap gap-4">
              {giftCards.map((card) => (
                <div
                  key={card.id}
                  className="bg-gray-100 p-4 rounded-lg shadow-md hover:shadow-lg cursor-pointer w-40 transition transform hover:scale-105"
                >
                  <p className="text-sm font-semibold">{card.name}</p>
                  <p className="text-xs text-gray-500">{card.value}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Ecommerce;
