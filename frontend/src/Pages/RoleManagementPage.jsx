import React, { useState } from "react";
import { rolesData } from "../data/dummy";
import { useStateContext } from "../Context/ContextProvider";

import {
  FaUserShield,
  FaUserEdit,
  FaUserTie,
  FaHeadset,
  FaPen,
  FaGavel,
  FaEye,
  FaNewspaper,
  FaUsers,
  FaPhoneAlt,
  FaUserClock,
  FaBuilding,
  FaTasks,
  FaKeyboard,
  FaCubes,
  FaChartLine,
} from "react-icons/fa";

const iconsMap = {
  Admin: <FaUserShield />,
  Editor: <FaUserEdit />,
  Manager: <FaUserTie />,
  Support: <FaHeadset />,
  Contributor: <FaPen />,
  Moderator: <FaGavel />,
  Viewer: <FaEye />,
  "Editor-in-Chief": <FaNewspaper />,
  "Admin Assistant": <FaUsers />,
  "Customer Service": <FaPhoneAlt />,
  Guest: <FaUserClock />,
  "HR Manager": <FaBuilding />,
  "Team Lead": <FaTasks />,
  "Content Writer": <FaKeyboard />,
  "Product Manager": <FaCubes />,
  "Financial Analyst": <FaChartLine />,
};

const roleCardColors = {
  Admin: "#FFE5E5",
  Editor: "#FFE7CC",
  Manager: "#CCFFEB",
  Support: "#D6EFFF",
  Contributor: "#FFD9D4",
  Moderator: "#DFFFFF",
  Viewer: "#DEE7FF",
  "Editor-in-Chief": "#F4E4F9",
  "Admin Assistant": "#FFE4ED",
  "Customer Service": "#FFF9D9",
  Guest: "#E8FFD9",
  "HR Manager": "#FFF0D9",
  "Team Lead": "#D9FFEB",
  "Content Writer": "#FFE5DD",
  "Product Manager": "#E6F0FF",
  "Financial Analyst": "#F3E6FF",
};

