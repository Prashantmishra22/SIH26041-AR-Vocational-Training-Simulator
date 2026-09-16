package in.gov.jharkhand.safetyar.data;

public class WorkerProfile {
    public String workerId = "JH1024";
    public String fullName = "Prashant Mishra";
    public String sector = "Mining (Coal & Iron)";
    public String district = "Dhanbad";
    public String employer = "Bharat Coking Coal Limited (BCCL)";
    public int trainingProgressPercent = 65;
    public int completedModulesCount = 4;
    public int totalModulesCount = 6;
    public float latestScorePercent = 91.5f;
    public int certificatesCount = 1;
    public boolean isOffline = false;
    public String selectedLanguage = "en"; // default to English

    public static WorkerProfile createDefaultDemoUser() {
        WorkerProfile p = new WorkerProfile();
        p.workerId = "JH1024";
        p.fullName = "Prashant Mishra";
        p.sector = "Mining (Coal & Iron)";
        p.district = "Dhanbad";
        p.employer = "Bharat Coking Coal Limited (BCCL)";
        p.trainingProgressPercent = 65;
        p.completedModulesCount = 4;
        p.totalModulesCount = 6;
        p.latestScorePercent = 91.5f;
        p.certificatesCount = 1;
        p.isOffline = false;
        p.selectedLanguage = "en";
        return p;
    }
}
