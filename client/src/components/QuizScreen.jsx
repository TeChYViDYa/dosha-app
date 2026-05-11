import { useState } from "react";


export default function QuizScreen({ question, progress, loading, onAnswer }) {
  const [firstChoice, setFirstChoice] = useState(null);
  const [selected, setSelected] = useState();
  const [secondChoice, setSecondChoice] = useState(null);

  const handleOptionClick = (index) => {
    if (firstChoice === null) {
      setFirstChoice(index);
      setSelected(true);
      return;
    }

    if (index === firstChoice) {
      return;
    }

    setSecondChoice(index);

  };

  const handleContinueClick = () => {
      onAnswer(
    firstChoice,
    secondChoice
    );
    console.log(selected);
    setFirstChoice(null);
    setSecondChoice(null);
    console.log('First choice:', firstChoice);
    console.log('Second choice:', secondChoice);  
  }

  if (!question) {
    return (
      <main className="screen">
        <section className="panel">
          <p>Loading question...</p>
        </section>
      </main>
    );
  }

  return (
    <main className="screen">
      <section className="panel">
        <p className="eyebrow">
          Question {progress.answered + 1} of {progress.maxAllowed}
        </p>
        <h1>{question.text}</h1>
        <div className="options">
          {loading && <p className="loading">Submitting answer...</p>}
          {question.options.map((option, index) => (
            <button
              key={option.text}
              className = {firstChoice === index  ? "selected" : ""}          
              type="button"
              disabled={loading}
              onClick={async () => await handleOptionClick(index)  } 
            >
              {option.text} {firstChoice === index && <span className="checkmark">(Ⅰ)</span>}
              {secondChoice === index && <span className="checkmark">(Ⅱ)</span>}
            </button>
          ))}
        </div>

        {
          firstChoice !== null && (
            <button
              id = "continue-button"
              key="Continue"
              type="button"
              disabled={loading}
              onClick={handleContinueClick}
            >
              Continue
            </button>
          )
        }


      </section>
    </main>
  );
}
