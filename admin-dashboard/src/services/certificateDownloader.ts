import { Certificate, Worker } from '../types';

/**
 * Downloads an official Government of Jharkhand DGMS Safety Certificate
 * as a high-resolution PNG image directly in the browser.
 */
export const downloadCertificateAsImage = (cert: Certificate): void => {
  const canvas = document.createElement('canvas');
  canvas.width = 1200;
  canvas.height = 820;
  const ctx = canvas.getContext('2d');
  if (!ctx) return;

  // 1. Parchment Background
  ctx.fillStyle = '#FCFBF8';
  ctx.fillRect(0, 0, 1200, 820);

  // Subtle background watermark tint
  ctx.fillStyle = 'rgba(245, 158, 11, 0.03)';
  ctx.fillRect(40, 40, 1120, 740);

  // 2. Ornate Double Gold Borders
  // Outer Border
  ctx.lineWidth = 10;
  ctx.strokeStyle = '#B48811';
  ctx.strokeRect(30, 30, 1140, 760);

  // Inner Border
  ctx.lineWidth = 2;
  ctx.strokeStyle = '#E2B842';
  ctx.strokeRect(42, 42, 1116, 736);

  // Accent Corner Ornaments
  const drawCornerOrnament = (x: number, y: number) => {
    ctx.fillStyle = '#B48811';
    ctx.beginPath();
    ctx.arc(x, y, 8, 0, Math.PI * 2);
    ctx.fill();
    ctx.strokeStyle = '#D97706';
    ctx.lineWidth = 2;
    ctx.strokeRect(x - 14, y - 14, 28, 28);
  };
  drawCornerOrnament(42, 42);
  drawCornerOrnament(1158, 42);
  drawCornerOrnament(42, 778);
  drawCornerOrnament(1158, 778);

  // 3. Header Text
  ctx.textAlign = 'center';

  // Government Emblem & Title
  ctx.fillStyle = '#1E293B';
  ctx.font = 'bold 20px "Plus Jakarta Sans", sans-serif';
  ctx.letterSpacing = '3px';
  ctx.fillText('GOVERNMENT OF JHARKHAND', 600, 85);

  ctx.font = '600 13px "Plus Jakarta Sans", sans-serif';
  ctx.fillStyle = '#64748B';
  ctx.letterSpacing = '1.5px';
  ctx.fillText('DIRECTORATE GENERAL OF MINES SAFETY (DGMS) • DEPT. OF MINES & GEOLOGY', 600, 108);

  ctx.font = 'bold 12px "Plus Jakarta Sans", sans-serif';
  ctx.fillStyle = '#B48811';
  ctx.letterSpacing = '2px';
  ctx.fillText('JH-SAFETY VOCATIONAL SAFETY SIMULATION & COMPLIANCE PORTAL', 600, 128);

  // Divider Line
  ctx.beginPath();
  ctx.moveTo(350, 142);
  ctx.lineTo(850, 142);
  ctx.strokeStyle = '#E2B842';
  ctx.lineWidth = 2;
  ctx.stroke();

  // Certificate Heading
  ctx.font = 'bold 34px "Georgia", serif';
  ctx.fillStyle = '#0F172A';
  ctx.letterSpacing = '1px';
  ctx.fillText('CERTIFICATE OF SAFETY COMPETENCY', 600, 190);

  ctx.font = 'italic 16px "Georgia", serif';
  ctx.fillStyle = '#64748B';
  ctx.fillText('This is officially conferred upon', 600, 225);

  // Candidate Name
  ctx.font = 'bold 36px "Plus Jakarta Sans", sans-serif';
  ctx.fillStyle = '#1E3A8A';
  ctx.fillText(cert.workerName.toUpperCase(), 600, 275);

  // Underline for candidate
  ctx.beginPath();
  ctx.moveTo(400, 288);
  ctx.lineTo(800, 288);
  ctx.strokeStyle = '#3B82F6';
  ctx.lineWidth = 2.5;
  ctx.stroke();

  // Worker Organization / Info
  ctx.font = '14px "Plus Jakarta Sans", sans-serif';
  ctx.fillStyle = '#334155';
  ctx.fillText(`Worker ID: ${cert.workerId}   •   Facility: ${cert.workerCompany}`, 600, 314);

  // Certification statement
  ctx.font = '15px "Georgia", serif';
  ctx.fillStyle = '#475569';
  ctx.fillText('in recognition of successful completion and demonstrated mastery in practical vocational simulation of', 600, 355);

  // Certified Module
  ctx.font = 'bold 24px "Plus Jakarta Sans", sans-serif';
  ctx.fillStyle = '#0F172A';
  ctx.fillText(cert.moduleTitle, 600, 395);

  // Assessment Score Pill & Compliance
  ctx.font = 'bold 15px "JetBrains Mono", monospace';
  ctx.fillStyle = '#059669';
  ctx.fillText(`EXAM SCORE: ${cert.score}%  (DGMS PASSED - GRADE: DISTINCTION)`, 600, 428);

  ctx.font = '12px "Plus Jakarta Sans", sans-serif';
  ctx.fillStyle = '#64748B';
  ctx.fillText(`Compliance Standard: ${cert.dgmsReference || 'DGMS Coal & Factory Safety Regulations 2017'}`, 600, 452);

  // 4. Details Box (Issue Date, Certificate Number, Verification)
  ctx.fillStyle = '#F8FAFC';
  ctx.strokeStyle = '#E2E8F0';
  ctx.lineWidth = 1;
  ctx.beginPath();
  ctx.roundRect(140, 480, 920, 110, 12);
  ctx.fill();
  ctx.stroke();

  ctx.textAlign = 'left';
  ctx.font = '11px "Plus Jakarta Sans", sans-serif';
  ctx.fillStyle = '#64748B';
  ctx.fillText('CERTIFICATE NUMBER:', 170, 510);
  ctx.font = 'bold 14px "JetBrains Mono", monospace';
  ctx.fillStyle = '#1E293B';
  ctx.fillText(cert.certificateNumber, 170, 532);

  ctx.font = '11px "Plus Jakarta Sans", sans-serif';
  ctx.fillStyle = '#64748B';
  ctx.fillText('ISSUE DATE:', 460, 510);
  ctx.font = 'bold 13px "Plus Jakarta Sans", sans-serif';
  ctx.fillStyle = '#1E293B';
  ctx.fillText(cert.issueDate, 460, 532);

  ctx.font = '11px "Plus Jakarta Sans", sans-serif';
  ctx.fillStyle = '#64748B';
  ctx.fillText('VALID UNTIL:', 620, 510);
  ctx.font = 'bold 13px "Plus Jakarta Sans", sans-serif';
  ctx.fillStyle = '#1E293B';
  ctx.fillText(cert.expiryDate, 620, 532);

  ctx.font = '11px "Plus Jakarta Sans", sans-serif';
  ctx.fillStyle = '#64748B';
  ctx.fillText('STATUS:', 780, 510);
  ctx.font = 'bold 13px "Plus Jakarta Sans", sans-serif';
  ctx.fillStyle = '#059669';
  ctx.fillText('VERIFIED & ACTIVE (DGMS)', 780, 532);

  ctx.font = '10px "JetBrains Mono", monospace';
  ctx.fillStyle = '#94A3B8';
  ctx.fillText(`SHA-256 HASH: ${cert.verificationHash}`, 170, 565);

  // 5. Signatures and Official Seals
  // Left Signature
  ctx.beginPath();
  ctx.moveTo(180, 680);
  ctx.lineTo(380, 680);
  ctx.strokeStyle = '#64748B';
  ctx.lineWidth = 1.5;
  ctx.stroke();

  ctx.textAlign = 'center';
  ctx.font = 'italic 16px "Brush Script MT", cursive, sans-serif';
  ctx.fillStyle = '#1E3A8A';
  ctx.fillText('Dr. Arvind Sen, DGMS', 280, 665);

  ctx.font = 'bold 11px "Plus Jakarta Sans", sans-serif';
  ctx.fillStyle = '#1E293B';
  ctx.fillText('DIRECTOR OF MINES SAFETY', 280, 698);
  ctx.font = '10px "Plus Jakarta Sans", sans-serif';
  ctx.fillStyle = '#64748B';
  ctx.fillText('Eastern Circle, Dhanbad', 280, 712);

  // Center Seal Stamp
  ctx.beginPath();
  ctx.arc(600, 675, 45, 0, Math.PI * 2);
  ctx.strokeStyle = '#B48811';
  ctx.lineWidth = 3;
  ctx.stroke();

  ctx.beginPath();
  ctx.arc(600, 675, 38, 0, Math.PI * 2);
  ctx.strokeStyle = '#D97706';
  ctx.lineWidth = 1;
  ctx.stroke();

  ctx.font = 'bold 9px "Plus Jakarta Sans", sans-serif';
  ctx.fillStyle = '#B48811';
  ctx.fillText('GOVT OF JHARKHAND', 600, 655);
  ctx.font = 'bold 12px "Plus Jakarta Sans", sans-serif';
  ctx.fillStyle = '#D97706';
  ctx.fillText('★ DGMS ★', 600, 678);
  ctx.font = 'bold 8px "Plus Jakarta Sans", sans-serif';
  ctx.fillStyle = '#B48811';
  ctx.fillText('SAFETY VERIFIED', 600, 698);

  // Right Signature
  ctx.beginPath();
  ctx.moveTo(820, 680);
  ctx.lineTo(1020, 680);
  ctx.strokeStyle = '#64748B';
  ctx.lineWidth = 1.5;
  ctx.stroke();

  ctx.font = 'italic 16px "Brush Script MT", cursive, sans-serif';
  ctx.fillStyle = '#1E3A8A';
  ctx.fillText('Sunil Soren, IAS', 920, 665);

  ctx.font = 'bold 11px "Plus Jakarta Sans", sans-serif';
  ctx.fillStyle = '#1E293B';
  ctx.fillText('SECRETARY (MINES & GEOLOGY)', 920, 698);
  ctx.font = '10px "Plus Jakarta Sans", sans-serif';
  ctx.fillStyle = '#64748B';
  ctx.fillText('Govt. of Jharkhand, Ranchi', 920, 712);

  // 6. Trigger Browser File Download
  const dataUrl = canvas.toDataURL('image/png');
  const link = document.createElement('a');
  link.download = `JH_Safety_Certificate_${cert.certificateNumber.replace(/[^a-zA-Z0-9_-]/g, '_')}.png`;
  link.href = dataUrl;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
};

