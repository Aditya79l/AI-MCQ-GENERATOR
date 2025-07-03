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
      const res = await fetch("http://localhost:8000/generate-mcqs/", {
        method: "POST",
        body: formData,
      });
      const data = await res.json();
      if (data.mcqs) setMcqs(data.mcqs);
      else setError(data.error || "Unknown error occurred.");
    } catch {
      setError("Failed to connect to backend.");
    }

    setLoading(false);
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

          {/* Steps Grid */}
          <div className="steps-row">
            <StepCard
              title="Upload Your PDF"
              desc={
                <>
                  <span>
                    Choose the PDF file that contains the material you want to
                    turn into questions.
                  </span>
                </>
              }
              className="step-card"
            />
            <StepCard
              title="Set Question Count"
              desc={
                <>
                  <span>
                    Decide how many questions you want. It’s quick and flexible.
                  </span>
                </>
              }
              className="step-card"
            />
            <StepCard
              title="Generate MCQs"
              desc={
                <>
                  <span>
                    Click generate and watch your questions appear in seconds!
                  </span>
                </>
              }
              className="step-card"
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
                type="file"
                accept="application/pdf"
                onChange={(e) => setFile(e.target.files[0])}
                className="form-input"
                required
              />
            </div>

            <div>
              <label className="form-label">Number of Questions</label>
              <input
                type="number"
                min={1}
                max={50}
                value={num}
                onChange={(e) => setNum(e.target.value)}
                className="form-input"
                required
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

        {/* Scrollable MCQ Display */}
        {mcqs && (
          <div className="modern-mcqs-container">
            <h2 className="modern-mcqs-title">Generated MCQs</h2>
            <div className="modern-mcqs-list">
              {mcqs.split(/\n{2,}/).map((block, idx) => (
                <div key={idx} className="modern-mcqs-card">
                  {block.split("\n").map((line, i) => (
                    <div
                      key={i}
                      className={
                        line.match(/^\d+\./)
                          ? "modern-mcqs-q"
                          : line.match(/^[A-D]\./)
                          ? "modern-mcqs-opt"
                          : "modern-mcqs-ans"
                      }
                    >
                      {line}
                    </div>
                  ))}
                </div>
              ))}
            </div>
          </div>
        )}
      </main>
      <Footer />
    </div>
  );
}

const StepCard = ({ title, desc, className = "" }) => (
  <div className={`step-card ${className}`}>
    <div className="step-card-title">{title}</div>
    <p className="step-card-desc">{desc}</p>
  </div>
);

export default App;
