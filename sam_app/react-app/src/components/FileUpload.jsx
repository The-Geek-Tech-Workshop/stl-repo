import React, { useState } from 'react';

const FileUpload = ({ onUpload }) => {
  const [file, setFile] = useState(null);
  const [description, setDescription] = useState('');
  const [tags, setTags] = useState('');

  const handleFileChange = (e) => {
    setFile(e.target.files[0]);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!file) return;

    const reader = new FileReader();
    reader.onload = async (event) => {
      const fileData = {
        file_content: event.target.result.split(',')[1], // Get base64 content
        file_name: file.name,
        description,
        tags: tags.split(',').map(tag => tag.trim())
      };
      onUpload(fileData);
    };
    reader.readAsDataURL(file);
  };

  return (
    <form onSubmit={handleSubmit} className="mb-4">
      <input type="file" onChange={handleFileChange} accept=".stl" required />
      <input 
        type="text" 
        value={description} 
        onChange={(e) => setDescription(e.target.value)} 
        placeholder="Description" 
        required 
      />
      <input 
        type="text" 
        value={tags} 
        onChange={(e) => setTags(e.target.value)} 
        placeholder="Tags (comma-separated)" 
        required 
      />
      <button type="submit">Upload</button>
    </form>
  );
};

export default FileUpload;