using JHSafetyAR.Data;

namespace JHSafetyAR.Assessment
{
    public static class ScoreCalculator
    {
        public static float CalculateAggregateScore(float practicalScore, float theoryScore)
        {
            float weightedScore = (practicalScore * AppConstants.PRACTICAL_WEIGHT) + (theoryScore * AppConstants.THEORY_WEIGHT);
            return (float)System.Math.Round(weightedScore, 1);
        }

        public static bool IsPassingScore(float aggregateScore)
        {
            return aggregateScore >= AppConstants.PASS_THRESHOLD_PERCENT;
        }
    }
}
