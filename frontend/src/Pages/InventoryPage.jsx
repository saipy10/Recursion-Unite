import "./Inventorystyle.css"
import React, { useState, useEffect } from "react";
import {
  GridComponent,
  ColumnsDirective,
  ColumnDirective,
  Page,
  Sort,
  Filter,
  Edit,
  Inject,
} from "@syncfusion/ej2-react-grids";
import { ordersData } from "../data/dummy";  // Make sure to import your ordersData
import { Header } from "../Components"; // Assuming Header component is there

const InventoryPage = () => {
  const [data, setData] = useState([]);

  // Shuffle the data randomly using Fisher-Yates algorithm
  const shuffleData = (array) => {
    let shuffledArray = [...array];
    for (let i = shuffledArray.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [shuffledArray[i], shuffledArray[j]] = [shuffledArray[j], shuffledArray[i]];
    }
    return shuffledArray;
  };

  useEffect(() => {
    setData(shuffleData(ordersData));  // Set shuffled data when component mounts
  }, []);

  // Handle deletion of a product
  const handleDelete = (args) => {
    const idToDelete = args.rowData.OrderID; // Using OrderID to identify the record
    setData(data.filter((item) => item.OrderID !== idToDelete));
  };

  return (
    <div className="m-2 md:m-10 p-2 md:p-10 bg-white rounded-3xl">
      <Header category="Page" title="Product Inventory" />
      <GridComponent
        id="inventoryGrid"
        dataSource={data}
        allowPaging
        allowSorting
        editSettings={{ allowDeleting: true }}  // Keep this for the delete functionality in the grid
        actionBegin={(args) => {
          if (args.requestType === "delete") {
            handleDelete(args);
          }
        }}
      >
        <ColumnsDirective>
          <ColumnDirective
            field="ProductImage"
            headerText="Product Image"
            width="150"
            template={(props) => (
              <img
                src={props.ProductImage}
                alt={props.OrderItems}
                className="w-20 h-20 object-cover"
              />
            )}
          />
          <ColumnDirective field="OrderItems" headerText="Product Name" width="180" />
          <ColumnDirective field="TotalAmount" headerText="Money" width="120" format="C2" />
          <ColumnDirective field="Location" headerText="Location" width="150" />
          <ColumnDirective
            field="delete"
            headerText="Delete"
            width="100"
            template={(props) => (
              <button
                className="delete-btn"
                onClick={() => handleDelete({ rowData: props })}
              >
                Delete
              </button>
            )}
          />
        </ColumnsDirective>
        <Inject services={[Page, Sort, Filter, Edit]} />
      </GridComponent>
    </div>
  );
};

export default InventoryPage;
