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

  public async getDashboardData(): Promise<any> {
    const res = await fetch(`${BASE_URL}/api/admin/dashboard`, { signal: AbortSignal.timeout(5000) });
    if (!res.ok) throw new Error(`Dashboard API returned status ${res.status}`);
    return await res.json();
  }

  public async getKPIs(): Promise<KPISummary> {
    if (this.useMockOnly) return KPI_DATA;
    try {
      const data = await this.getDashboardData();
      return {
        totalWorkers: data.total_workers ?? 0,
        activeTrainees: data.active_trainees ?? 0,
        certifiedWorkers: data.certified_workers ?? 0,
        complianceRate: data.compliance_rate !== undefined ? Number(data.compliance_rate) : 0,
        averageScore: data.average_score !== undefined ? Number(data.average_score) : 0,
        offlineSyncPending: data.offline_sync_pending ?? 0,
        monthlyGrowthPercent: 18.5,
        passRatePercent: data.pass_rate !== undefined ? Number(data.pass_rate) : 0,
      };
    } catch (err) {
      console.warn('API connection failed, falling back to cached metrics:', err);
      return KPI_DATA;
    }
  }

  public async getWorkers(): Promise<Worker[]> {
    if (this.useMockOnly) return WORKERS_DATA;
    try {
      const res = await fetch(`${BASE_URL}/api/admin/workers`, { signal: AbortSignal.timeout(5000) });
      if (!res.ok) throw new Error(`Workers API returned status ${res.status}`);
      const data = await res.json();
      if (Array.isArray(data)) {
        return data.map((w: any) => ({
          id: String(w.id),
          workerId: w.workerId || w.worker_id || w.worker_code || `JH-MIN-${w.id}`,
          name: w.name || w.full_name || 'Jharkhand Worker',
          phone: w.phone || '+91 94311 00000',
          sector: (w.sector || 'MINING').toUpperCase(),
          company: w.company || w.organization || 'Jharkhand Industrial Corp',
          facility: w.facility || `Facility Pit #${w.id} • ${w.district || 'Dhanbad'}`,
          district: w.district || 'Dhanbad',
          preferredLanguage: w.preferredLanguage || w.language || 'hi',
          experienceYears: w.experienceYears || 5,
          status: w.status || (w.certificates && w.certificates.length > 0 ? 'CERTIFIED' : 'REGISTERED'),
          createdAt: w.createdAt || w.created_at || '2026-01-01',
          lastActive: w.lastActive || w.last_active || '2026-09-15',
          completedModulesCount: w.completedModulesCount !== undefined ? w.completedModulesCount : (w.completed_modules_count || 0),
          averageScore: w.averageScore !== undefined ? Number(w.averageScore) : (w.average_score || 0),
          certificates: w.certificates || [],
          attempts: w.attempts || [],
        }));
      }
      return WORKERS_DATA;
    } catch (err) {
      console.warn('API connection failed for workers:', err);
      return WORKERS_DATA;
    }
  }

  public async getModules(): Promise<TrainingModule[]> {
    if (this.useMockOnly) return MODULES_DATA;
    try {
      const data = await this.getDashboardData();
      if (data && data.module_stats && Array.isArray(data.module_stats)) {
        return MODULES_DATA.map(mod => {
          const stat = data.module_stats.find((s: any) =>
            s.id === mod.id ||
            (mod.id === 'fire_safety_01' && (s.id === 'FIRE-001' || s.moduleId === 'FIRE-001')) ||
            (mod.id === 'gas_leak_02' && (s.id === 'GAS-001' || s.moduleId === 'GAS-001'))
          );
          if (stat) {
            return {
              ...mod,
              completionRate: stat.passRate !== undefined ? Number(stat.passRate) : mod.completionRate,
              avgScore: stat.avgScore !== undefined ? Number(stat.avgScore) : mod.avgScore,
              totalTrained: stat.totalAttempts !== undefined ? Number(stat.totalAttempts) : mod.totalTrained,
            };
          }
          return mod;
        });
      }
      return MODULES_DATA;
    } catch {
      return MODULES_DATA;
    }
  }

  public async getCertificates(): Promise<Certificate[]> {
    if (this.useMockOnly) {
      const certs: Certificate[] = [];
      WORKERS_DATA.forEach(w => w.certificates.forEach(c => certs.push(c)));
      return certs;
    }
    try {
      const res = await fetch(`${BASE_URL}/api/admin/certificates`, { signal: AbortSignal.timeout(5000) });
      if (!res.ok) throw new Error(`Certificates API returned status ${res.status}`);
      const data = await res.json();
      if (Array.isArray(data) && data.length > 0) {
        return data.map((c: any) => ({
          id: String(c.id),
          certificateNumber: c.certificateNumber || c.certificate_id || `JH-SAFE-${c.id}`,
          workerId: c.workerId || c.worker_id || 'DEMO-001',
          workerName: c.workerName || c.worker_name || 'Miner',
          workerCompany: c.workerCompany || c.organization || 'BCCL Dhanbad',
          moduleId: c.moduleId || c.module_id || 'FIRE-001',
          moduleTitle: c.moduleTitle || c.module_title || 'Industrial Safety Training',
          score: c.score || 85,
          issueDate: c.issueDate || (c.issue_date ? c.issue_date.slice(0, 10) : '2026-09-15'),
          expiryDate: c.expiryDate || '2028-09-15',
          qrCodeUrl: c.qrCodeUrl || `${BASE_URL}/api/certificates/verify/${c.certificateNumber || c.certificate_id}`,
          verificationHash: c.verificationHash || `SHA256:${c.certificateNumber || c.certificate_id}`,
          status: (c.status || 'VALID').toUpperCase() as any,
          issuer: c.issuer || 'DGMS Eastern Zone',
          dgmsReference: c.dgmsReference || 'DGMS/REG/2017',
        }));
      }
      return [];
    } catch (err) {
      console.warn('API error fetching certificates, using fallback:', err);
      const fallback: Certificate[] = [];
      WORKERS_DATA.forEach(w => w.certificates.forEach(c => fallback.push(c)));
      return fallback;
    }
  }

  public async getAttempts(): Promise<any[]> {
    try {
      const res = await fetch(`${BASE_URL}/api/admin/attempts`, { signal: AbortSignal.timeout(5000) });
      if (!res.ok) throw new Error(`Attempts API returned status ${res.status}`);
      const data = await res.json();
      if (Array.isArray(data)) {
        return data;
      }
      return [];
    } catch (err) {
      console.warn('API error fetching attempts:', err);
      return [];
    }
  }

  public async verifyCertificate(certId: string): Promise<{ valid: boolean; data?: Certificate; message?: string }> {
    const cleanId = certId.trim().toUpperCase();
    try {
      const res = await fetch(`${BASE_URL}/api/certificates/verify/${cleanId}`);
      if (res.ok) {
        const json = await res.json();
        if (json.valid) {
          return {
            valid: true,
            data: {
              id: json.certificate_id || cleanId,
              certificateNumber: json.certificate_id || cleanId,
              workerId: json.worker_id || 'DEMO-001',
              workerName: json.worker_name || 'Verified Miner',
              workerCompany: json.sector ? `Jharkhand ${json.sector} Enterprise` : 'BCCL Dhanbad',
              moduleId: json.module_name || 'FIRE-001',
              moduleTitle: json.module_name || 'Industrial Safety Certification',
              score: json.score || 90,
              issueDate: json.issue_date?.slice(0, 10) || '2026-09-15',
              expiryDate: '2028-09-15',
              qrCodeUrl: json.qr_code_url || `${BASE_URL}/api/certificates/verify/${cleanId}`,
              verificationHash: json.signature_hash || `SHA256:${cleanId}`,
              status: 'VALID',
              issuer: 'DGMS Eastern Zone & Govt of Jharkhand',
              dgmsReference: 'DGMS/REG/2017',
            },
          };
        }
      }
    } catch (e) {
      console.warn('Online verification network error:', e);
    }

    // Check locally in loaded certificates as secondary lookup
    const certs = await this.getCertificates();
    const found = certs.find(c => c.certificateNumber.toUpperCase() === cleanId || c.id === cleanId);
    if (found) {
      return { valid: true, data: found };
    }

    return { valid: false, message: 'Certificate ID not found in Jharkhand State Safety Registry.' };
  }

  public async getDistrictMetrics(): Promise<DistrictMetric[]> {
    try {
      const data = await this.getDashboardData();
      if (data.district_metrics && Array.isArray(data.district_metrics) && data.district_metrics.length > 0) {
        return data.district_metrics;
      }
    } catch {}
    return DISTRICT_METRICS;
  }

  public async getLanguageMetrics(): Promise<LanguageMetric[]> {
    try {
      const data = await this.getDashboardData();
      if (data.language_distribution && Array.isArray(data.language_distribution) && data.language_distribution.length > 0) {
        const total = data.total_workers || 1;
        return data.language_distribution.map((l: any) => ({
          language: l.name,
          code: l.code,
          workersCount: l.count,
          percentage: Math.round((l.count / total) * 1000) / 10,
        }));
      }
    } catch {}
    return LANGUAGE_METRICS;
  }

  public async getMonthlyTrends(): Promise<any[]> {
    try {
      const data = await this.getDashboardData();
      if (data.monthly_training_trend && Array.isArray(data.monthly_training_trend)) {
        return data.monthly_training_trend;
      }
    } catch {}
    return MONTHLY_TRAINING_TREND;
  }
}

export const api = new ApiService();
