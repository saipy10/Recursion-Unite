import React from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { FiSettings } from "react-icons/fi";
import { TooltipComponent } from "@syncfusion/ej2-react-popups";
import "./App.css";
import { useStateContext } from "./Context/ContextProvider";
import { Navbar, Footer, Sidebar, ThemeSettings } from "./Components";
import {
  Ecommerce,
  Employees,
  Editor,
  Customers,
  ColorPicker,
  Calendar,
  Area,
  Bar,
  ColorMapping,
  Financial,
  Line,
  Pie,
  Pyramid,
  Insights,
  UserManagementPage,
  RoleManagementPage,
  InventoryPage,
  Stacked,
  Transactions,
  // ShoppingPage,      
} from "./Pages";
import VoucherPage from "./Components/Navbar";
import BudgetRecommendation from "./Pages/Budget_Recommendation";
import Login from "./Components/Register";

const App = () => {
  const {
    activeMenu,
    themeSettings,
    setThemeSettings,
    currentColor,
    currentMode,
  } = useStateContext();

  return (
    <div className={currentMode === "Dark" ? "dark" : ""}>
       <BrowserRouter>
        <div className="flex relative dark:bg-main-dark-bg">
          {/* Settings Button */}
          <div className="fixed right-4 bottom-4" style={{ zIndex: "1000" }}>
            <TooltipComponent content="Settings" position="Top">
              <button
                className="text-3xl p-3 hover:drop-shadow-xl hover:bg-light-gray text-white"
                onClick={() => setThemeSettings(true)}
                style={{ background: currentColor, borderRadius: "50%" }}
              >
                <FiSettings />
              </button>
            </TooltipComponent>
          </div>

          {/* Sidebar */}
          {activeMenu ? (
            <div className="w-72 fixed sidebar dark:bg-secondary-dark-bg bg-white">
              <Sidebar />
            </div>
          ) : (
            <div className="w-0 dark:bg-secondary-dark-bg">
              <Sidebar />
            </div>
          )}

          {/* Main Content */}
          <div
            className={`dark:bg-main-dark-bg bg-main-bg min-h-screen w-full ${
              activeMenu ? "md:ml-72" : "flex-2"
            }`}
          >
            <div className="fixed md:static bg-main-bg dark:bg-main-dark-bg navbar w-full">
              <Navbar />
            </div>

            {/* Theme Settings */}
            {themeSettings && <ThemeSettings />}

            {/* Routes */}
            <Routes>
              {/* Dashboard */}
              <Route path="/" element={<Ecommerce />} />
              <Route path="/dashboard" element={<Ecommerce />} />

              {/* Pages */}
              <Route path="/real-time-analysis" element={<Employees />} />
              <Route path="/transactions" element={<Transactions />} />
              <Route path="/insights" element={<Insights />} />
              <Route path="/budget-recommendation" element={<BudgetRecommendation/>} /> {/* ✅ Changed "/Inventory" to "/inventory" */}
              <Route path="/login" element={<Login />} />
              <Route path="/role_management" element={<RoleManagementPage />} />
              {/* <Route path="/shopping" element={<ShoppingPage />} /> ✅ Import fixed */}
              <Route path="/voucher" element={<VoucherPage />} />
      
              <Route path="/editor" element={<Editor />} />
              <Route path="/calendar" element={<Calendar />} />
              <Route path="/color-picker" element={<ColorPicker />} />

              {/* Charts */}
              <Route path="/line" element={<Line />} />
              <Route path="/area" element={<Area />} />
              <Route path="/bar" element={<Bar />} />
              <Route path="/pie" element={<Pie />} />
              <Route path="/financial" element={<Financial />} />
              <Route path="/color-mapping" element={<ColorMapping />} />
              <Route path="/pyramid" element={<Pyramid />} />
              <Route path="/stacked" element={<Stacked />} />
            </Routes>
          </div>
        </div>
      </BrowserRouter>

    </div>
  );
};

export default App;