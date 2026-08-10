import { Injectable } from '@nestjs/common';
import axios from 'axios';

import { CodeReviewFile } from './code-review.interface';
import { InternalServerErrorResponse } from 'src/common/utils/Responses.util';
import { commonMessages } from 'src/common/messages/common.messages';

@Injectable()
export class LlmService {
  private readonly baseUrl = process.env.OLLAMA_URL ?? 'http://localhost:11434';

  private readonly model = process.env.OLLAMA_MODEL ?? 'deepseek-coder:6.7b';

  async reviewFiles(files: CodeReviewFile[]) {
    try {
      const reviews: any[] = [];

      for (const file of files) {
        if (!file.patch) {
          continue;
        }

        const prompt = `
You are a Senior Backend Software Engineer performing an automated GitHub Pull Request code review.

Your task is to review ONLY the code changes present in the provided Git diff.

Do not review code that is not part of the diff.

FILE:
${file.fileName}

LANGUAGE:
${file.language}

GIT DIFF:
${file.patch}

REVIEW THE CODE FOR:

1. Bugs or incorrect logic
2. Security vulnerabilities
3. Performance problems
4. Incorrect error handling
5. Database or query problems
6. API/backend design problems
7. Meaningful maintainability problems
8. Potential runtime failures

DO NOT REPORT:

1. Formatting preferences
2. Naming preferences
3. Minor coding style differences
4. Personal coding preferences
5. Changes that are already correct
6. Hypothetical problems without evidence
7. Issues that are unrelated to the changed lines

IMPORTANT:

- Only report genuine and meaningful problems.
- Do not invent problems.
- Do not criticize a change simply because another implementation is possible.
- Consider the surrounding code shown in the diff before reporting an issue.
- If the change is correct, return an empty comments array.
- The lineNumber must refer to the changed line in the new version of the file.
- severity must be one of LOW, MEDIUM, HIGH, or CRITICAL.

SCORING:

90-100 = Excellent, no meaningful issues
80-89  = Good, only minor issues
70-79  = Some issues that should be addressed
50-69  = Significant issues
0-49   = Critical or severe problems

Return ONLY valid JSON.

Required JSON structure:

{
  "summary": "Short summary of the code changes and their quality",
  "overallScore": 0,
  "status": "COMPLETED",
  "comments": [
    {
      "fileName": "${file.fileName}",
      "lineNumber": 0,
      "severity": "LOW",
      "comment": "Explain the actual problem and why it matters.",
      "suggestedCode": "Provide corrected code only when a meaningful fix is possible."
    }
  ]
}
`;

        const response = await axios.post(`${this.baseUrl}/api/generate`, {
          model: this.model,
          prompt,
          stream: false,

          // Ask Ollama to return structured JSON
          format: 'json',
        });

        console.log(`========== OLLAMA RESPONSE: ${file.fileName} ==========`);

        console.log(response.data.response);

        console.log('=======================================================');

        try {
          const review = JSON.parse(response.data.response);

          reviews.push(review);
        } catch (error) {
          console.log(`Invalid JSON returned for ${file.fileName}`);

          console.log(response.data.response);
        }
      }

      return reviews;
    } catch (error: unknown) {
      return InternalServerErrorResponse(
        error instanceof Error ? error.message : String(error),
        commonMessages.INTERNAL_SERVER_ERROR,
      );
    }
  }
}
