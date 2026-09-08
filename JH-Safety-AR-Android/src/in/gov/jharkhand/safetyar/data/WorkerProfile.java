package in.gov.jharkhand.safetyar.data;

public class WorkerProfile {
    public String workerId = "DEMO-001";
    public String fullName = "Rahul Kumar";
    public String sector = "Mining (Coal & Iron)";
    public String district = "Dhanbad";
    public String employer = "Bharat Coking Coal Limited (BCCL)";
    public int trainingProgressPercent = 40;
    public int completedModulesCount = 2;
    public int pendingModulesCount = 3;
    public float latestScorePercent = 91.5f;
    public int certificatesCount = 1;
    public boolean isOffline = true;
    public String selectedLanguage = "hi"; // default to Hindi

    public static WorkerProfile createDefaultDemoUser() {
        WorkerProfile p = new WorkerProfile();
        p.workerId = "DEMO-001";
        p.fullName = "Rahul Kumar";
        p.sector = "Mining (Coal & Iron)";
        p.district = "Dhanbad";
        p.employer = "Bharat Coking Coal Limited (BCCL)";
        p.trainingProgressPercent = 40;
        p.completedModulesCount = 2;
        p.pendingModulesCount = 3;
        p.latestScorePercent = 91.5f;
        p.certificatesCount = 1;
        p.isOffline = true;
        p.selectedLanguage = "hi";
        return p;
    }
}
