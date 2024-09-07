import React from 'react';

const FileList = ({ files, onSelectFile }) => {
  return (
    <div className="bg-white shadow-md rounded px-8 pt-6 pb-8 mb-4">
      <h2 className="text-xl font-bold mb-4">Files</h2>
      <ul>
        {files.map(file => (
          <li 
            key={file.id} 
            className="cursor-pointer hover:bg-gray-100 p-2 rounded"
            onClick={() => onSelectFile(file)}
          >
            <p className="font-semibold">{file.file_name}</p>
            <p className="text-sm text-gray-600">{file.description}</p>
            <div className="flex flex-wrap mt-1">
              {file.tags.map(tag => (
                <span key={tag} className="bg-blue-100 text-blue-800 text-xs font-semibold mr-2 px-2.5 py-0.5 rounded">
                  {tag}
                </span>
              ))}
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default FileList;