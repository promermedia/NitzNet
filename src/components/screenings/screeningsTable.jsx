import React, { useEffect, useState } from "react";
import Tools from "../handlers/tools";
import { FilterMatchMode } from "primereact/api";
import { DataTable } from "primereact/datatable";
import { Column } from "primereact/column";
import { InputText } from "primereact/inputtext";
import { connect, useSelector } from "react-redux";
import M from "materialize-css";
import AddButton from "../htmlelements/addButton";
import {
  setScreenings
} from "../handlers/redux/actions/screeningsActions";
// import AddDonation from "../../screenings/screeningsTable";

function ScreeningsTable({ screenings, setScreenings }) {
  const [filters, setFilters] = useState({
    global: { value: null, matchMode: FilterMatchMode.CONTAINS },
    client: { value: null, matchMode: FilterMatchMode.CONTAINS },
    city: { value: null, matchMode: FilterMatchMode.CONTAINS },
    operator: { value: null, matchMode: FilterMatchMode.CONTAINS },
    formattedDate: { value: null, matchMode: FilterMatchMode.CONTAINS },
    operator_aid: { value: null, matchMode: FilterMatchMode.CONTAINS },
    title: { value: null, matchMode: FilterMatchMode.CONTAINS },
  });

  const [loading, setLoading] = useState(true);
  const [globalFilterValue, setGlobalFilterValue] = useState("");

  const onGlobalFilterChange = (e) => {
    const value = e.target.value;
    let _filters = { ...filters };
    _filters["global"].value = value;
    setFilters(_filters);
    setGlobalFilterValue(value);
  };

  const determineRowClass = (rowData) => {
    return "" // rowData.approved != 1 ? "row-not-approved" : "";
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
    async function getScreenings() {
      var formdata = new FormData();
      formdata.append("token", Tools.getLSbyKey("NHuser", "token"));

      var requestOptions = {
        method: "POST",
        body: formdata,
      };
      const response = await fetch(
        Tools.serverURL + "events/getAllFutureEvents",
        requestOptions
      );
      const result = await response.json()
      if (result && result.payload && result.payload.length > 0) {
        setScreenings(
          result.payload.map((obj) => {
            const formattedDate = Tools.formatDate(obj.date);
            const formattedTime = Tools.formatTime(obj.time_start);
            return { ...obj, formattedDate, formattedTime };
          })
        );
        setLoading(false);
      }
    }
    if (!screenings || screenings.length == 0) getScreenings();
    else setLoading(false);

    const elems = document.querySelectorAll(".modal");
    M.Modal.init(elems);
  }, [screenings, setScreenings]);

  return (
    <div className="container screening-table-component">
      <h2>הקרנות</h2>
      <div className="screening-table">
        {screenings && screenings.length > 0 ? (
          <DataTable
            value={screenings}
            rowClassName={determineRowClass}
            paginator
            rows={10}
            dataKey="id"
            filters={filters}
            loading={loading}
            globalFilterFields={[
              "client",
              "city",
              "formattedDate",
              "formattedTime",
              "hs_qty",
              "operator",
              "operator_aid",
              "title",
            ]}
            header={header}
            emptyMessage="No screenings found."
          >
            <Column
              field="client"
              sortable
              header="לקוח"
              filter
              filterPlaceholder="לקוח"
              showFilterMenu={false}
            ></Column>
            <Column
              field="city"
              header="עיר"
              filter
              filterPlaceholder="עיר"
              showFilterMenu={false}
            ></Column>
            <Column
              field="formattedDate"
              header="תאריך"
              filter
              filterPlaceholder="תאריך"
              showFilterMenu={false}
            ></Column>
            <Column
              field="formattedTime"
              sortable
              header="שעה"
              filter
              filterPlaceholder="שעה"
              showFilterMenu={false}
            ></Column>
            <Column
              field="hs_qty"
              header="כמות"
              filter
              filterPlaceholder="כמות"
              showFilterMenu={false}
            ></Column>
            <Column
              field="operator"
              header="מפעיל"
              filter
              filterPlaceholder="מפעיל"
              showFilterMenu={false}
            ></Column>
            <Column
              field="operator_aid"
              header="כח עזר"
              filter
              filterPlaceholder="כח עזר"
              showFilterMenu={false}
            ></Column>
            <Column
              field="title"
              header="סרט"
              filter
              filterPlaceholder="סרט"
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
  screenings: state.screenings,
});

const mapDispatchToProps = {
  setScreenings,
};
export default connect(mapStateToProps, mapDispatchToProps)(ScreeningsTable);
