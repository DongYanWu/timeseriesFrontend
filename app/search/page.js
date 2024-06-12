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
import { useState, useEffect, useRef } from "react";
import axios from "axios";
import Select, { SelectChangeEvent } from "@mui/material/Select";
import MenuItem from "@mui/material/MenuItem";
import CardTemplate from "../../components/cardTemplate/CardTemplate";
import Sun from "../../components/sun/Sun";
import Input from "@mui/joy/Input";
import SideBar from "../../components/SideBar/SideBar";
import OutlinedInput from "@mui/material/OutlinedInput";
import FormControl from "@mui/material/FormControl";
import ListItemText from "@mui/material/ListItemText";
import Checkbox from "@mui/material/Checkbox";
import InputLabel from "@mui/material/InputLabel";
import Button from "@mui/material/Button";
import TableSortLabel from "@mui/material/TableSortLabel";
import LoadingAnimation from "../../components/LoadingAnimation/LoadingAnimation";
import { useTheme } from "@mui/material/styles";
import Box from "@mui/material/Box";
import Chip from "@mui/material/Chip";

const columns = [
  { id: "companyname", label: "Company Name", minWidth: 170 },
  { id: "min_dis", label: "Minimum Distance", minWidth: 170, align: "left" },
  { id: "start_time", label: "Start Time", minWidth: 170, align: "left" },
  { id: "end_time", label: "End Time", minWidth: 170, align: "left" },
];

const tables = [
  { label: "company_stock_prices", CompanyName: "company_stock_prices" },
];

const methods = [
  "Pure Euclidean distance",
  "V-shift",
  "DTW",
  "Cross-Correlation",
];

function getStyles(name, personName, theme) {
  return {
    fontWeight:
      personName.indexOf(name) === -1
        ? theme.typography.fontWeightRegular
        : theme.typography.fontWeightMedium,
  };
}

const ITEM_HEIGHT = 48;
const ITEM_PADDING_TOP = 8;
const MenuProps = {
  PaperProps: {
    style: {
      maxHeight: ITEM_HEIGHT * 4.5 + ITEM_PADDING_TOP,
      width: 250,
    },
  },
};

