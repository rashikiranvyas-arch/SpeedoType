
import "./Home.css";
import { useState, useEffect, useRef } from "react";

const questionbox = [
    "I have 2 apples and 3 oranges, which means I can make a delicious fruit salad.",
    "Today is 12th March, 2025, and the weather forecast says it will rain later.",
    "A rectangle has 4 sides and 4 angles, making it one of the simplest shapes.",
    "The bus arrived at 8:15 AM, just in time for the students to get to school.",
    "There are 24 hours in a day, but sometimes it feels like we need more time.",
];

function Home(props) {
    const [question, setQuestion] = useState("");
    const [answer, setAnswer] = useState("");
    const [wpm, setWpm] = useState(0);
    const [accuracy, setAccuracy] = useState(0);
    const [completed, setCompleted] = useState(false);
    const [finalResult, setFinalResult] = useState(null);
   

    const startTime = useRef(null);

    const reset = () => {
        const randomQuestion =
            questionbox[Math.floor(Math.random() * questionbox.length)];

        setQuestion(randomQuestion);
        setAnswer("");
        setWpm(0);
        setAccuracy(0);
        setCompleted(false);
        setFinalResult(null);
       
        startTime.current = null;
    };

    useEffect(() => {
        reset();
    }, []);

    const handleChange = (event) => {
        if (completed) return;

        const newAnswer = event.target.value;
        const now = Date.now();

        if (startTime.current === null && newAnswer.length > 0) {
            startTime.current = now;
        }

        setAnswer(newAnswer);

        if (newAnswer.length === 0) {
            setAccuracy(0);
            setWpm(0);
            return;
        }

        const correctChars = [...newAnswer].filter(
            (char, index) => char === question[index]
        ).length;

        const incorrectChars = newAnswer.length - correctChars;
        const currentAccuracy = Math.round(
            (correctChars / newAnswer.length) * 100
        );

        const elapsedMs = Math.max(now - startTime.current, 1000);
        const currentWpm = Math.round(
            (newAnswer.length / 5) / (elapsedMs / 60000)
        );

        setAccuracy(currentAccuracy);
        setWpm(currentWpm);

        if (newAnswer.length >= question.length) {
            setCompleted(true);

            const bestScore = Number(props.best) || 0;
            const isNewBest = currentWpm > bestScore;

            if (isNewBest) {
             

                if (props.setBest) {
                    props.setBest(currentWpm);
                }
            }

            setFinalResult({
                wpm: currentWpm,
                accuracy: currentAccuracy,
                correctChars,
                incorrectChars,
                personalBest: isNewBest,
            });
        }
    };

    const progress =
        question.length > 0
            ? Math.min(Math.round((answer.length / question.length) * 100), 100)
            : 0;

    return (
        <div className="typing-container">
            <p className="question">
                {[...question].map((char, index) => (
                    <span
                        key={index}
                        className={
                            answer[index] === undefined
                                ? ""
                                : answer[index] === char
                                ? "correct"
                                : "wrong"
                        }
                    >
                        {char}
                    </span>
                ))}
            </p>

            <div className="progress-section">
                <div className="progress-info">
                    <span>Typing Progress</span>
                    <span>{progress}%</span>
                </div>

                <div
                    className="progress-track"
                    role="progressbar"
                    aria-label="Typing progress"
                    aria-valuemin={0}
                    aria-valuemax={100}
                    aria-valuenow={progress}
                >
                    <div
                        className="progress-fill"
                        style={{ width: `${progress}%` }}
                    />
                </div>
            </div>

            <textarea
                className="answer"
                placeholder="Start typing here..."
                onChange={handleChange}
                value={answer}
                disabled={completed}
                maxLength={question.length}
                onPaste={(event) => event.preventDefault()}
            />

            <div className="stats">
                <p>WPM: {wpm}</p>
                <p>Accuracy: {accuracy}%</p>
            </div>

            {completed && finalResult && (
                <div className="result-summary" aria-live="polite">
                    <h2>Final Result Summary</h2>

                    <div className="result-grid">
                        <div className="result-card">
                            <span>Final WPM</span>
                            <strong>{finalResult.wpm}</strong>
                        </div>

                        <div className="result-card">
                            <span>Accuracy</span>
                            <strong>{finalResult.accuracy}%</strong>
                        </div>

                        <div className="result-card">
                            <span>Correct Characters</span>
                            <strong>{finalResult.correctChars}</strong>
                        </div>

                        <div className="result-card">
                            <span>Incorrect Characters</span>
                            <strong>{finalResult.incorrectChars}</strong>
                        </div>
                    </div>

                    <p
                        className={
                            finalResult.personalBest
                                ? "best-status achieved"
                                : "best-status"
                        }
                    >
                        {finalResult.personalBest
                            ? "🏆 New Personal Best!"
                            : "Keep practicing to beat your personal best!"}
                    </p>
                </div>
            )}

            <button onClick={reset} className="restart-btn">
                Restart
            </button>
        </div>
    );
}

export default Home;
