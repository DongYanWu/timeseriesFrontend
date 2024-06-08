"use client";
import * as React from "react";
import Paper from "@mui/material/Paper";
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import TableContainer from "@mui/material/TableContainer";
import TableHead from "@mui/material/TableHead";
import TablePagination from "@mui/material/TablePagination";
import TableRow from "@mui/material/TableRow";
import { useState, useEffect, useRef, useCallback } from "react";
import axios from "axios";
import TableSortLabel from "@mui/material/TableSortLabel";
import Select, { SelectChangeEvent } from "@mui/material/Select";
import MenuItem from "@mui/material/MenuItem";
import CardTemplate from "@/components/cardTemplate/CardTemplate";
import Sun from "@/components/sun/Sun";
import dayjs from "dayjs";
import { DemoContainer } from "@mui/x-date-pickers/internals/demo";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { DateTimePicker } from "@mui/x-date-pickers/DateTimePicker";
import TextField from "@mui/material/TextField";
import Autocomplete from "@mui/material/Autocomplete";
import Input from "@mui/joy/Input";

const columns = [
  { id: "id", label: "ID", minWidth: 170 },
  { id: "company", label: "Company", minWidth: 170, align: "left" },
  { id: "timestamp", label: "Timestamp", minWidth: 170, align: "left" },
  {
    id: "price",
    label: "Price",
    minWidth: 170,
    align: "left",
    format: (value) => value.toFixed(2),
  },
];

const tables = [
  { label: "company_stock_prices", CompanyName: "company_stock_prices" },
];

