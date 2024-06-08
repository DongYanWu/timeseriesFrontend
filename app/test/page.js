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
import { textAlign } from "@mui/system";
import CardTemplate from "@/components/cardTemplate/CardTemplate";
import Sun from "@/components/sun/Sun";

const columns = [
  { id: "id", label: "ID", minWidth: 170 },
  { id: "company", label: "Company", minWidth: 170, align: "left" },
  {
    id: "startTimestamp",
    label: "startTimestamp",
    minWidth: 170,
    align: "left",
  },
  { id: "endTimestamp", label: "endTimestamp", minWidth: 170, align: "left" },
  {
    id: "price",
    label: "Price",
    minWidth: 170,
    align: "left",
    format: (value) => value.toFixed(2),
  },
];

export default function StickyHeadTable() {
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(12);
  const [tableName, setTableName] = useState("company_stock_prices"); // Default table
  const [data, setData] = useState([]);
  const [offset, setOffset] = useState(0);
  const [companies, setCompanies] = useState([]);
  const [loading, setLoading] = useState(false);
  const [company, setCompany] = useState("");
  const [startTimestamp, setStartTimestamp] = useState("");
  const [endTimestamp, setEndTimestamp] = useState("");
  const [price, setPrice] = useState("");
  const limit = 500; // Number of rows to fetch per request

  const observer = useRef();

  useEffect(() => {
    fetchCompanies();
    setData([]);
    setOffset(0);
    fetchData(true);
  }, [tableName, company, timestamp, price]);

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

  const fetchData = async (initial = false) => {
    setLoading(true);
    try {
      const response = await axios.get(
        `${process.env.NEXT_PUBLIC_API_URL}/data/${tableName}`,
        {
          params: {
            limit,
            offset: initial ? 0 : offset,
            company: company.trim(), // Ensure no extra spaces
            startTimestamp,
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

  const handleStartTimestampChange = (e) => {
    setStartTimestamp(e.target.value);
  };

  const handleEndTimestampChange = (e) => {
    setEndTimestamp(e.target.value);
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
        // backgroundColor: "#0f0f15",
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
        <Paper
          sx={{
            width: "100%",
            overflow: "hidden",
            align: "center",
          }}
        >
          <input
            type="text"
            value={tableName}
            onChange={handleTableNameChange}
            placeholder="Enter table name"
          />
          <Select
            labelId="demo-simple-select-standard-label"
            id="demo-simple-select-standard"
            value={company}
            onChange={handleCompanyChange}
            label="Age"
            sx={{
              maxHeight: "50%",
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
          <input
            type="datetime-local"
            value={startTimestamp}
            onChange={handleStartTimestampChange}
            placeholder="Start Timestamp"
          />
          <input
            type="datetime-local"
            value={endTimestamp}
            onChange={handleEndTimestampChange}
            placeholder="End Timestamp"
          />
          <input
            type="number"
            value={price}
            onChange={handlePriceChange}
            placeholder="Filter by price"
          />
          <TableContainer>
            <Table stickyHeader aria-label="sticky table">
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
