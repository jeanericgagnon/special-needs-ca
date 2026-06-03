import json

log_path = "/Users/ericgagnon/.gemini/antigravity/brain/c95206f0-8f07-4189-b38a-cf33af661d11/.system_generated/logs/transcript.jsonl"

with open(log_path, 'r') as f:
    for line in f:
        data = json.loads(line)
        if data.get("step_index") == 2715:
            print("Keys:", data.keys())
            print("Type:", data.get("type"))
            print("Status:", data.get("status"))
            # print first 500 chars of content
            content = data.get("content", "")
            print("Content start:", content[:500])
            break
