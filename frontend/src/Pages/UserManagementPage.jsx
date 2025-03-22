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
} from "@syncfusion/ej2-react-grids";
import { usersData } from "../data/dummy";
import { Header } from "../Components";
import { useStateContext } from "../Context/ContextProvider"; // Assuming this is where the context is defined

const UserManagementPage = () => {
  const [users, setUsers] = useState(usersData);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [formData, setFormData] = useState({
    UserID: "",
    UserName: "",
    Email: "",
    Role: "",
    Status: "Active",
  });
  const { currentColor } = useStateContext();

  const roles = ["Admin", "User", "Manager"]; // Define roles here
  const handleDelete = (args) => {
    const idToDelete = args.rowData.UserID; // Get the ID of the user to delete
    setUsers(users.filter((user) => user.UserID !== idToDelete)); // Filter out the user
  };


  const handleFormChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleAddUser = () => {
    setIsModalOpen(true);
    setFormData({
      UserID: "",
      UserName: "",
      Email: "",
      Role: "User",
      Status: "Active",
    });
  };

  const handleEditUser = (args) => {
    setIsModalOpen(true);
    setFormData(args.rowData);
  };

  const handleSubmit = () => {
    if (formData.UserID) {
      // Edit existing user
      setUsers(users.map((user) => (user.UserID === formData.UserID ? formData : user)));
    } else {
      // Add new user
      setUsers([...users, { ...formData, UserID: Date.now() }]);
    }
    setIsModalOpen(false);
  };

  return (
    <div className="m-2 md:m-10 p-2 md:p-10 bg-white rounded-3xl">
      <Header category="Page" title="User Management" />

      <GridComponent
        id="userGrid"
        dataSource={users}
        allowPaging
        allowSorting
        toolbar={["Add", "Delete"]}
        editSettings={{ allowEditing: true, allowAdding: true, allowDeleting: true }}
        actionBegin={(args) => {
          if (args.requestType === "delete") handleDelete(args);
          if (args.requestType === "add") handleAddUser();
          if (args.requestType === "beginEdit") handleEditUser(args);
        }}
      >
        <ColumnsDirective>
          <ColumnDirective field="UserName" headerText="User Name" width="150" />
          <ColumnDirective field="Email" headerText="Email" width="200" />
          <ColumnDirective field="Role" headerText="Role" width="150" />
          <ColumnDirective field="Status" headerText="Status" width="120" />
        </ColumnsDirective>
        <Inject services={[Page, Sort, Filter, Edit, Toolbar]} />
      </GridComponent>

      {isModalOpen && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
          <div className="bg-white p-8 rounded-lg w-96">
            <h2 className="text-xl font-bold mb-4">
              {formData.UserID ? "Edit User" : "Add User"}
            </h2>
            <form>
              <div className="mb-4">
                <label className="block mb-1 text-sm font-medium">User Name</label>
                <input
                  type="text"
                  name="UserName"
                  value={formData.UserName}
                  onChange={handleFormChange}
                  className="w-full border border-gray-300 rounded p-2"
                />
              </div>
              <div className="mb-4">
                <label className="block mb-1 text-sm font-medium">Email</label>
                <input
                  type="email"
                  name="Email"
                  value={formData.Email}
                  onChange={handleFormChange}
                  className="w-full border border-gray-300 rounded p-2"
                />
              </div>
              <div className="mb-4">
                <label className="block mb-1 text-sm font-medium">Role</label>
                <select
                  name="Role"
                  value={formData.Role}
                  onChange={handleFormChange}
                  className="w-full border border-gray-300 rounded p-2"
                >
                  {roles.map((role) => (
                    <option key={role} value={role} className="text-current">
                      {role}
                    </option>
                  ))}
                </select>
              </div>
              <div className="mb-4">
                <label className="block mb-1 text-sm font-medium">Status</label>
                <div className="flex items-center">
                  <button
                    type="button"
                    onClick={() =>
                      setFormData({ ...formData, Status: formData.Status === "Active" ? "Inactive" : "Active" })
                    }
                    className={`px-4 py-2 rounded ${
                      formData.Status === "Active"
                        ? `bg-green-500 text-white`
                        : `bg-red-500 text-white`
                    }`}
                    style={{
                      backgroundColor: formData.Status === "Active" ? currentColor : "",
                    }}
                  >
                    {formData.Status}
                  </button>
                </div>
              </div>
              <div className="flex justify-end">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="mr-2 px-4 py-2 bg-gray-200 rounded"
                >
                  Cancel
                </button>
                <button
                  type="button"
                  onClick={handleSubmit}
                  className="px-4 py-2 rounded"
                  style={{ backgroundColor: currentColor, color: "white" }}
                >
                  Save
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default UserManagementPage;
