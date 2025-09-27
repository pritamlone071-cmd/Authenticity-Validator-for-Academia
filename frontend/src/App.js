import React, { useState } from 'react';
import './App.css';

function App() {
    const [selectedFile, setSelectedFile] = useState(null);
    const [extractedText, setExtractedText] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState('');

    const handleFileChange = (event) => {
        setSelectedFile(event.target.files[0]);
        setExtractedText('');
        setError('');
    };

    const handleUpload = async () => {
        if (!selectedFile) {
            setError('Please select a file first.');
            return;
        }

        setIsLoading(true);
        setError('');
        const formData = new FormData();
        formData.append('file', selectedFile);

        try {
            const response = await fetch('http://localhost:5001/api/v1/upload', {
                method: 'POST',
                body: formData,
            });

            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }

            const data = await response.json();
            setExtractedText(data.extracted_text);
        } catch (e) {
            console.error('Upload error:', e);
            setError('Failed to upload and process the file. Please ensure the backend is running.');
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="App">
            <header className="App-header">
                <h1>Authenticity Validator for Academia</h1>
                <p>Upload a certificate image to extract its text content.</p>
            </header>
            <main>
                <div className="upload-section">
                    <input type="file" onChange={handleFileChange} accept="image/*" />
                    <button onClick={handleUpload} disabled={isLoading}>
                        {isLoading ? 'Processing...' : 'Upload and Extract Text'}
                    </button>
                </div>
                {error && <p className="error-message">{error}</p>}
                {extractedText && (
                    <div className="results-section">
                        <h2>Extracted Text:</h2>
                        <pre>{extractedText}</pre>
                    </div>
                )}
            </main>
        </div>
    );
}

export default App;
