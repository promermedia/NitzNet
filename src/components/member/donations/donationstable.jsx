import React, { useEffect, useState } from "react";
import Tools from "../../handlers/tools";
import { FilterMatchMode } from "primereact/api";
import { DataTable } from "primereact/datatable";
import { Column } from "primereact/column";
import { InputText } from "primereact/inputtext";
import { connect, useSelector } from "react-redux";
import M from "materialize-css";
import AddButton from "../../htmlelements/addButton";
import AddDonation from "../../donation/addDonation";

function DonationsTable({ payments, setPayments }) {
  const [filters, setFilters] = useState({
    global: { value: null, matchMode: FilterMatchMode.CONTAINS },
    amount: { value: null, matchMode: FilterMatchMode.EQUALS },
    payment_type: { value: null, matchMode: FilterMatchMode.EQUALS },
    payment_for: { value: null, matchMode: FilterMatchMode.EQUALS },
    date: { value: null, matchMode: FilterMatchMode.CONTAINS },
    note: { value: null, matchMode: FilterMatchMode.CONTAINS },
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
    return rowData.approved != 1 ? "row-not-approved" : "";
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
    async function getPayments() {
      var formdata = new FormData();
      formdata.append("token", Tools.getLSbyKey("NHuser", "token"));

      var requestOptions = {
        method: "POST",
        body: formdata,
      };
      const response = await fetch(
        Tools.serverURL + "donations/getUsersDonations",
        requestOptions
      );
      const result = await response.json();
      if (
        result &&
        result.Table &&
        result.Table.length > 0
      ) {
        setPayments(
          result.Table.map((obj) => {
            const formattedDate = Tools.formatDate(obj.date);
            return { ...obj, formattedDate };
          })
        );
        setLoading(false);
      }
    }
    if (!payments || payments.length == 0) getPayments();
    else setLoading(false);

    const elems = document.querySelectorAll(".modal");
    M.Modal.init(elems);
  }, [payments, setPayments]);

  return (
    <div className="container donation-table-component">
      <AddButton datatarget={"add-payment-modal"}></AddButton>
      <AddDonation></AddDonation>
      <h2>תשלומים עבור תרומות</h2>
      <div className="donation-table">
        {payments && payments.length > 0 ? (
          <DataTable
            value={payments}
            rowClassName={determineRowClass}
            paginator
            rows={10}
            dataKey="id"
            filters={filters}
            loading={loading}
            globalFilterFields={[
              "amount",
              "payment_type",
              "payment_for",
              "date",
              "note",
            ]}
            header={header}
            emptyMessage="No payments found."
          >
            <Column
              field="amount"
              sortable
              header="סכום"
              filter
              filterPlaceholder="סכום"
              showFilterMenu={false}
            ></Column>
            <Column
              field="payment_type"
              header="סוג תשלום"
              filter
              filterPlaceholder="סוג תשלום"
              showFilterMenu={false}
            ></Column>
            <Column
              field="payment_for"
              header="תשלום עבור"
              filter
              filterPlaceholder="תשלום עבור"
              showFilterMenu={false}
            ></Column>
            <Column
              field="formattedDate"
              sortable
              header="תאריך"
              filter
              filterPlaceholder="תאריך"
              showFilterMenu={false}
            ></Column>
            <Column
              field="note"
              header="הערה"
              filter
              filterPlaceholder="הערה"
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
  payments: state.payments,
});

const mapDispatchToProps = {
  setPayments,
};
export default connect(mapStateToProps, mapDispatchToProps)(DonationsTable);
