import { API_URL } from "../../constants";
import React, { useState, useEffect } from "react";
import HrHeader from "../HrHeader/HrHeader";
import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  IconButton,
  TextField,
  MenuItem,
  InputAdornment,
  Button,
} from "@mui/material";
import SearchIcon from "@mui/icons-material/Search";
import FilterListIcon from "@mui/icons-material/FilterList";
import LinkedInIcon from "@mui/icons-material/LinkedIn";
import DescriptionIcon from "@mui/icons-material/Description"; // Using Description as Resume icon
import { students as initialStudents } from "../../testData/testStudents";
import "./HrPortal.css"; // Adjust the path as necessary

// Replace with your API URL

const searchOptions = [
  { value: "name", label: "Name" },
  { value: "state", label: "State" },
  { value: "school", label: "School" },
  { value: "position", label: "Position" },
  { value: "officeLocation", label: "Office Location" },
  { value: "interest", label: "Interest" },
];

const HrPortal = () => {
  const [students, setStudents] = useState(initialStudents);
  const [searchQuery, setSearchQuery] = useState("");
  const [searchCategory, setSearchCategory] = useState(searchOptions[0].value);

  useEffect(() => {
    fetchStudents();
  }, []);

  const fetchStudents = () => {
    fetch(API_URL + "/student/query", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        content: null,
        filter: null,
      }),
    })
      .then((response) => {
        console.log("response", response);
        if (!response.ok) {
          throw new Error(`Failed to fetch students: ${response.statusText}`);
        }
        return response.json();
      })
      .then((data) => {
        setStudents(data.users);
      })
      .catch((error) => {
        console.error("Error fetching students:", error);
      });
  };

  const handleSearchChange = (e) => {
    setSearchQuery(e.target.value);
  };

  const handleSubmit = () => {
    const filteredStudents = initialStudents.filter((student) =>
      student[searchCategory]
        ?.toString()
        .toLowerCase()
        .includes(searchQuery.toLowerCase())
    );
    setStudents(filteredStudents);
  };

  const handleView = (email) => {
    console.log("View button clicked for:", email);
  };

  return (
    <div className="portal-container">
      <HrHeader />
      <div className="main-content">
        <div className="search-controls">
          <h2>Candidates</h2>
          <div className="search-header">
            <TextField
              style={{ marginRight: "1%" }}
              size="small"
              label="Search"
              variant="outlined"
              value={searchQuery}
              onChange={handleSearchChange}
              className="search-input"
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <SearchIcon />
                  </InputAdornment>
                ),
              }}
            />
            <TextField
              style={{ marginRight: "1%" }}
              select
              size="small"
              variant="outlined"
              value={searchCategory}
              onChange={(e) => setSearchCategory(e.target.value)}
              className="search-select"
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <FilterListIcon />
                  </InputAdornment>
                ),
              }}
            >
              {searchOptions.map((option) => (
                <MenuItem key={option.value} value={option.value}>
                  {option.label}
                </MenuItem>
              ))}
            </TextField>
            <Button
              variant="contained"
              color="primary"
              onClick={handleSubmit}
              style={{ height: "fit-content" }}
            >
              Search
            </Button>
          </div>
        </div>
        <TableContainer component={Paper} className="table-container">
          <Table aria-label="candidate table">
            <TableHead>
              <TableRow>
                {[
                  "Name",
                  "Email",
                  "Phone",
                  "State",
                  "School",
                  "Graduation",
                  "Position",
                  "Office Location",
                  "Stage",
                  "Interest",
                  "LinkedIn",
                  "Resume",
                  "View",
                ].map((header) => (
                  <TableCell key={header}>{header}</TableCell>
                ))}
              </TableRow>
            </TableHead>
            <TableBody>
              {students.map((student) => (
                <TableRow key={student.email}>
                  <TableCell>{student.name}</TableCell>
                  <TableCell>{student.email}</TableCell>
                  <TableCell>{student.phone}</TableCell>
                  <TableCell>{student.state}</TableCell>
                  <TableCell>{student.school}</TableCell>
                  <TableCell>{student.graduation}</TableCell>
                  <TableCell>{student.position}</TableCell>
                  <TableCell>{student.officeLocation}</TableCell>
                  <TableCell>{student.stage}</TableCell>
                  <TableCell>{student.interest}</TableCell>
                  <TableCell>
                    <IconButton
                      aria-label="LinkedIn"
                      onClick={() => window.open(student.linkedIn, "_blank")}
                    >
                      <LinkedInIcon />
                    </IconButton>
                  </TableCell>
                  <TableCell>
                    <IconButton
                      aria-label="Resume"
                      onClick={() => window.open(student.resume, "_blank")}
                    >
                      <DescriptionIcon />
                    </IconButton>
                  </TableCell>
                  <TableCell>
                    <Button
                      variant="outlined"
                      onClick={() => handleView(student.email)}
                    >
                      View
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      </div>
    </div>
  );
};

export default HrPortal;
