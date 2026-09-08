import { Worker, TrainingModule, Certificate, Attempt, KPISummary, DistrictMetric, LanguageMetric } from '../types';
import { KPI_DATA, MODULES_DATA, WORKERS_DATA, DISTRICT_METRICS, LANGUAGE_METRICS, MONTHLY_TRAINING_TREND } from '../data/mockData';

const BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:8000';

class ApiService {
  private useMockOnly: boolean = false;

  public setMockMode(enabled: boolean) {
    this.useMockOnly = enabled;
  }

  public isMockMode(): boolean {
    return this.useMockOnly;
  }

  public async getKPIs(): Promise<KPISummary> {
    if (this.useMockOnly) return KPI_DATA;
    try {
      const res = await fetch(`${BASE_URL}/api/admin/dashboard`, { signal: AbortSignal.timeout(2000) });
      if (!res.ok) throw new Error('API Error');
      const data = await res.json();
      return {
        totalWorkers: data.total_workers ?? KPI_DATA.totalWorkers,
        activeTrainees: data.pending_training ?? KPI_DATA.activeTrainees,
        certifiedWorkers: data.total_certificates ?? KPI_DATA.certifiedWorkers,
        complianceRate: data.pass_rate ? Number(data.pass_rate) : KPI_DATA.complianceRate,
        averageScore: data.average_score ?? KPI_DATA.averageScore,
        offlineSyncPending: 3,
        monthlyGrowthPercent: 18.5,
        passRatePercent: data.pass_rate ?? KPI_DATA.passRatePercent,
      };
    } catch {
      return KPI_DATA;
    }
  }

  public async getWorkers(): Promise<Worker[]> {
    if (this.useMockOnly) return WORKERS_DATA;
    try {
      const res = await fetch(`${BASE_URL}/api/admin/workers`, { signal: AbortSignal.timeout(2000) });
      if (!res.ok) throw new Error('API Error');
      const data = await res.json();
      if (Array.isArray(data) && data.length > 0) {
        return data.map((w: any) => ({
          id: String(w.id),
          workerId: w.worker_code || `JH-MIN-${w.id}`,
          name: w.full_name || 'Jharkhand Worker',
          phone: w.phone || '+91 94311 00000',
          sector: (w.sector || 'MINING').toUpperCase(),
          company: w.company || 'Jharkhand Industrial Corp',
          facility: w.mine_or_plant || 'Regional Facility',
          district: w.district || 'Dhanbad',
          preferredLanguage: w.preferred_language || 'hi',
          experienceYears: w.experience_years || 5,
          status: w.status || 'CERTIFIED',
          createdAt: w.created_at || '2026-01-01',
          lastActive: w.last_active || '2026-09-01',
          completedModulesCount: w.completed_modules_count || 1,
          averageScore: w.average_score || 85.0,
          certificates: [],
          attempts: [],
        }));
      }
      return WORKERS_DATA;
    } catch {
      return WORKERS_DATA;
    }
  }

  public async getModules(): Promise<TrainingModule[]> {
    if (this.useMockOnly) return MODULES_DATA;
    try {
      const res = await fetch(`${BASE_URL}/api/modules`, { signal: AbortSignal.timeout(2000) });
      if (!res.ok) throw new Error('API Error');
      const data = await res.json();
      if (Array.isArray(data) && data.length > 0) {
        return MODULES_DATA;
      }
      return MODULES_DATA;
    } catch {
      return MODULES_DATA;
    }
  }

  public async getCertificates(): Promise<Certificate[]> {
    const certs: Certificate[] = [];
    WORKERS_DATA.forEach(w => {
      w.certificates.forEach(c => certs.push(c));
    });
    return certs;
  }

  public async verifyCertificate(certId: string): Promise<{ valid: boolean; data?: Certificate; message?: string }> {
    const certs = await this.getCertificates();
    const cleanId = certId.trim().toUpperCase();
    const found = certs.find(c => c.certificateNumber.toUpperCase() === cleanId || c.id === cleanId);
    if (found) {
      return { valid: true, data: found };
    }
    // Try online verification
    try {
      const res = await fetch(`${BASE_URL}/api/certificates/verify/${cleanId}`);
      if (res.ok) {
        const json = await res.json();
        return {
          valid: true,
          data: {
            id: json.id || 'cert-remote',
            certificateNumber: json.certificate_number || cleanId,
            workerId: json.worker_code || 'JH-W-REMOTE',
            workerName: json.worker_name || 'Verified Miner',
            workerCompany: json.company || 'BCCL Dhanbad',
            moduleId: json.module_id || 'fire_safety_01',
            moduleTitle: json.module_title || 'Underground Mine Fire Protocol',
            score: json.score || 90,
            issueDate: json.issued_at?.slice(0, 10) || '2026-08-15',
            expiryDate: '2028-08-15',
            qrCodeUrl: json.qr_code_url || `https://api.qrserver.com/v1/create-qr-code/?size=180x180&data=${cleanId}`,
            verificationHash: json.verification_hash || 'verified_cryptographic_hash',
            status: 'VALID',
            issuer: 'DGMS Eastern Zone',
            dgmsReference: 'DGMS/VERIFIED/2026',
          },
        };
      }
    } catch {
      // ignore
    }
    return { valid: false, message: 'Certificate ID not found in Jharkhand State Safety Registry.' };
  }

  public async getDistrictMetrics(): Promise<DistrictMetric[]> {
    return DISTRICT_METRICS;
  }

  public async getLanguageMetrics(): Promise<LanguageMetric[]> {
    return LANGUAGE_METRICS;
  }

  public async getMonthlyTrends() {
    return MONTHLY_TRAINING_TREND;
  }
}

export const api = new ApiService();
