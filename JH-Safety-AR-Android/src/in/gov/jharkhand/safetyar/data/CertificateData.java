package in.gov.jharkhand.safetyar.data;

import java.security.MessageDigest;

public class CertificateData {
    public String certificateId;
    public String workerName;
    public String workerId;
    public String sector;
    public String district;
    public String moduleId;
    public String moduleTitle;
    public float practicalScore;
    public float theoryScore;
    public float compositeScore;
    public String issueDate;
    public String verificationUrl;
    public String signatureHash;
    public boolean isValid = true;

    public static CertificateData generateForWorker(WorkerProfile worker, String moduleId, String moduleTitle, float practical, float theory) {
        CertificateData cert = new CertificateData();
        int randomSeq = 142 + (int)(Math.random() * 850);
        cert.certificateId = "JH-SAFE-2026-000" + randomSeq;
        cert.workerName = worker.fullName;
        cert.workerId = worker.workerId;
        cert.sector = worker.sector;
        cert.district = worker.district;
        cert.moduleId = moduleId;
        cert.moduleTitle = moduleTitle;
        cert.practicalScore = practical;
        cert.theoryScore = theory;
        cert.compositeScore = (practical * 0.6f) + (theory * 0.4f);
        cert.issueDate = "05-Sep-2026";
        cert.verificationUrl = "https://safety.jharkhand.gov.in/verify?id=" + cert.certificateId;
        cert.signatureHash = calculateSHA256(cert.certificateId + ":" + cert.workerId + ":" + cert.compositeScore);
        cert.isValid = true;
        return cert;
    }

    private static String calculateSHA256(String input) {
        try {
            MessageDigest digest = MessageDigest.getInstance("SHA-256");
            byte[] hash = digest.digest(input.getBytes("UTF-8"));
            StringBuilder hexString = new StringBuilder();
            for (byte b : hash) {
                String hex = Integer.toHexString(0xff & b);
                if (hex.length() == 1) hexString.append('0');
                hexString.append(hex);
            }
            return hexString.substring(0, 16).toUpperCase();
        } catch (Exception e) {
            return "JH-VALID-HASH-2026";
        }
    }
}
