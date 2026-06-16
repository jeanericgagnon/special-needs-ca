import os

docs_dir = "docs"
output_file = "/Users/ericgagnon/.gemini/antigravity/brain/f5c4e4c5-e6ee-44ba-84bd-d56f69d06707/all_state_reports.txt"

merged_content = []

# Walk through docs directory and collect all .md files
for root, dirs, files in os.walk(docs_dir):
    for file in files:
        if file.endswith(".md"):
            filepath = os.path.join(root, file)
            relative_path = os.path.relpath(filepath, docs_dir)
            
            try:
                with open(filepath, "r", encoding="utf-8") as f:
                    content = f.read()
                
                # Format headers to clearly separate files
                merged_content.append(f"\n\n{'='*80}\n")
                merged_content.append(f"FILE: docs/{relative_path}\n")
                merged_content.append(f"{'='*80}\n\n")
                merged_content.append(content)
            except Exception as e:
                print(f"Skipping {filepath}: {e}")

with open(output_file, "w", encoding="utf-8") as f:
    f.write("".join(merged_content))

print(f"✓ Successfully merged all files into {output_file}")
