import json
import re

log_path = "/Users/ericgagnon/.gemini/antigravity/brain/c95206f0-8f07-4189-b38a-cf33af661d11/.system_generated/logs/transcript.jsonl"

with open(log_path, 'r') as f:
    for line in f:
        try:
            data = json.loads(line)
            if data.get("type") == "VIEW_FILE":
                content = data.get("content", "")
                if "dashboard-client.tsx" in content:
                    # Parse StartLine and EndLine from the tool execution log
                    match = re.search(r"Showing lines (\d+) to (\d+)", content)
                    if match:
                        start = match.group(1)
                        end = match.group(2)
                        print(f"Step {data.get('step_index')}: Showing lines {start} to {end}, length {len(content)}, truncated: {'truncated' in content.lower()}")
                    else:
                        print(f"Step {data.get('step_index')}: No line range matched, length {len(content)}")
        except Exception as e:
            pass
