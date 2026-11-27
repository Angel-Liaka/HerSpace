
import { useState } from "react";
import { ArrowLeft, BookOpen } from "lucide-react";

// Learning resources displayed in HerLearn
const lessons = [
  {
    title: "Understanding Your Cycle",
    emoji: "🌸",
    description: "Learn about the menstrual cycle and its phases.",
    content: [
      "The menstrual cycle is a natural process that prepares the body for a possible pregnancy. Cycle lengths vary from person to person.",
      "The main phases are menstruation, the follicular phase, ovulation and the luteal phase.",
      "Tracking your cycle can help you understand your own patterns. Predictions are estimates, and cycles do not always follow the same schedule."
    ],
  },
  {
    title: "Period Care",
    emoji: "🩷",
    description: "Learn about menstrual hygiene and personal care.",
    content: [
      "Change menstrual products regularly and follow the instructions for the product you use.",
      "Wash your external genital area gently with clean water. Avoid scented products that may cause irritation.",
      "Dispose of used menstrual products safely and wash your hands before and after changing them."
    ],
  },
  {
    title: "Managing Period Symptoms",
    emoji: "🌷",
    description: "Understand cramps, fatigue and common symptoms.",
    content: [
      "Some people experience cramps, headaches, bloating, tiredness or mood changes during their periods.",
      "A warm compress, gentle movement, rest and drinking enough water may help with everyday discomfort.",
      "Seek medical advice if pain is severe, bleeding is unusually heavy or symptoms interfere with daily activities."
    ],
  },
  {
    title: "Nutrition and Wellbeing",
    emoji: "🥑",
    description: "Explore healthy habits and general wellbeing.",
    content: [
      "Eating balanced meals with fruits, vegetables, whole grains and protein supports general health.",
      "Iron-rich foods can be helpful during menstruation, especially for people who lose a lot of blood.",
      "Getting enough sleep, staying hydrated and making time to rest can support your wellbeing."
    ],
  },
  {
    title: "Periods and Studying",
    emoji: "📚",
    description: "Tips for managing schoolwork during menstruation.",
    content: [
      "Plan your academic activities using a calendar and prepare for important deadlines in advance.",
      "Keep menstrual products and any personal care items you need in your school bag.",
      "Take breaks when needed, stay hydrated and make a realistic study timetable that allows time for rest."
    ],
  },
  {
    title: "Myth vs Fact",
    emoji: "💡",
    description: "Understand common menstrual health misconceptions.",
    content: [
      "MYTH: Every person has a 28-day menstrual cycle. FACT: Cycle lengths naturally vary.",
      "MYTH: Periods should always arrive on exactly the same date. FACT: Some variation is normal.",
      "MYTH: You cannot exercise during your period. FACT: Many people can exercise comfortably if they wish to."
    ],
  },
];

export default function HerLearn() {
  const [selectedLesson, setSelectedLesson] = useState(null);

  // Display the selected lesson and its content
  if (selectedLesson) {
    return (
      <section className="learn-page">
        <button
          className="back-button"
          onClick={() => setSelectedLesson(null)}
        >
          <ArrowLeft size={17} /> Back to lessons
        </button>

        <article className="lesson-article">
          <span className="lesson-emoji">{selectedLesson.emoji}</span>
          <p className="eyebrow">HERLEARN • LEARNING RESOURCE</p>
          <h2>{selectedLesson.title}</h2>

          {selectedLesson.content.map((paragraph, index) => (
            <p key={index}>{paragraph}</p>
          ))}
        </article>
      </section>
    );
  }

  // Display all available learning lessons
  return (
    <section className="learn-page">
      <div className="page-heading">
        <p className="eyebrow">LEARN AND GROW</p>
        <h2>HerLearn ♡</h2>
        <p>Simple information to help you understand and care for yourself.</p>
      </div>

      <div className="learn-grid">
        {lessons.map((lesson) => (
          <article className="learn-card" key={lesson.title}>
            <span className="lesson-emoji">{lesson.emoji}</span>
            <h3>{lesson.title}</h3>
            <p>{lesson.description}</p>

            <button
              className="primary-button"
              onClick={() => setSelectedLesson(lesson)}
            >
              <BookOpen size={16} /> Read More
            </button>
          </article>
        ))}
      </div>
    </section>
  );
}
