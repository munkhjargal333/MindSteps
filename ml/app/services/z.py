from openai import OpenAI

client = OpenAI(
    api_key="d17e07e995e3411cbb2a8b05554f4ddd.LGc8b8nYnS5DACNE",
    base_url="https://api.z.ai/api/paas/v4/"
)

completion = client.chat.completions.create(
    model="glm-4.7-flash",
    messages=[
        {"role": "system", "content": "You are a smart and creative novelist"},
        {"role": "user", "content": "Please write a short fairy tale story as a fairy tale master"}
    ]
)

print(completion.choices[0].message.content)