export default function StickyHeadTable() {
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(8);
  const [tableName, setTableName] = useState("company_stock_prices"); // Default table
  const [data, setData] = useState([]);
  const [offset, setOffset] = useState(0);
  const [companies, setCompanies] = useState([]);
  const [loading, setLoading] = useState(false);
  const [company, setCompany] = useState("");
  const [startTimestamp, setStartTimestamp] = useState(
    dayjs("2000-04-17T15:30")
  );
  const [endTimestamp, setEndTimestamp] = useState(dayjs("2024-05-17T15:30"));
  const [price, setPrice] = useState("");
  const limit = 500; // Number of rows to fetch per request

  const observer = useRef();

  useEffect(() => {
    fetchCompanies();
    setData([]);
    setOffset(0);
    fetchData(true);
  }, [tableName, company, startTimestamp, endTimestamp, price]);

  const fetchCompanies = async () => {
    try {
      const response = await axios.get(
        `${process.env.NEXT_PUBLIC_API_URL}/companies/${tableName}`
      );
      setCompanies(response.data.map((row) => row.company));
    } catch (err) {
      console.error("Error fetching companies:", err);
    }
  };

  // const fetchData = async (initial = false) => {
  //   setLoading(true);
  //   try {
  //     const response = await axios.get(
  //       `${process.env.NEXT_PUBLIC_API_URL}/data/${tableName}`,
  //       {
  //         params: {
  //           limit,
  //           offset: initial ? 0 : offset,
  //           company: company.trim(), // Ensure no extra spaces
  //           startTimestamp,
  //           endTimestamp,
  //           price,
  //         },
  //       }
  //     );
  //     setData((prevData) =>
  //       initial ? response.data : [...prevData, ...response.data]
  //     );
  //     setOffset((prevOffset) => prevOffset + limit);
  //   } catch (err) {
  //     console.error("Error fetching data:", err);
  //   } finally {
  //     setLoading(false);
  //   }
  // };
  const fetchData = async (initial = false) => {
    setLoading(true);
    try {
      const formattedStartTimestamp = startTimestamp
        ? startTimestamp.toISOString()
        : null;
      const formattedEndTimestamp = endTimestamp
        ? endTimestamp.toISOString()
        : null;

      console.log("Request Params:", {
        limit,
        offset: initial ? 0 : offset,
        company: company.trim(), // Ensure no extra spaces
        startTimestamp: formattedStartTimestamp,
        endTimestamp: formattedEndTimestamp,
        price,
      });

      const response = await axios.get(
        `${process.env.NEXT_PUBLIC_API_URL}/data/${tableName}`,
        {
          params: {
            limit,
            offset: initial ? 0 : offset,
            company: company.trim(), // Ensure no extra spaces
            startTimestamp: formattedStartTimestamp,
            endTimestamp: formattedEndTimestamp,
            price,
          },
        }
      );
      setData((prevData) =>
        initial ? response.data : [...prevData, ...response.data]
      );
      setOffset((prevOffset) => prevOffset + limit);
    } catch (err) {
      console.error("Error fetching data:", err);
    } finally {
      setLoading(false);
    }
  };
  const lastElementRef = useCallback(
    (node) => {
      if (loading) return;
      if (observer.current) observer.current.disconnect();
      observer.current = new IntersectionObserver((entries) => {
        if (entries[0].isIntersecting) {
          fetchData();
        }
      });
      if (node) observer.current.observe(node);
    },
    [loading, fetchData]
  );

  const handleTableNameChange = (e) => {
    setTableName(e.target.value);
  };

  const handleCompanyChange = (e) => {
    setCompany(e.target.value);
  };

  const handleStartTimestampChange = (newValue) => {
    setStartTimestamp(newValue);
  };

  const handleEndTimestampChange = (newValue) => {
    setEndTimestamp(newValue);
  };
  const handlePriceChange = (e) => {
    setPrice(e.target.value);
  };

  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(+event.target.value);
    setPage(0);
  };

  return (
    <div
      style={{
        width: "100vw",
        height: "100vh",
        overflow: "auto",
      }}
    >
      <Sun />
      <CardTemplate
        backgroundStyle={{
          background: "#0f0f15",
          zIndex: "-1",
        }}
        style={{
          display: "flex",
          // background: "linear-gradient(to bottom right, #fff, #acb5c2)",
          background: "#0f0f15",
          boxShadow: "0 0 40px rgba(255, 255, 255, 1)",
          border: "none",
          zIndex: "0",
        }}
      >
        <Paper sx={{ width: "100%", overflow: "auto", align: "center" }}>
          <div
            style={{
              display: "flex",
              margin: "30px",
              height: "70px",
            }}
          >
            <Input
              type="text"
              value={tableName}
              onChange={handleTableNameChange}
              placeholder="Enter table name"
              sx={{ height: "55px", marginTop: "8px" }}
            />

            <Select
              label="Company"
              labelId="demo-simple-select-standard-label"
              id="demo-simple-select-standard"
              value={company}
              onChange={handleCompanyChange}
              sx={{
                width: 300,
                height: "55px",
                marginLeft: "20px",
                marginTop: "8px",
              }}
            >
              <MenuItem value="">
                <em>ALL</em>
              </MenuItem>
              {companies.map((comp) => (
                <MenuItem key={comp} value={comp}>
                  {comp}
                </MenuItem>
              ))}
            </Select>
            <LocalizationProvider
              dateAdapter={AdapterDayjs}
              sx={{ display: "flex", margin: "0px" }}
            >
              <DemoContainer
                components={["DateTimePicker", "DateTimePicker"]}
                sx={{ display: "flex", marginLeft: "20px" }}
              >
                <div
                  style={{
                    display: "flex",
                    margin: "0px",
                  }}
                >
                  <DateTimePicker
                    label="start date"
                    // defaultValue={dayjs("2022-04-17T15:30")}
                    value={startTimestamp}
                    onChange={handleStartTimestampChange}
                    sx={{ width: 300 }}
                  />
                  <DateTimePicker
                    label="End date"
                    value={endTimestamp}
                    onChange={handleEndTimestampChange}
                    sx={{ width: 300, marginLeft: "20px" }}
                  />
                </div>
              </DemoContainer>
            </LocalizationProvider>

            <Input
              type="number"
              value={price}
              onChange={handlePriceChange}
              placeholder="Filter by price"
              sx={{ height: "55px", marginTop: "8px", marginLeft: "20px" }}
            />
          </div>
          <TableContainer>
            <Table
              stickyHeader
              aria-label="sticky table"
              sx={{ overflow: "auto" }}
            >
              <TableHead>
                <TableRow>
                  {columns.map((column) => (
                    <TableCell
                      key={column.id}
                      align={column.align}
                      style={{ minWidth: column.minWidth }}
                    >
                      {column.label}
                    </TableCell>
                  ))}
                </TableRow>
              </TableHead>
              <TableBody>
                {data
                  .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                  .map((row, index) => {
                    return (
                      <TableRow
                        hover
                        role="checkbox"
                        tabIndex={-1}
                        key={row.id}
                        ref={index === data.length - 1 ? lastElementRef : null}
                      >
                        {columns.map((column) => {
                          const value = row[column.id];
                          return (
                            <TableCell
                              key={column.id}
                              align={column.align}
                              ref={lastElementRef}
                            >
                              {column.format && typeof value === "number"
                                ? column.format(value)
                                : value}
                              <TableSortLabel></TableSortLabel>
                            </TableCell>
                          );
                        })}
                      </TableRow>
                    );
                  })}
              </TableBody>
            </Table>
          </TableContainer>
          <TablePagination
            rowsPerPageOptions={[10, 30, 100]}
            component="div"
            count={data.length}
            rowsPerPage={rowsPerPage}
            page={page}
            onPageChange={handleChangePage}
            onRowsPerPageChange={handleChangeRowsPerPage}
          />
        </Paper>
      </CardTemplate>
    </div>
  );
}
