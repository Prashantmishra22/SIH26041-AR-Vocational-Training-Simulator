package in.gov.jharkhand.safetyar.data;

import java.util.ArrayList;
import java.util.List;

public class QuestionItem {
    public int id;
    public String question;
    public String questionHindi;
    public String questionSantali;
    public List<String> options = new ArrayList<>();
    public List<String> optionsHindi = new ArrayList<>();
    public List<String> optionsSantali = new ArrayList<>();
    public int correctIndex;
    public String explanation;
}
