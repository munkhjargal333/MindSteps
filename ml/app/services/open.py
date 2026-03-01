from openai import OpenAI

client = OpenAI(
  base_url="https://openrouter.ai/api/v1",
  api_key="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",
)

completion = client.chat.completions.create(
  extra_headers={
    "HTTP-Referer": "<YOUR_SITE_URL>", # Optional. Site URL for rankings on openrouter.ai.
    "X-OpenRouter-Title": "<YOUR_SITE_NAME>", # Optional. Site title for rankings on openrouter.ai.
  },
  extra_body={},
  model="z-ai/glm-4.5",
  messages=[
    {
      "role": "user",
      "content": "What is the meaning of life?"
    }
  ],
  max_tokens=10000
)
print(completion.choices[0].message.content)