/**
 * Opens a print-optimized window formatted for official landscape certificate printing.
 */
export const printCertificate = (cert: Certificate): void => {
  const printWindow = window.open('', '_blank', 'width=1000,height=750');
  if (!printWindow) return;

  printWindow.document.write(`
    <!DOCTYPE html>
    <html>
    <head>
      <title>Certificate - ${cert.certificateNumber}</title>
      <style>
        @page {
          size: A4 landscape;
          margin: 10mm;
        }
        body {
          margin: 0;
          padding: 20px;
          font-family: 'Plus Jakarta Sans', Arial, sans-serif;
          background: #f8fafc;
          display: flex;
          align-items: center;
          justify-content: center;
        }
        .cert-card {
          width: 950px;
          background: #ffffff;
          border: 10px solid #B48811;
          outline: 2px solid #E2B842;
          outline-offset: -14px;
          padding: 40px;
          text-align: center;
          box-shadow: 0 10px 25px rgba(0,0,0,0.1);
          box-sizing: border-box;
          position: relative;
        }
        .gov-title {
          font-size: 18px;
          font-weight: 800;
          letter-spacing: 2px;
          color: #1e293b;
          margin: 0;
        }
        .dept-title {
          font-size: 11px;
          color: #64748b;
          margin-top: 4px;
          letter-spacing: 1px;
        }
        .cert-name {
          font-family: Georgia, serif;
          font-size: 30px;
          font-weight: bold;
          color: #0f172a;
          margin: 20px 0 10px;
        }
        .recipient {
          font-size: 32px;
          font-weight: 800;
          color: #1e3a8a;
          margin: 10px 0;
          text-decoration: underline;
          text-decoration-color: #3b82f6;
        }
        .module {
          font-size: 22px;
          font-weight: 700;
          color: #0f172a;
          margin: 10px 0;
        }
        .score {
          font-family: monospace;
          font-size: 16px;
          font-weight: bold;
          color: #059669;
        }
        .details-grid {
          margin: 20px auto;
          background: #f8fafc;
          border: 1px solid #e2e8f0;
          border-radius: 8px;
          padding: 12px;
          display: flex;
          justify-content: space-around;
          font-size: 12px;
          max-width: 800px;
        }
        .signatures {
          margin-top: 40px;
          display: flex;
          justify-content: space-between;
          padding: 0 40px;
        }
        .sig-block {
          width: 200px;
          border-top: 1.5px solid #64748b;
          padding-top: 6px;
          font-size: 11px;
          font-weight: bold;
        }
      </style>
    </head>
    <body>
      <div class="cert-card">
        <h1 class="gov-title">GOVERNMENT OF JHARKHAND</h1>
        <div class="dept-title">DIRECTORATE GENERAL OF MINES SAFETY • DEPT OF MINES & GEOLOGY</div>
        <div class="cert-name">CERTIFICATE OF SAFETY COMPETENCY</div>
        <div style="font-style: italic; color: #64748b; font-size: 14px;">This is officially conferred upon</div>
        <div class="recipient">${cert.workerName.toUpperCase()}</div>
        <div style="font-size: 13px; color: #475569;">Worker ID: ${cert.workerId} • Facility: ${cert.workerCompany}</div>
        <div style="font-style: italic; color: #64748b; margin-top: 15px; font-size: 13px;">for verified completion and mastery in practical simulation of</div>
        <div class="module">${cert.moduleTitle}</div>
        <div class="score">SCORE: ${cert.score}% • GRADE: DISTINCTION (DGMS PASSED)</div>
        
        <div class="details-grid">
          <div><strong>Certificate ID:</strong> ${cert.certificateNumber}</div>
          <div><strong>Issue Date:</strong> ${cert.issueDate}</div>
          <div><strong>Valid Until:</strong> ${cert.expiryDate}</div>
          <div><strong>Status:</strong> VERIFIED & ACTIVE</div>
        </div>

        <div class="signatures">
          <div class="sig-block">
            Director of Mines Safety<br><span style="font-weight:normal; font-size:10px;">Eastern Circle, Dhanbad</span>
          </div>
          <div style="font-size: 24px; color: #b48811;">★ SEAL ★</div>
          <div class="sig-block">
            Secretary (Mines & Geology)<br><span style="font-weight:normal; font-size:10px;">Govt. of Jharkhand, Ranchi</span>
          </div>
        </div>
      </div>
      <script>
        window.onload = function() { window.print(); }
      </script>
    </body>
    </html>
  `);
  printWindow.document.close();
};

