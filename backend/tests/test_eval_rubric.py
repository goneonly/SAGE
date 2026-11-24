# paraphrase 평가 루프의 채점 규칙이 실제로 나쁜 설명을 잡는지 확인한다(채점기 자체의 회귀 방지).
import json
from pathlib import Path

from evals.rubric import grade

CASES = {case["id"]: case for case in json.loads(Path("evals/cases.json").read_text(encoding="utf-8"))["cases"]}
FIXTURE = json.loads(Path("evals/fixtures/sample_outputs.json").read_text(encoding="utf-8"))


def test_sample_outputs_all_pass():
    for case_id, case in CASES.items():
        for level, text in FIXTURE[case_id].items():
            assert grade(text, level, case) == [], (case_id, level)


def test_investment_advice_is_caught():
    reasons = grade("지금 바로 매수하세요. 수익 보장!", "beginner", CASES["kospi"])
    assert any("투자 권유" in reason for reason in reasons)


def test_hard_words_in_beginner_are_caught():
    reasons = grade("시가총액 가중 방식의 지수예요.", "beginner", CASES["kospi"])
    assert any("어려운 말" in reason for reason in reasons)


def test_too_long_and_empty_are_caught():
    assert grade("가" * 200, "beginner", CASES["per"])
    assert grade("   ", "advanced", CASES["per"])
