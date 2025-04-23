import React, { useEffect, useState } from "react";
import Tools from "../../handlers/tools";
import { FilterMatchMode } from "primereact/api";
import { DataTable } from "primereact/datatable";
import { Column } from "primereact/column";
import { InputText } from "primereact/inputtext";
import { connect, useSelector, useDispatch } from "react-redux";
import {
  setFilms,
  updateFilm,
} from "../../handlers/redux/actions/filmsActions";
import M from "materialize-css";

function FilmsTable({ films, setFilms }) {
  const [filters, setFilters] = useState({
    global: { value: null, matchMode: FilterMatchMode.CONTAINS },
    title: { value: null, matchMode: FilterMatchMode.CONTAINS },
    language: { value: null, matchMode: FilterMatchMode.CONTAINS },
    file_name: { value: null, matchMode: FilterMatchMode.CONTAINS },
    category: { value: null, matchMode: FilterMatchMode.CONTAINS },
    length: { value: null, matchMode: FilterMatchMode.CONTAINS },
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
    async function getFilms() {
      var requestOptions = {
        method: "GET",
      };
      const response = await fetch(
        Tools.serverURL + "getters/getAllFilms",
        requestOptions
      );
      const result = await response.json();
      if (result && result.Table && result.Table.length > 0) {
        setFilms(result.Table);
        setLoading(false);
      }
    }

    if (!films || films.length == 0) getFilms();
    else setLoading(false);

    const elems = document.querySelectorAll(".modal");
    M.Modal.init(elems);
  }, [films, setFilms]);

  return (
    <div className="container films-table-component">
      {/* at a later time... <AddButton datatarget={"add-headset-modal"}></AddButton>
      <AddDonation></AddDonation> */}
      <h2>סרטים</h2>
      <div className="films-table">
        {films && films.length > 0 ? (
          <DataTable
            value={films}
            rowClassName={determineRowClass}
            onRowClick={handleRowClick}
            paginator
            rows={20}
            dataKey="id"
            filters={filters}
            loading={loading}
            globalFilterFields={[
              "title",
              "category",
              "language",
              "file_name",
              "length",
            ]}
            header={header}
            emptyMessage="No films found."
          >
            <Column
              field="title"
              sortable
              filter
              filterPlaceholder="שם"
              header="שם"
              showFilterMenu={false}
            ></Column>
            <Column
              field="category"
              sortable
              filter
              filterPlaceholder="קטגוריה"
              header="קטגוריה"
              showFilterMenu={false}
            ></Column>
            <Column
              field="language"
              sortable
              header="שפה"
              filter
              filterPlaceholder="שפה"
              showFilterMenu={false}
            ></Column>
            <Column
              field="file_name"
              sortable
              header="שם הקובץ"
              filter
              filterPlaceholder="שם הקובץ"
              showFilterMenu={false}
            ></Column>
            <Column
              field="length"
              sortable
              header="אורך"
              filter
              filterPlaceholder="אורך"
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
  films: state.films,
});

const mapDispatchToProps = {
  setFilms,
};
export default connect(mapStateToProps, mapDispatchToProps)(FilmsTable);