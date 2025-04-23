import React, { useEffect, useState } from "react";
import { FilterMatchMode } from "primereact/api";
import { DataTable } from "primereact/datatable";
import { Column } from "primereact/column";
import { InputText } from "primereact/inputtext";
import AddButton from "../../htmlelements/addButton";
import AddUser from "./addUser";
import M from "materialize-css";
import { useSelector } from "react-redux";

function AllUsers({}) {
  const users = useSelector((state) => state.users);

  const [filters, setFilters] = useState({
    global: { value: null, matchMode: FilterMatchMode.CONTAINS },
    first_name: { value: null, matchMode: FilterMatchMode.CONTAINS },
    last_name: { value: null, matchMode: FilterMatchMode.CONTAINS },
    email: { value: null, matchMode: FilterMatchMode.CONTAINS },
    cell: { value: null, matchMode: FilterMatchMode.CONTAINS },
  });

  const [AddUserModal, setAddUserModal] = useState(null);

  const [globalFilterValue, setGlobalFilterValue] = useState("");

  const onGlobalFilterChange = (e) => {
    const value = e.target.value;
    let _filters = { ...filters };

    _filters["global"].value = value;
    setFilters(_filters);
    setGlobalFilterValue(value);
  };

  const renderHeader = () => {
    return (
      <div className="flex justify-content-end">
        <span className="p-input-icon-left">
          <i className="pi pi-search" />
          <InputText
            value={globalFilterValue}
            onChange={onGlobalFilterChange}
            placeholder="Keyword Search"
          />
        </span>
      </div>
    );
  };

  const header = renderHeader();

  useEffect(() => {
    const elems = document.querySelectorAll(".modal");
    M.Modal.init(elems);
  }, []);

  return (
    <div className="container users-table-component">
      <AddButton datatarget={"add-user-modal"}></AddButton>
      <AddUser></AddUser>
      <h2>צוות</h2>
      <div className="users-table">
        {users && users.length > 0 ? (
          <DataTable
            value={users}
            paginator
            rows={10}
            dataKey="id"
            filters={filters}
            globalFilterFields={[
              "role",
              "first_name",
              "last_name",
              "email",
              "cell",
              "is_operator",
              "is_operator_aid",
            ]}
            header={header}
            emptyMessage="No users found."
          >
            <Column
              field="first_name"
              sortable
              header="שם פרטי"
              showFilterMenu={false}
            ></Column>
            <Column
              field="last_name"
              sortable
              header="שם משפחה"
              showFilterMenu={false}
            ></Column>
            <Column
              field="email"
              sortable
              header="מייל"
              showFilterMenu={false}
            ></Column>
            <Column
              field="cell"
              sortable
              header="סלולרי"
              showFilterMenu={false}
            ></Column>

            <Column
              field="is_operator"
              sortable
              header="מפעיל"
              showFilterMenu={false}
            ></Column>
            <Column
              field="is_operator_aid"
              sortable
              header="עוזר"
              showFilterMenu={false}
            ></Column>
          </DataTable>
        ) : (
          ""
        )}
      </div>
    </div>
  );
}

export default AllUsers;
