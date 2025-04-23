import React, { useEffect, useState } from "react";
import Tools from "../../handlers/tools";
import { FilterMatchMode } from "primereact/api";
import { DataTable } from "primereact/datatable";
import { Column } from "primereact/column";
import { InputText } from "primereact/inputtext";
import { connect, useSelector, useDispatch } from "react-redux";
import {
  setHeadsets,
  updateHeadset,
} from "../../handlers/redux/actions/headsetsActions";
import M from "materialize-css";
import AddButton from "../../htmlelements/addButton";
// import AddDonation from "../../donation/addDonation";

function HeadSetsTable({ headsets, setHeadsets }) {
  const [filters, setFilters] = useState({
    // "id",
    // "location",
    // "serial_number",
    // "username",
    // "email",
    // "password",
    // "pin",

    global: { value: null, matchMode: FilterMatchMode.CONTAINS },
    num: { value: null, matchMode: FilterMatchMode.CONTAINS },
    locationName: { value: null, matchMode: FilterMatchMode.CONTAINS },
    serial_number: { value: null, matchMode: FilterMatchMode.CONTAINS },
    username: { value: null, matchMode: FilterMatchMode.CONTAINS },
    email: { value: null, matchMode: FilterMatchMode.CONTAINS },
  });

  const [loading, setLoading] = useState(true);
  const [globalFilterValue, setGlobalFilterValue] = useState("");
  const dispatch = useDispatch();

  const onGlobalFilterChange = (e) => {
    const value = e.target.value;
    let _filters = { ...filters };

    _filters["global"].value = value;
    setFilters(_filters);
    setGlobalFilterValue(value);
  };
  const determineRowClass = (rowData) => {
    return ""; //rowData.approved != 1 ? "row-not-approved-admin" : "";
  };

  const handleRowClick = async (rowData) => {};

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
    async function getHeadSets() {
      var requestOptions = {
        method: "GET",
      };
      const response = await fetch(
        Tools.serverURL + "inventory/getAllHeadsets?onlyUsable=0",
        requestOptions
      );
      const result = await response.json();
      if (result && result.payload && result.payload.length > 0) {
        setHeadsets(
          result.payload.map((obj) => {
            const locationName = obj.location.name;
            const tagString =
              obj.tags && obj.tags.length > 0 && obj.tags[0]
                ? obj.tags.map((tag) => tag?.tag).join(", ")
                : "";
            return { ...obj, locationName, tagString };
          })
        );
        setLoading(false);
      }
    }

    if (!headsets || headsets.length == 0) getHeadSets();
    else setLoading(false);

    const elems = document.querySelectorAll(".modal");
    M.Modal.init(elems);
  }, [headsets, setHeadsets]);

  const tagTemplate = (rowData) => {
    return rowData.tags && rowData.tags.length > 0 ? (
      rowData.tags.map((tag, index) => {
        if (!tag || !tag.tag || !tag.color) {
          return "No Tags"; // Return empty string for invalid tags
        }
        return (
          <span
            key={index}
            style={{
              color: tag.color,
              backgroundColor: tag.color,
              minWidth: "40px",
              borderRadius: "12px",
              display: "inline-block",
            }}
          >
            {tag.tag}
          </span>
        );
      })
    ) : (
      <span>No Tags</span> // Fallback if there are no tags
    );
  };

  return (
    <div className="container headsets-table-component">
      {/* at a later time... <AddButton datatarget={"add-headset-modal"}></AddButton>
      <AddDonation></AddDonation> */}
      <h2>משקפות</h2>
      <div className="headsets-table">
        {headsets && headsets.length > 0 ? (
          <DataTable
            value={headsets}
            rowClassName={determineRowClass}
            onRowClick={handleRowClick}
            paginator
            rows={20}
            dataKey="num"
            filters={filters}
            loading={loading}
            globalFilterFields={[
              "num",
              "locationName",
              "serial_number",
              "username",
              "email",
              "password",
              "pin",
              "tagString",
            ]}
            header={header}
            emptyMessage="No headsets found."
            paginatorTemplate="CurrentPageReport FirstPageLink PrevPageLink PageLinks NextPageLink LastPageLink RowsPerPageDropdown"
            currentPageReportTemplate="Showing {first} to {last} of {totalRecords} entries"
          >
            <Column
              field="num"
              sortable
              filter
              filterPlaceholder="מספר"
              header="מספר"
              showFilterMenu={false}
            ></Column>
            <Column
              field="tagString"
              sortable
              filter
              filterPlaceholder="צבע"
              header="צבע"
              showFilterMenu={false}
              body={tagTemplate}
            ></Column>
            <Column
              field="locationName"
              sortable
              filter
              filterPlaceholder="מיקום"
              header="מיקום"
              showFilterMenu={false}
            ></Column>
            <Column
              field="serial_number"
              sortable
              header="מספר סידורי"
              filter
              filterPlaceholder="מספר סידורי"
              showFilterMenu={false}
            ></Column>
            <Column
              field="username"
              sortable
              header="שם משתמש"
              filter
              filterPlaceholder="שם משתמש"
              showFilterMenu={false}
            ></Column>
            <Column
              field="email"
              sortable
              header="מייל"
              filter
              filterPlaceholder="מייל"
              showFilterMenu={false}
            ></Column>
            <Column
              field="password"
              header="סיסמה"
              filter
              filterPlaceholder="סיסמה"
              showFilterMenu={false}
            ></Column>
            <Column
              field="pin"
              header="קוד"
              filterPlaceholder="קוד"
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
const mapStateToProps = (state) => ({
  headsets: state.headsets,
});

const mapDispatchToProps = {
  setHeadsets,
};
export default connect(mapStateToProps, mapDispatchToProps)(HeadSetsTable);
