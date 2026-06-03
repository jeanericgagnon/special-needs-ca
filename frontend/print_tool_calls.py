import json

log_path = "/Users/ericgagnon/.gemini/antigravity/brain/c95206f0-8f07-4189-b38a-cf33af661d11/.system_generated/logs/transcript.jsonl"

with open(log_path, 'r') as f:
    for line in f:
        try:
            data = json.loads(line)
            if "tool_calls" in data:
                for tc in data["tool_calls"]:
                    args = tc.get("args", {})
                    if isinstance(args, str):
                        try: args = json.loads(args)
                        except: pass
                    target = args.get("TargetFile") or args.get("Target") or ""
                    if "dashboard-client.tsx" in target:
                        print(f"Step {data.get('step_index')}: {tc.get('name')}")
                        for k, v in args.items():
                            if k not in ["CodeContent", "ReplacementContent", "TargetContent"]:
                                print(f"  {k}: {v}")
                            else:
                                print(f"  {k} (len {len(str(v))}): {str(v)[:100]}...")
        except Exception as e:
            pass
