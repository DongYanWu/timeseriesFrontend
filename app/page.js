"use client";

import { useState } from "react";
import axios from "axios";

export default function Home() {
  const [file, setFile] = useState(null);
  const [csvData, setCsvData] = useState("");

  const handleFileChange = (e) => {
    setFile(e.target.files[0]);
  };

  const handleUpload = async () => {
    const formData = new FormData();
    formData.append("file", file);

    await axios.post(`${process.env.NEXT_PUBLIC_API_URL}/upload`, formData, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    });
  };

  const handleSearch = async () => {
    const response = await axios.post(
      `${process.env.NEXT_PUBLIC_API_URL}/similarity-search`,
      { csvData }
    );
    console.log(response.data);
  };

  return (
    <div>
      <h1>Time Series Data Similarity Search</h1>
      <input type="file" onChange={handleFileChange} />
      <button onClick={handleUpload}>Upload CSV</button>
      <textarea
        value={csvData}
        onChange={(e) => setCsvData(e.target.value)}
        placeholder="Enter time series data for similarity search"
      />
      <button onClick={handleSearch}>Search</button>
    </div>
  );
}
