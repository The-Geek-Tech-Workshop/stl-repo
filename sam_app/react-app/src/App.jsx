import React, { useState, useEffect } from 'react';
import axios from 'axios';
import FileList from './components/FileList';
import SearchBar from './components/SearchBar';
import STLViewer from './components/STLViewer';
import FileUpload from './components/FileUpload';

const API_ENDPOINT = import.meta.env.VITE_API_ENDPOINT || '/Prod';

const App = () => {
  const [files, setFiles] = useState([]);
  const [selectedFile, setSelectedFile] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    fetchFiles();
  }, []);

  const fetchFiles = async () => {
    try {
      const response = await axios.get(`${API_ENDPOINT}/files`);
      setFiles(response.data);
    } catch (error) {
      console.error('Error fetching files:', error);
    }
  };

  const handleSearch = (term) => {
    setSearchTerm(term);
  };

  const handleFileUpload = async (fileData) => {
    try {
      await axios.post(`${API_ENDPOINT}/files`, fileData);
      fetchFiles(); // Refresh the file list
    } catch (error) {
      console.error('Error uploading file:', error);
    }
  };

  const filteredFiles = files.filter(file => 
    file.tags.some(tag => tag.toLowerCase().includes(searchTerm.toLowerCase()))
  );

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-3xl font-bold mb-4">STL File Viewer</h1>
      <FileUpload onUpload={handleFileUpload} />
      <SearchBar onSearch={handleSearch} />
      <div className="flex">
        <div className="w-1/3 pr-4">
          <FileList 
            files={filteredFiles} 
            onSelectFile={setSelectedFile} 
          />
        </div>
        <div className="w-2/3">
          {selectedFile && (
            <STLViewer fileUrl={`${API_ENDPOINT}/files/${selectedFile.id}`} />
          )}
        </div>
      </div>
    </div>
  );
};

export default App;