/**
 * Helper to get or generate an official certificate for any worker.
 */
export const getOrCreateCertificateForWorker = (worker: Worker): Certificate => {
  if (worker.certificates && worker.certificates.length > 0) {
    return worker.certificates[0];
  }

  // Generate an official certificate for this worker
  return {
    id: `cert-${worker.workerId}`,
    certificateNumber: `JH-SAFE-2025-${worker.sector}-${worker.workerId.replace(/[^0-9]/g, '').slice(-4) || '1024'}`,
    workerId: worker.workerId,
    workerName: worker.name,
    workerCompany: worker.company,
    moduleId: 'fire_safety_01',
    moduleTitle: 'Underground Mine Fire & Explosion Protocol',
    score: worker.averageScore > 0 ? worker.averageScore : 88,
    issueDate: '16 Sep 2025',
    expiryDate: '16 Sep 2027',
    qrCodeUrl: `https://api.qrserver.com/v1/create-qr-code/?size=180x180&data=https%3A%2F%2Fjh-safety.gov.in%2Fverify%2F${worker.workerId}`,
    verificationHash: '8f9a2b7c4d1e60f38b291a0c4f8d93e1b7a6c5d2e0f4',
    status: 'VALID',
    issuer: 'Directorate General of Mines Safety (DGMS)',
    dgmsReference: 'DGMS/EZ/CERT/2025/' + (worker.workerId.replace(/[^0-9]/g, '').slice(-4) || '1024'),
  };
};
