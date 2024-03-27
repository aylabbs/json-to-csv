import { Button, Input, Space, Table, Typography } from "antd";
import { flattie } from "flattie";
import Papa from "papaparse";
import { useCallback, useMemo, useRef, useState } from "react";
import { v4 as uuid } from "uuid";
import FilterPopover from "./FilterPopover.jsx";
const { TextArea } = Input;
const { Link, Title } = Typography;



function Converter() {
  const jsonInputRef = useRef(null);
  const [data, setData] = useState([]);
  const [filters, setFilters] = useState({});
  const [csvUrl, setCsvUrl] = useState(null);
  const [fileName, setFileName] = useState("data");

  const handleGenerateCSV = () => {
    try {
      const jsonData = JSON.parse(
        jsonInputRef.current.resizableTextArea.textArea.value
      );
      const flattenedData = jsonData.map((row) => flattie(row));
      const csv = Papa.unparse(flattenedData, { header: true });
      setData(flattenedData);
      generateCSVUrl(csv)
    } catch (error) {
      alert("Error parsing JSON: " + error);
    }
  };
  const generateCSVUrl = (csvString) => {
    const blob = new Blob([csvString], { type: "text/csv;charset=utf-8;" });
    const newUrl = URL.createObjectURL(blob);
    setCsvUrl(newUrl);
  };

  const setFilter = useCallback((field, value) => {
    setFilters((prevFilters) => ({ ...prevFilters, [field]: value }));
  }, []);

  const clearFilter = useCallback((field) => {
    setFilters((prevFilters) => {
      const newFilters = { ...prevFilters };
      delete newFilters[field];
      return newFilters;
    });
  }, []);

  const filteredRows = useMemo(() => {
    return data
      .filter((row) =>
        Object.entries(filters).every(([field, filterValue]) =>
          String(row[field]).toLowerCase().includes(filterValue.toLowerCase())
        )
      )
      .map((row) => ({ ...row, _internalReactKey: uuid() }));
  }, [data, JSON.stringify(filters)]); // Using JSON.stringify for dependency

  const columns = useMemo(() => {
    // Assuming you have a way to get fields from data
    const fields = data.length > 0 ? Object.keys(data[0]) : [];
    return fields.map((field) => ({
      title: (
        <FilterPopover
          field={field}
          setFilter={setFilter}
          clearFilter={clearFilter}
          filterValue={filters[field]}
        />
      ),
      dataIndex: field,
      key: field,
      width: 150,
    }));
  }, [filters, data.length]);

  return (
    <div style={{ margin: "20px" }}>
      <Title level={2}>JSON to CSV Converter and Table Viewer</Title>
      <TextArea
        ref={jsonInputRef}
        rows={6}
        placeholder="Enter JSON here"
        style={{ marginBottom: "20px" }}
      />
      <Space style={{ alignItems: "center", marginBottom: "20px" }}>
        <Button
        style={{ alignSelf: "center" }}
          type="primary"
          onClick={handleGenerateCSV}
        >
          Generate CSV and Load Table
        </Button>
        {csvUrl && (
          <>
            <Typography.Text>FileName:</Typography.Text>
            <Input
              placeholder="Enter file name"
              defaultValue="data"
              onChange={(e) => setFileName(e.target.value)}
            />
            <Link href={csvUrl} download={`${fileName}.csv`}>
              Download {fileName}.csv
            </Link>
          </>
        )}
      </Space>
      <Table
        columns={columns}
        dataSource={filteredRows}
        rowKey="_internalReactKey"
        scroll={{ y: 400 }}
        pagination={false}
      />
    </div>
  );
}

export default Converter;
