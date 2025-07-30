import { useState } from "react";
import Navbar from "./components/Navbar";
import Footer from "./components/Footer";
import "./App.css";

function App() {
  const [file, setFile] = useState(null);
  const [num, setNum] = useState(5);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [mcqs, setMcqs] = useState("");
  const [showForm, setShowForm] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setMcqs("");

    if (!file) {
      setError("Please upload a PDF file.");
      return;
    }

    setLoading(true);
    const formData = new FormData();
    formData.append("pdf", file);
    formData.append("num_mcqs", num);

    try {
      const res = await fetch("https://quizfy.onrender.com/generate-mcqs/", {
        method: "POST",
        body: formData,
      });

      const contentType = res.headers.get("content-type");
      if (!res.ok) throw new Error(`HTTP error! ${res.status}`);

      if (contentType && contentType.includes("application/json")) {
        const data = await res.json();
        if (data.mcqs) setMcqs(data.mcqs);
        else setError(data.error || "Unknown error occurred.");
      } else {
        setError("Unexpected response format from server.");
      }
    } catch (err) {
      setError(err.message || "Failed to connect to backend.");
    }

    setLoading(false);
    setFile(null);
  };

  return (
    <div className="relative flex min-h-screen flex-col bg-[#0d1a16] text-white font-newsreader">
      <Navbar />
      <main className="flex flex-col items-center justify-center flex-1 px-6 py-10 w-full">
        {/* Header */}
        <section className="text-center max-w-3xl">
          <h2 className="text-lg text-[#8fbfaf] font-semibold mb-2 uppercase tracking-wide">
            How it Works
          </h2>
          <h1 className="text-4xl md:text-5xl font-extrabold mb-4 leading-tight text-[#e1f5f0]">
            Simple Steps to Create MCQs
          </h1>
          <p className="text-[#c4dad3] text-base md:text-lg mb-10">
            Follow these easy steps to generate multiple-choice questions from
            your PDF documents quickly and efficiently.
          </p>

          <div className="steps-row">
            <StepCard
              title="Upload Your PDF"
              desc="Choose the PDF file that contains the material you want to turn into questions."
            />
            <StepCard
              title="Set Question Count"
              desc="Decide how many questions you want. It’s quick and flexible."
            />
            <StepCard
              title="Generate MCQs"
              desc="Click generate and watch your questions appear in seconds!"
            />
          </div>
        </section>

        {/* CTA */}
        <section className="cta-section">
          <h1 className="cta-title">Ready to create your MCQs?</h1>
          <p className="cta-desc">
            Upload your PDF and let AI generate intelligent multiple-choice
            questions for you.
          </p>

          {!showForm && (
            <button
              className="cta-btn btn-modern"
              onClick={() => setShowForm(true)}
            >
              Get Started
            </button>
          )}
        </section>

        {/* Form */}
        {showForm && (
          <form
            onSubmit={handleSubmit}
            className="mt-10 w-full max-w-md bg-[#12221d] p-6 rounded-2xl shadow-lg border border-[#2b4b3f] space-y-4 animate-fade-in"
          >
            <div>
              <label className="form-label">Upload PDF</label>
              <input
                key={file ? file.name : "empty"}
                type="file"
                accept="application/pdf"
                onChange={(e) => setFile(e.target.files[0])}
                className="form-input"
                required
                disabled={loading}
              />
            </div>

            <div>
              <label className="form-label">Number of Questions</label>
              <input
                type="number"
                min={1}
                max={50}
                value={num}
                onChange={(e) => setNum(Number(e.target.value))}
                className="form-input"
                required
                disabled={loading}
              />
            </div>

            <button
              type="submit"
              disabled={loading}
              className="btn-modern w-full mt-2"
            >
              {loading ? "Generating..." : "Generate MCQs"}
            </button>
          </form>
        )}

        {/* Error */}
        {error && <div className="text-red-400 mt-4 text-sm">{error}</div>}

        {/* MCQs */}
        {mcqs && (
          <div className="modern-mcqs-container mt-6">
            <h2 className="modern-mcqs-title">Generated MCQs</h2>
            <div className="modern-mcqs-list">
              {mcqs.split("\n\n").map((q, i) => (
                <div key={i} className="modern-mcqs-card mb-4">
                  <pre
                    style={{
                      whiteSpace: "pre-wrap",
                      wordBreak: "break-word",
                      margin: 0,
                    }}
                  >
                    {q}
                  </pre>
                </div>
              ))}
            </div>
            <button
              onClick={() => navigator.clipboard.writeText(mcqs)}
              className="btn-modern mt-4"
            >
              Copy MCQs
            </button>
          </div>
        )}
      </main>
      <Footer />
    </div>
  );
}

const StepCard = ({ title, desc }) => (
  <div className="step-card">
    <div className="step-card-title">{title}</div>
    <p className="step-card-desc">{desc}</p>
  </div>
);

export default App;
