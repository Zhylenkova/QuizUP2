import { decodeHTML, shuffleArray } from './utils.js';

const BASE_URL = 'https://opentdb.com/api.php';

/**
 * Fetches questions from Open Trivia DB.
 * @param {number} amount - Number of questions.
 * @param {number|null} category - Category ID or null for all.
 * @returns {Promise<Array>} Array of normalized question objects.
 */
export async function fetchQuestions(amount = 50, category = null, difficulty = null) {
  let url = `${BASE_URL}?amount=${amount}`;
  if (category) {
    url += `&category=${category}`;
  }

  if (difficulty && difficulty !== 'null') {
    url += `&difficulty=${difficulty}`; 
  }

  try {
    const response = await fetch(url);
    const data = await response.json();

    if (data.response_code !== 0) {
      throw new Error(`API Error Code: ${data.response_code}`);
    }

    return data.results.map(normalizeQuestion);
  } catch (error) {
    console.error('Fetch failed:', error);
    throw error;
  }
}

function normalizeQuestion(item) {

  const correct = decodeHTML(item.correct_answer);
  const incorrect = item.incorrect_answers.map(decodeHTML);

  const options = shuffleArray([correct, ...incorrect]);

  return {
    category: decodeHTML(item.category),
    type: item.type,
    difficulty: item.difficulty,
    question: decodeHTML(item.question),
    correctAnswer: correct,
    options: options,
  };
}