const App = () => {
    const { currentColor } = useStateContext();
  const [roles, setRoles] = useState(rolesData);
  const [editingRoleId, setEditingRoleId] = useState(null);
  const [addingRole, setAddingRole] = useState(false);
  const [newRole, setNewRole] = useState({
    RoleID: "",
    RoleName: "",
    Permissions: "",
  });

  const permissionsOptions = [
    "Read",
    "Write",
    "Delete",
    "Manage Users",
    "Edit",
    "Respond to Tickets",
    "Assign Roles",
    "Add Users",
    "Access Reports",
    "Edit Projects",
    "Manage Employees",
    "Ban Users",
  ];

  const handleEditPermissions = (roleId, newPermissions) => {
    setRoles((prevRoles) =>
      prevRoles.map((role) =>
        role.RoleID === roleId
          ? { ...role, Permissions: newPermissions.join(", ") }
          : role
      )
    );
    setEditingRoleId(null);
  };

  const handleDeleteRole = (roleId) => {
    setRoles((prevRoles) => prevRoles.filter((role) => role.RoleID !== roleId));
  };

//   const handleAddNewRole = () => {
//     setRoles((prevRoles) => [
//       ...prevRoles,
//       { ...newRole, Permissions: newRole.Permissions.split(", ") },
//     ]);
//     setAddingRole(false);
//     setNewRole({ RoleID: "", RoleName: "", Permissions: "" });
//   };
  const handleAddNewRole = () => {
    setRoles((prevRoles) => [
      ...prevRoles,
      { ...newRole, Permissions: selectedPermissions.join(", ") },
    ]);
    setAddingRole(false);
    setNewRole({ RoleID: "", RoleName: "", Permissions: "" });
    setSelectedPermissions([]); // Reset selected permissions
  };
  
  const [selectedPermissions, setSelectedPermissions] = useState([]);
  
  const handlePermissionChange = (event) => {
    const { options } = event.target;
    const selected = Array.from(options)
      .filter((option) => option.selected)
      .map((option) => option.value);
    setSelectedPermissions(selected);
  };
  const renderButton = (text, onClick, currentColor, textColor) => (
    <button
      onClick={onClick}
      style={{
        backgroundColor: currentColor,
        color: textColor,
        border: "none",
        borderRadius: "20px",
        padding: "8px 16px",
        fontSize: "14px",
        fontWeight: "bold",
        cursor: "pointer",
        boxShadow: "0 2px 4px rgba(0, 0, 0, 0.2)",
      }}
    >
      {text}
    </button>
  );

  return (
    <div style={{ padding: "20px" }}>
      <h2>Role Management</h2>
      <div style={{ marginBottom: "20px" }}>
        {renderButton(
          "Add New Role",
          () => setAddingRole(true),
          "#28A745",
          "white"
        )}
      </div>
      {addingRole && (
  <div
    style={{
      marginBottom: "20px",
      padding: "10px",
      backgroundColor: currentColor,
      borderRadius: "8px",
      border: "1px solid #ccc",
    }}
  >
    <h4>Add New Role</h4>
    <div style={{ display: "flex", flexDirection: "column", gap: "10px" }}>
      <input
        type="text"
        placeholder="Role ID"
        value={newRole.RoleID}
        onChange={(e) => setNewRole({ ...newRole, RoleID: e.target.value })}
        style={{
          padding: "5px",
          borderRadius: "4px",
          border: "1px solid #ccc",
        }}
      />
      <input
        type="text"
        placeholder="Role Name"
        value={newRole.RoleName}
        onChange={(e) => setNewRole({ ...newRole, RoleName: e.target.value })}
        style={{
          padding: "5px",
          borderRadius: "4px",
          border: "1px solid #ccc",
        }}
      />
      <select
        multiple
        value={selectedPermissions}
        onChange={handlePermissionChange}
        style={{
          width: "100%",
          height: "100px",
          padding: "5px",
          border: "1px solid #ccc",
          borderRadius: "4px",
        }}
      >
        {permissionsOptions.map((option) => (
          <option key={option} value={option}>
            {option}
          </option>
        ))}
      </select>
      <div style={{ display: "flex", gap: "10px" }}>
        {renderButton("Save", handleAddNewRole, "#007BFF", "white")}
        {renderButton(
          "Cancel",
          () => {
            setAddingRole(false);
            setSelectedPermissions([]); // Reset permissions if canceled
          },
          "#DC3545",
          "white"
        )}
      </div>
    </div>
  </div>
)}
      <div style={{ display: "flex", flexWrap: "wrap", gap: "20px" }}>
        {roles.map((role) => (
          <div
            key={role.RoleID}
            style={{
              backgroundColor: roleCardColors[role.RoleName] || "#FFFFFF",
              border: "1px solid #ccc",
              padding: "10px",
              borderRadius: "8px",
              width: "250px",
              boxShadow: "0 2px 5px rgba(0, 0, 0, 0.1)",
            }}
          >
            {editingRoleId === role.RoleID ? (
              <EditPermissionsCard
                role={role}
                allOptions={permissionsOptions}
                onSave={(selectedPermissions) =>
                  handleEditPermissions(role.RoleID, selectedPermissions)
                }
                onCancel={() => setEditingRoleId(null)}
              />
            ) : (
              <>
                <div
                  style={{
                    display: "flex",
                    alignItems: "center",
                    gap: "10px",
                  }}
                >
                  <span style={{ fontSize: "24px" }}>
                    {iconsMap[role.RoleName] || <FaUserShield />}
                  </span>
                  <h3>{role.RoleName}</h3>
                </div>
                <p>
                  <strong>Permissions:</strong> {role.Permissions}
                </p>
                <div style={{ display: "flex", gap: "10px" }}>
                  {renderButton(
                    "Change Permissions",
                    () => setEditingRoleId(role.RoleID),
                    "#FFC107",
                    "black"
                  )}
                  {renderButton(
                    "Delete",
                    () => handleDeleteRole(role.RoleID),
                    "#DC3545",
                    "white"
                  )}
                </div>
              </>
            )}
          </div>
        ))}
      </div>
    </div>
  );
};

const EditPermissionsCard = ({ role, allOptions, onSave, onCancel }) => {
  const [selectedPermissions, setSelectedPermissions] = useState(
    role.Permissions.split(", ")
  );

  const handleSelectChange = (event) => {
    const { options } = event.target;
    const selected = Array.from(options)
      .filter((option) => option.selected)
      .map((option) => option.value);
    setSelectedPermissions(selected);
  };

  return (
    <div>
      <h4>Edit Permissions for {role.RoleName}</h4>
      <select
        multiple
        value={selectedPermissions}
        onChange={handleSelectChange}
        style={{
          width: "100%",
          height: "100px",
          marginBottom: "10px",
          padding: "5px",
        }}
      >
        {allOptions.map((option) => (
          <option key={option} value={option}>
            {option}
          </option>
        ))}
      </select>
      <div style={{ display: "flex", justifyContent: "space-between" }}>
        <button
          onClick={() => onSave(selectedPermissions)}
          style={{
            backgroundColor: "#007BFF",
            color: "white",
            border: "none",
            borderRadius: "20px",
            padding: "8px 16px",
            fontWeight: "bold",
            cursor: "pointer",
          }}
        >
          Save
        </button>
        <button
          onClick={onCancel}
          style={{
            backgroundColor: "#DC3545",
            color: "white",
            border: "none",
            borderRadius: "20px",
            padding: "8px 16px",
            fontWeight: "bold",
            cursor: "pointer",
          }}
        >
          Cancel
        </button>
      </div>
    </div>
  );
};

export default App;
