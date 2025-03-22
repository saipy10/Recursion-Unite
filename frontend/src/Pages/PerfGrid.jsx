import React, { useState } from "react";
import {
  GridComponent,
  ColumnsDirective,
  ColumnDirective,
  Page,
  Sort,
  Filter,
  Edit,
  Inject,
  Toolbar,
  Selection,
} from "@syncfusion/ej2-react-grids";
import { productsPerformance } from "../data/dummy";
import { Header } from "../Components";
import { useStateContext } from "../Context/ContextProvider";
import "./PerfGridStyles.css";


const PerfGrid = () => {
  const [data, setData] = useState(productsPerformance);
  const { currentColor } = useStateContext();

  // Handle deletion of a product
  const handleDelete = (args) => {
    const idToDelete = args.data[0].title; // Use "title" as the identifier
    setData(data.filter((item) => item.title !== idToDelete));
  };

  // Function to download the grid data as CSV
  const downloadCSV = () => {
    const csvContent = [
      ["Product Name", "Description", "Rating", "Items Sold", "Earning Amount"],
      ...data.map((row) => [
        row.title,
        row.desc,
        row.rating,
        row.itemSold,
        row.earningAmount,
      ]),
    ]
      .map((e) => e.join(","))
      .join("\n");

    const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);

    const link = document.createElement("a");
    link.href = url;
    link.setAttribute("download", "performance_report.csv");
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="m-2 md:m-10 p-2 md:p-10 bg-white rounded-3xl shadow-lg">
      <div className="flex justify-between items-center mb-4">
        <Header category="Page" title="Product Performance" />
        <button
          onClick={downloadCSV}
          style={{
            backgroundColor: currentColor,
            color: "white",
            padding: "10px 20px",
            borderRadius: "5px",
            cursor: "pointer",
            border: "none",
          }}
          onMouseOver={(e) =>
            (e.target.style.backgroundColor = `${currentColor}CC`)
          }
          onMouseOut={(e) => (e.target.style.backgroundColor = currentColor)}
        >
          Performance Report
        </button>
      </div>
      <GridComponent
        id="perfGrid"
        dataSource={data}
        allowPaging
        allowSorting
        allowSelection
        toolbar={["Delete"]}
        editSettings={{ allowDeleting: true, mode: "Normal" }}
        actionComplete={(args) => {
          if (args.requestType === "delete") {
            handleDelete(args);
          }
        }}
        selectionSettings={{ type: "Multiple", mode: "Row" }}
        rowSelected={() => {
          document.body.style.cursor = "pointer"; // Change cursor to hand
        }}
        rowDeselected={() => {
          document.body.style.cursor = "default"; // Reset cursor
        }}
      >
        <ColumnsDirective>
          <ColumnDirective field="title" headerText="Product Name" width="150" isPrimaryKey />
          <ColumnDirective field="desc" headerText="Description" width="200" />
          <ColumnDirective field="rating" headerText="Rating" width="100" />
          <ColumnDirective field="itemSold" headerText="Items Sold" width="100" />
          <ColumnDirective
            field="earningAmount"
            headerText="Earning Amount"
            width="150"
            textAlign="Right"
          />
        </ColumnsDirective>
        <Inject services={[Page, Sort, Filter, Edit, Toolbar, Selection]} />
      </GridComponent>
    </div>
  );
};

export default PerfGrid;
