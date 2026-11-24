"""paraphrase 평가 루프 실행기.

    cd backend
    .venv/bin/python -m evals.run_paraphrase_eval --fixture evals/fixtures/sample_outputs.json   # 저장된 답으로 채점(지금 가능)
    .venv/bin/python -m evals.run_paraphrase_eval                                                # 실제 Claude 호출로 채점(Day 7 이후)

통과율이 --min-pass(기본 0.9) 아래면 종료 코드 1 — 프롬프트를 고친 뒤 이 값이 떨어지면 되돌린다.
"""

import argparse
import json
import sys
from pathlib import Path

from evals.rubric import grade

LEVELS = ["beginner", "intermediate", "advanced"]
CASES_PATH = Path(__file__).with_name("cases.json")


def load_generator(fixture: str | None):
    """(case, level) → 설명 문자열 을 돌려주는 함수를 고른다"""
    if fixture:
        outputs = json.loads(Path(fixture).read_text(encoding="utf-8"))
        return lambda case, level: outputs.get(case["id"], {}).get(level, "")
    try:
        from app.services.claude_service import paraphrase  # Day 7 에서 만든다
    except ImportError:
        sys.exit("app.services.claude_service.paraphrase 가 아직 없습니다(Day 7). --fixture 로 저장된 답을 채점하세요.")
    return lambda case, level: paraphrase(case["term"], level, case["context"])


def main() -> int:
    parser = argparse.ArgumentParser(description="SAGE paraphrase 평가")
    parser.add_argument("--fixture", help="저장된 답 JSON 경로 {case_id: {level: text}}")
    parser.add_argument("--min-pass", type=float, default=0.9)
    args = parser.parse_args()

    generate = load_generator(args.fixture)
    cases = json.loads(CASES_PATH.read_text(encoding="utf-8"))["cases"]

    total = passed = 0
    for case in cases:
        for level in LEVELS:
            total += 1
            reasons = grade(generate(case, level), level, case)
            mark = "PASS" if not reasons else "FAIL"
            passed += not reasons
            print(f"[{mark}] {case['term']:<6} {level:<12} {'; '.join(reasons)}")

    rate = passed / total if total else 0
    print(f"\n통과 {passed}/{total} ({rate:.0%}) — 기준 {args.min_pass:.0%}")
    return 0 if rate >= args.min_pass else 1


if __name__ == "__main__":
    sys.exit(main())
