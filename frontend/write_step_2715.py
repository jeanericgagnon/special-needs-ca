import json

log_path = "/Users/ericgagnon/.gemini/antigravity/brain/c95206f0-8f07-4189-b38a-cf33af661d11/.system_generated/logs/transcript.jsonl"

with open(log_path, 'r') as f:
    for line in f:
        data = json.loads(line)
        if data.get("step_index") == 2715:
            with open("/Users/ericgagnon/Documents/antigravity/beautiful-lavoisier/frontend/step_2715.txt", 'w') as out:
                out.write(data.get("content", ""))
            print("Wrote step 2715 content to step_2715.txt")
            break
