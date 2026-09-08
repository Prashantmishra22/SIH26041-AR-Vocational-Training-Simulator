"""Assessment scoring service."""


def calculate_score(correct_answers: int, total_questions: int = 10, points_per_question: int = 10) -> dict:
    """
    Calculate assessment score.
    
    Returns:
        dict with score, percentage, passed, correct, incorrect
    """
    score = correct_answers * points_per_question
    total = total_questions * points_per_question
    percentage = round((score / total) * 100) if total > 0 else 0
    passed = percentage >= 70  # 70% passing threshold

    return {
        "score": score,
        "percentage": percentage,
        "passed": passed,
        "correct_answers": correct_answers,
        "incorrect_answers": total_questions - correct_answers,
        "total_questions": total_questions,
        "recommendation": "Certified" if passed else "Please complete the training again before attempting certification."
    }


def calculate_combined_score(ar_score: int, knowledge_score: int) -> dict:
    """
    Calculate combined score from AR practical training and knowledge assessment.
    AR score is weighted 40%, knowledge score 60%.
    """
    combined = round(ar_score * 0.4 + knowledge_score * 0.6)
    passed = combined >= 70

    return {
        "ar_score": ar_score,
        "knowledge_score": knowledge_score,
        "combined_score": combined,
        "passed": passed,
        "recommendation": "Certified" if passed else "Please retrain and reattempt."
    }
