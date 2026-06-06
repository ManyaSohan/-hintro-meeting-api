\# AI Approach



\## Prompt Design

The prompt explicitly instructs the model to:

1\. Analyze ONLY what is stated in the transcript

2\. Never invent information not present in the transcript

3\. Always cite the exact timestamp for every insight generated

4\. Return only valid JSON with no markdown or extra text



\## Citation Strategy

Every AI-generated insight includes a citations array with timestamp references pointing back to the exact transcript segment. This ensures full traceability between insights and source material.



Example:

{

&#x20; "text": "Team plans to launch next Friday",

&#x20; "citations": \[{ "timestamp": "00:10" }]

}



\## Hallucination Prevention

\- The prompt strictly forbids inventing attendees, action items, or decisions

\- The model is instructed to only use information explicitly present in the transcript

\- Output is validated by parsing the JSON response strictly

\- If content cannot be grounded in the transcript, it should not be generated



\## Output Validation Strategy

\- Response is parsed as JSON after stripping markdown code fences

\- If JSON parsing fails, an error is thrown and returned to the client

\- Action items extracted by AI are automatically saved to the database with their citations



\## Known Limitations

\- Very short transcripts may produce minimal insights

\- Model may occasionally miss implicit action items

\- Free tier Groq API has rate limits

\- No semantic similarity check between citations and generated text

