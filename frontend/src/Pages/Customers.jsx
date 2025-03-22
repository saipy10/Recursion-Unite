import React from "react";
import {
  GridComponent,
  ColumnsDirective,
  ColumnDirective,
  Sort,
  ContextMenu,
  Filter,
  Page,
  Toolbar,
  Selection,
  Edit,
  Inject,
} from "@syncfusion/ej2-react-grids";
import { customersData, customersGrid } from "../data/dummy";
import { Header } from "../Components";

const Customers = () => {
  return (
    <div className="m-2 md:m-10 p-2 md:p-10 bg-white rounded-3xl">
      <Header category="Page" title="Customers" />
      <GridComponent
        id="gridcomp"
        dataSource={customersData}
        allowPaging
        allowSorting
        toolbar={["Delete"]}
        editSettings={{ allowDeleting: true, allowEditing: true }}
        width="auto"
      >
        <ColumnsDirective>
          {customersGrid.map((item, index) => (
            <ColumnDirective key={index} {...item} />
          ))}
        </ColumnsDirective>
        <Inject services={[Sort, Selection, Filter, Page, Edit, Toolbar]} />
      </GridComponent>
    </div>
  );
};

export default Customers;
