import api from "./axiosInstance";

/**
 * Get FAQ Categories
 * GET /faq/categories
 *
 * This returns a list of available FAQ categories.
 *
 * Response format (array of categories):
 * [
 *   {
 *     "id": "string",
 *     "name": "string",
 *     "created_at": "string",
 *     "updated_at": "string"
 *   },
 *   ...
 * ]
 */
export const getFaqCategories = async () => {
    try {
        const response = await api.get("/faq/categories");
        return response.data; // According to swagger: an array of objects
    } catch (error) {
        console.error("Error fetching FAQ categories:", error);
        throw error;
    }
};

/**
 * Post and fetch questions
 * POST /faq/questions
 *
 * We send category_ids, limit, offset in the body and receive a list of questions.
 * Example body:
 * {
 *   "category_ids": ["catId1", "catId2"],
 *   "limit": 10,
 *   "offset": 0
 * }
 * if category_ids is empty, it will return all questions.
 * Response format:
 * {
 *   "questions": [
 *   {
      "author": {
        "account_role": "string",
        "created_at": "string",
        "email": "string",
        "id": "string",
        "last_name": "string",
        "name": "string",
        "updated_at": "string"
      },
      "body": "string",
      "category": {
        "created_at": "string",
        "id": "string",
        "name": "string",
        "updated_at": "string"
      },
      "created_at": "string",
      "id": "string",
      "image_url": "string",
      "title": "string",
      "updated_at": "string"
    },
    ...
 *   ]
 * }
 */
export const getQuestions = async ({
    category_ids = [],
    limit = 10,
    offset = 0,
}) => {
    try {
        const body = {
            category_ids,
            limit,
            offset,
        };
        const response = await api.post("/faq/questions", body);
        return response.data.questions;
    } catch (error) {
        console.error("Error fetching FAQ questions:", error);
        throw error;
    }
};

/**
 * Get a single question by ID
 * GET /faq/questions/{id}
 *
 * Example path: /faq/questions/abc123
 *
 * Response format:
 {
  "question": {
    "author": {
      "account_role": "string",
      "created_at": "string",
      "email": "string",
      "id": "string",
      "last_name": "string",
      "name": "string",
      "updated_at": "string"
    },
    "body": "string",
    "category": {
      "created_at": "string",
      "id": "string",
      "name": "string",
      "updated_at": "string"
    },
    "created_at": "string",
    "id": "string",
    "image_url": "string",
    "title": "string",
    "updated_at": "string"
  }
}
 */
export const getQuestionById = async (questionId) => {
    try {
        const response = await api.get(`/faq/questions/${questionId}`);
        return response.data.question;
    } catch (error) {
        console.error(`Error fetching question ${questionId}:`, error);
        throw error;
    }
};

/**
 * Post (create) a new question
 * POST /faq/questions/post
 *
 * Requires Authorization header.
 * Example body:
 * {
 *   "title": "string",
 *   "body": "string",
 *   "category_id": "string",
 *   "image_url": "string"
 * }
 *
 * Response:
 * {
 *   "status": "success"
 * }
 */
export const postQuestion = async ({ title, body, category_id, image_url }) => {
    try {
        const requestBody = {
            title,
            body,
            category_id,
            image_url,
        };
        const response = await api.post("/faq/questions/post", requestBody);
        return response.data; // Typically { status: "success" }
    } catch (error) {
        console.error("Error posting question:", error);
        throw error;
    }
};

/**
 * Get answers for a specific question
 * GET /faq/answers?question_id=xxx&limit=xxx&offset=xxx
 *
 * Required query params:
 *  - question_id
 *  - limit
 *  - offset
 *
 * Response format:
{
  "answers": [
    {
      "author": {
        "account_role": "string",
        "created_at": "string",
        "email": "string",
        "id": "string",
        "last_name": "string",
        "name": "string",
        "updated_at": "string"
      },
      "body": "string",
      "created_at": "string",
      "id": "string",
      "question_id": "string",
      "updated_at": "string"
    }
  ]
}
 */
export const getAnswers = async (questionId, limit = 10, offset = 0) => {
    try {
        const response = await api.get(
            `/faq/answers?question_id=${questionId}&limit=${limit}&offset=${offset}`
        );
        return response.data.answers;
    } catch (error) {
        console.error(
            `Error fetching answers for question ${questionId}:`,
            error
        );
        throw error;
    }
};

/**
 * Post (create) a new answer
 * POST /faq/answers/post
 *
 * Requires Authorization header.
 * Example body:
 * {
 *   "question_id": "string",
 *   "body": "string"
 * }
 *
 * Response:
 * {
 *   "status": "success"
 * }
 */
export const postAnswer = async ({ question_id, body }) => {
    try {
        const requestBody = { question_id, body };
        const response = await api.post("/faq/answers/post", requestBody);
        return response.data; // Typically { status: "success" }
    } catch (error) {
        console.error("Error posting answer:", error);
        throw error;
    }
};
