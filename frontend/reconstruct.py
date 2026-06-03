import json
import re

log_path = "/Users/ericgagnon/.gemini/antigravity/brain/c95206f0-8f07-4189-b38a-cf33af661d11/.system_generated/logs/transcript.jsonl"
target_file_path = "/Users/ericgagnon/Documents/antigravity/beautiful-lavoisier/frontend/src/app/dashboard/dashboard-client.tsx"

steps_to_parse = [2765, 2733, 2715, 2723, 2727]
reconstructed_lines = {}

with open(log_path, 'r') as f:
    for line in f:
        try:
            data = json.loads(line)
            step_idx = data.get("step_index")
            if step_idx in steps_to_parse:
                print(f"Parsing step {step_idx}...")
                content = data.get("content", "")
                
                # Each line in the content is of the form "123: line_content"
                # Let's split by newline
                lines = content.split("\n")
                for l in lines:
                    match = re.match(r"^\s*(\d+):\s(.*)$", l)
                    if match:
                        line_num = int(match.group(1))
                        line_content = match.group(2)
                        reconstructed_lines[line_num] = line_content
        except Exception as e:
            print(f"Error parsing line: {e}")

print(f"Total reconstructed lines: {len(reconstructed_lines)}")
if len(reconstructed_lines) > 0:
    max_line = max(reconstructed_lines.keys())
    print(f"Max line number: {max_line}")
    
    # Check for any missing lines
    missing = []
    for i in range(1, max_line + 1):
        if i not in reconstructed_lines:
            missing.append(i)
    if missing:
        print(f"Missing lines: {missing[:20]}... (total {len(missing)})")
    else:
        print("No missing lines!")
        
    # Write to target file
    with open(target_file_path, 'w') as out_f:
        for i in range(1, max_line + 1):
            out_f.write(reconstructed_lines[i] + "\n")
    print(f"Successfully wrote reconstructed file to {target_file_path}")
else:
    print("Failed to reconstruct any lines.")
