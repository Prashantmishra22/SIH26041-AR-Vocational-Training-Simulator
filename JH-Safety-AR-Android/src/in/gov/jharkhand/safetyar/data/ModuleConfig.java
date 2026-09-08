package in.gov.jharkhand.safetyar.data;

import java.util.ArrayList;
import java.util.List;

public class ModuleConfig {
    public String id;
    public String title;
    public String titleHindi;
    public String titleSantali;
    public String sector;
    public String difficulty;
    public int estimatedMinutes;
    public int passThreshold = 70;
    public String complianceStandard;
    public List<CartoonLesson> cartoonLessons = new ArrayList<>();
    public List<ARTask> arTasks = new ArrayList<>();

    public static class CartoonLesson {
        public int step;
        public String title;
        public String titleHindi;
        public String titleSantali;
        public String description;
        public String descriptionHindi;
        public String descriptionSantali;
        public String dialogue;
        public String dialogueHindi;
        public String dialogueSantali;
    }

    public static class ARTask {
        public int step;
        public String title;
        public String instruction;
        public String instructionHindi;
        public String instructionSantali;
        public String targetObject;
        public int points = 10;
    }
}
