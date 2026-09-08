using System;
using System.Collections.Generic;

namespace JHSafetyAR.Assessment
{
    [Serializable]
    public class QuestionItem
    {
        public string id;
        public int questionNumber;
        public string text;
        public string textHindi;
        public string textSantali;
        public List<string> options;
        public int correctIndex;
        public string explanation;
    }
}
