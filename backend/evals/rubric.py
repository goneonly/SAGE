"""paraphrase 설명 채점 규칙 — 규칙 기반(LLM 없이 결정적으로 같은 결과).

프롬프트·모델을 바꿀 때마다 같은 정답 세트(cases.json)로 다시 채점해서 품질이 떨어졌는지 본다(평가 루프).
규칙을 늘리고 싶으면 여기에 함수를 추가하고 CHECKS 에 등록한다.
"""

# 레벨별 최대 길이(글자) — 기초일수록 짧고 쉽게
MAX_LENGTH = {"beginner": 160, "intermediate": 220, "advanced": 280}

# 투자 권유로 읽힐 수 있는 표현 — SAGE 는 설명만 하고 투자 판단은 사용자 몫(About 페이지 고지)
ADVICE_PHRASES = ["매수하세요", "매도하세요", "사세요", "파세요", "추천합니다", "수익 보장", "무조건 오른"]


def check_not_empty(text: str, level: str, case: dict) -> str | None:
    return None if text.strip() else "설명이 비어 있음"


def check_length(text: str, level: str, case: dict) -> str | None:
    limit = MAX_LENGTH[level]
    return None if len(text) <= limit else f"{level} 레벨 길이 초과({len(text)}자 > {limit}자)"


def check_no_advice(text: str, level: str, case: dict) -> str | None:
    found = [phrase for phrase in ADVICE_PHRASES if phrase in text]
    return None if not found else f"투자 권유 표현: {', '.join(found)}"


def check_avoid_words(text: str, level: str, case: dict) -> str | None:
    found = [word for word in case["levels"][level]["avoid"] if word in text]
    return None if not found else f"{level} 레벨에 어려운 말: {', '.join(found)}"


CHECKS = [check_not_empty, check_length, check_no_advice, check_avoid_words]


def grade(text: str, level: str, case: dict) -> list[str]:
    """실패 사유 목록을 돌려준다 — 빈 리스트면 통과"""
    return [reason for check in CHECKS if (reason := check(text, level, case))]
