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
        You are a Senior Backend Engineer.
        Review ONLY the following Git diff.

        File:
        ${file.fileName}

        Language:
        ${file.language}

        Git Diff:
        ${file.patch}

        Return ONLY valid JSON.

        {
        "summary":"",
        "overallScore":0,
        "status":"COMPLETED",
        "comments":[
            {
            "fileName":"",
            "lineNumber":0,
            "severity":"LOW | MEDIUM | HIGH | CRITICAL",
            "comment":"",
            "suggestedCode":""
            }
        ]
        }
        `;

        const response = await axios.post(`${this.baseUrl}/api/generate`, {
          model: this.model,
          prompt,
          stream: false,
        });

        console.log('========== OLLAMA RAW RESPONSE ==========');
        console.log(response.data.response);
        console.log('==========================================');

        try {
          reviews.push(JSON.parse(response.data.response));
        } catch {
          console.log(`Invalid JSON returned for ${file.fileName}`);
        }
      }

      return reviews;
    } catch (error) {
      return InternalServerErrorResponse(
        error instanceof Error ? error.message : String(error),
        commonMessages.INTERNAL_SERVER_ERROR,
      );
    }
  }
}
