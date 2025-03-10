import { useState } from 'react';
import Tesseract from 'tesseract.js';

export default function OCRExtractor() {
  const [image, setImage] = useState(null);
  const [text, setText] = useState('');
  const [loading, setLoading] = useState(false);

  const handleImageUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      setImage(URL.createObjectURL(file));
    }
  };

  const extractText = async () => {
    if (!image) return;
    setLoading(true);
    try {
      const result = await Tesseract.recognize(image, 'eng', {
        logger: (m) => console.log(m),
      });
      setText(result.data.text);
    } catch (error) {
      alert('Error extracting text. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleCopy = () => {
    navigator.clipboard.writeText(text);
    alert('Text copied to clipboard!');
  };

  return (
    <div className="min-h-screen bg-gray-100 flex flex-col items-center p-6">
      <h1 className="text-3xl font-bold text-blue-600 mb-4">OCR Text Extractor</h1>
      <p className="text-gray-500 mb-6">Upload an image and extract text instantly.</p>

      <div className="bg-white p-6 rounded-2xl shadow-xl w-full max-w-md">
        <input
          type="file"
          accept="image/*"
          className="block w-full border-2 border-dashed border-gray-300 p-4 rounded-lg mb-4 cursor-pointer"
          onChange={handleImageUpload}
        />

        {image && (
          <img src={image} alt="Preview" className="w-full rounded-md mb-4" />
        )}

        <button
          onClick={extractText}
          className="w-full bg-blue-500 text-white py-2 rounded-xl hover:bg-blue-600 transition"
        >
          {loading ? 'Extracting...' : 'Extract Text'}
        </button>

        {text && (
          <div className="mt-4 p-4 bg-gray-50 border border-gray-300 rounded-md shadow-inner">
            <textarea
              className="w-full h-40 p-2 text-gray-800 bg-white border-none outline-none resize-none"
              value={text}
              readOnly
            />
            <div className="flex gap-2 mt-3">
              <button
                onClick={handleCopy}
                className="bg-green-500 text-white px-4 py-2 rounded-lg hover:bg-green-600 transition"
              >
                Copy Text
              </button>
              <a
                href={`data:text/plain;charset=utf-8,${encodeURIComponent(text)}`}
                download="extracted_text.txt"
                className="bg-purple-500 text-white px-4 py-2 rounded-lg hover:bg-purple-600 transition"
              >
                Download Text
              </a>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
