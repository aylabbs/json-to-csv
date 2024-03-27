import { FilterOutlined } from "@ant-design/icons";
import { Button, Input, Popover } from "antd";
import { useState } from "react";

const FilterPopover = ({ field, setFilter, clearFilter, filterValue }) => {
  const [value, setValue] = useState("");
  return (
    <Popover
    onOpenChange={(visible => visible && setValue(filterValue))}
      content={
        <div>
          <Input
            value={value}
            placeholder="Type to filter"
            onChange={(e) => setValue(e.target.value)}
            style={{ width: "200px", marginRight: "10px" }}
          />
          <Button
            type="primary"
            disabled={!value}
            onClick={() => setFilter(field, value)}
            style={{ marginRight: "5px" }}
          >
            OK
          </Button>
          <Button
            onClick={() => {
              setValue("");
              clearFilter(field);
            }}
          >
            Clear
          </Button>
        </div>
      }
      title="Filter"
      trigger="click"
    >
      <a>
        {field} {filterValue !== "" && filterValue != null && <FilterOutlined />}
      </a>
    </Popover>
  );
};

export default FilterPopover;