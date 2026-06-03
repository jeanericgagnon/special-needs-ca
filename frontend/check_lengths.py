import json

log_path = "/Users/ericgagnon/.gemini/antigravity/brain/c95206f0-8f07-4189-b38a-cf33af661d11/.system_generated/logs/transcript.jsonl"
steps = [2715, 2723, 2727, 2733, 2765]

with open(log_path, 'r') as f:
    for line in f:
        data = json.loads(line)
        step_idx = data.get("step_index")
        if step_idx in steps:
            content = data.get("content", "")
            print(f"Step {step_idx} content length: {len(content)}")
            if "truncated" in content.lower():
                print(f"  Truncation indicator found in step {step_idx}!")