export default function StickyHeadTable() {
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [targetCompany, setTargetCompany] = useState(""); // Default table
  const [data, setData] = useState([]);
  const [offset, setOffset] = useState(0);
  const [companies, setCompanies] = useState([]);
  const [loading, setLoading] = useState(false);
  const [company, setCompany] = useState("");
  const limit = 500; // Number of rows to fetch per request
  const observer = useRef();
  const [selectedCompanies, setSelectedCompanies] = useState([]);
  const theme = useTheme();
  const [methodChoose, setMethodChoose] = React.useState([]);
  const [open, setOpen] = React.useState(false);

  useEffect(() => {
    fetchCompanies();
  }, []);

  const fetchCompanies = async () => {
    try {
      const response = await axios.get(
        `${process.env.NEXT_PUBLIC_API_URL}/companies/company_stock_prices`
      );
      setCompanies(response.data.map((row) => row.company));
    } catch (err) {
      console.error("Error fetching companies:", err);
    }
  };

  const handleTargetCompanyChange = (e) => {
    setTargetCompany(e.target.value);
  };

  const handleCompanyChange = (event) => {
    const {
      target: { value },
    } = event;

    if (value.includes("all")) {
      setSelectedCompanies(
        selectedCompanies.length === companies.length ? [] : companies
      );
    } else {
      setSelectedCompanies(
        typeof value === "string" ? value.split(",") : value
      );
    }
  };

  const fetchData = async (initial = false) => {
    setLoading(true);
    console.log(methodChoose);
    try {
      const response = await axios.get(
        `${process.env.NEXT_PUBLIC_API_URL}/similaritywithouttime`,
        {
          params: {
            targetCompany: targetCompany,
            company: selectedCompanies.join(","),
            methodChoose: methodChoose,
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

  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(+event.target.value);
    setPage(0);
  };

  const handleSubmit = (event) => {
    event.preventDefault();
    fetchData(true);
  };

  const handleMethodChange = (event) => {
    setMethodChoose(event.target.value);
  };

  const handleClose = () => {
    setOpen(false);
  };

  const handleOpen = () => {
    setOpen(true);
  };

  return (
    <div
      style={{
        width: "100vw",
        height: "100vh",
        overflow: "auto",
      }}
    >
      {loading && <LoadingAnimation />}
      <Sun />
      <CardTemplate
        backgroundStyle={{
          background: "#0f0f15",
          zIndex: "-1",
        }}
        style={{
          display: "flex",
          background: "#0f0f15",
          boxShadow: "0 0 40px rgba(255, 255, 255, 1)",
          border: "none",
          zIndex: "0",
        }}
      >
        <SideBar />

        <Paper
          sx={{
            width: "100%",
            overflow: "auto",
            align: "center",
          }}
        >
          <form
            onSubmit={handleSubmit}
            style={{
              display: "flex",
              margin: "30px",
              height: "70px",
            }}
          >
            <Input
              type="text"
              value={targetCompany}
              onChange={handleTargetCompanyChange}
              placeholder="Enter Target Company Name"
              sx={{ height: "55px", marginTop: "8px" }}
            />

            <FormControl
              sx={{
                m: 1,
                width: 150,
                marginLeft: "20px",
                marginTop: "8px",
                display: "flex",
              }}
            >
              <InputLabel id="demo-multiple-checkbox-label">Company</InputLabel>
              <Select
                labelId="demo-multiple-checkbox-label"
                id="demo-multiple-checkbox"
                multiple
                value={selectedCompanies}
                onChange={handleCompanyChange}
                input={<OutlinedInput label="Company" />}
                renderValue={(selected) => selected.join(", ")}
                MenuProps={MenuProps}
              >
                <MenuItem
                  value="all"
                  style={{
                    fontWeight:
                      selectedCompanies.length === companies.length
                        ? "bold"
                        : "normal",
                  }}
                >
                  <Checkbox
                    checked={selectedCompanies.length === companies.length}
                    indeterminate={
                      selectedCompanies.length > 0 &&
                      selectedCompanies.length < companies.length
                    }
                  />
                  <ListItemText primary="Select All" />
                </MenuItem>
                {companies.map((comp) => (
                  <MenuItem key={comp} value={comp}>
                    <Checkbox checked={selectedCompanies.indexOf(comp) > -1} />
                    <ListItemText primary={comp} />
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
            {/* <Button sx={{ display: "block", mt: 2 }} onClick={handleOpen}>
              Open the select
            </Button> */}
            <FormControl sx={{ m: 1, minWidth: 120 }}>
              <InputLabel id="demo-controlled-open-select-label">
                Method
              </InputLabel>
              <Select
                labelId="demo-controlled-open-select-label"
                id="demo-controlled-open-select"
                open={open}
                onClose={handleClose}
                onOpen={handleOpen}
                value={methodChoose}
                label="methodChoose"
                onChange={handleMethodChange}
              >
                <MenuItem value="null">
                  <em>None</em>
                </MenuItem>
                <MenuItem value={0}>Pure Euclidean distance</MenuItem>
                <MenuItem value={1}>V-shift</MenuItem>
                <MenuItem value={2}>DTW</MenuItem>
                <MenuItem value={3}>Cross-Correlation</MenuItem>
              </Select>
            </FormControl>

            <Button
              type="submit"
              variant="contained"
              color="primary"
              sx={{ height: "55px", marginLeft: "20px", marginTop: "8px" }}
            >
              Submit
            </Button>
          </form>
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
                      >
                        {columns.map((column) => {
                          const value = row[column.id];
                          return (
                            <TableCell key={column.id} align={column.align}>
                              {column.format && typeof value === "number"
                                ? column.format(value)
                                : value}
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
