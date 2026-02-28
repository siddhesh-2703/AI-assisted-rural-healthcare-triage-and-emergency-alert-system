import jsPDF from 'jspdf';
import type { AnalysisResult } from '../App';

function buildMedicalReportPDF(result: AnalysisResult): jsPDF {
  const doc = new jsPDF();
  
  const pageWidth = doc.internal.pageSize.getWidth();
  const pageHeight = doc.internal.pageSize.getHeight();
  const margin = 20;
  let yPosition = 20;

  // Header with gradient background (simulated with colored rectangle)
  doc.setFillColor(59, 130, 246); // Blue color
  doc.rect(0, 0, pageWidth, 40, 'F');
  
  // Title
  doc.setTextColor(255, 255, 255);
  doc.setFontSize(24);
  doc.setFont('helvetica', 'bold');
  doc.text('AI MEDICAL TRIAGE REPORT', pageWidth / 2, 20, { align: 'center' });
  
  doc.setFontSize(12);
  doc.setFont('helvetica', 'normal');
  doc.text('Rural Healthcare Emergency Prioritization System', pageWidth / 2, 30, { align: 'center' });

  yPosition = 50;

  // Reset text color to black
  doc.setTextColor(0, 0, 0);

  // Patient Information Section
  if (result.timestamp || result.patientInfo) {
    doc.setFontSize(14);
    doc.setFont('helvetica', 'bold');
    doc.text('PATIENT INFORMATION', margin, yPosition);
    yPosition += 8;
    
    doc.setFontSize(10);
    doc.setFont('helvetica', 'normal');
    
    if (result.timestamp) {
      const date = new Date(result.timestamp);
      doc.text(`Report Date: ${date.toLocaleDateString()} ${date.toLocaleTimeString()}`, margin, yPosition);
      yPosition += 6;
    }
    
    if (result.patientInfo?.age) {
      doc.text(`Age: ${result.patientInfo.age} years`, margin, yPosition);
      yPosition += 6;
    }
    
    if (result.patientInfo?.gender) {
      doc.text(`Gender: ${result.patientInfo.gender}`, margin, yPosition);
      yPosition += 6;
    }
    
    yPosition += 5;
  }

  // Priority Status Box
  yPosition += 2;
  const priorityColors: Record<string, [number, number, number]> = {
    'Low': [34, 197, 94],
    'Medium': [234, 179, 8],
    'High': [249, 115, 22],
    'Critical': [239, 68, 68]
  };
  
  const priorityColor = priorityColors[result.priority] || [156, 163, 175];
  doc.setFillColor(...priorityColor);
  doc.roundedRect(margin, yPosition, 80, 12, 2, 2, 'F');
  
  doc.setTextColor(255, 255, 255);
  doc.setFontSize(12);
  doc.setFont('helvetica', 'bold');
  doc.text(`PRIORITY: ${result.priority.toUpperCase()}`, margin + 40, yPosition + 8, { align: 'center' });
  
  // Severity Score Box
  doc.setFillColor(59, 130, 246);
  doc.roundedRect(margin + 90, yPosition, 80, 12, 2, 2, 'F');
  doc.text(`SEVERITY: ${result.severityScore}/100`, margin + 130, yPosition + 8, { align: 'center' });
  
  yPosition += 20;
  doc.setTextColor(0, 0, 0);

  // Ambulance Required Warning
  if (result.ambulanceRequired) {
    doc.setFillColor(239, 68, 68);
    doc.setDrawColor(220, 38, 38);
    doc.setLineWidth(2);
    doc.roundedRect(margin, yPosition, pageWidth - 2 * margin, 12, 2, 2, 'FD');
    
    doc.setTextColor(255, 255, 255);
    doc.setFontSize(12);
    doc.setFont('helvetica', 'bold');
    doc.text('🚨 AMBULANCE REQUIRED - CALL 108 IMMEDIATELY', pageWidth / 2, yPosition + 8, { align: 'center' });
    yPosition += 18;
    doc.setTextColor(0, 0, 0);
  }

  // Facility Recommendation
  if (result.facilityRecommendation) {
    doc.setFillColor(219, 234, 254);
    doc.setDrawColor(59, 130, 246);
    doc.setLineWidth(1);
    doc.roundedRect(margin, yPosition, pageWidth - 2 * margin, 12, 2, 2, 'FD');
    
    doc.setTextColor(30, 64, 175);
    doc.setFontSize(10);
    doc.setFont('helvetica', 'bold');
    doc.text(`🏥 Recommended Facility: ${result.facilityRecommendation}`, margin + 3, yPosition + 8);
    yPosition += 18;
    doc.setTextColor(0, 0, 0);
  }

  // Detected Symptoms Section
  doc.setFontSize(14);
  doc.setFont('helvetica', 'bold');
  doc.text('DETECTED SYMPTOMS', margin, yPosition);
  yPosition += 8;
  
  doc.setFontSize(10);
  doc.setFont('helvetica', 'normal');
  const symptomsText = result.symptoms.join(', ');
  const symptomLines = doc.splitTextToSize(symptomsText, pageWidth - 2 * margin);
  doc.text(symptomLines, margin, yPosition);
  yPosition += symptomLines.length * 5 + 8;

  // Check if we need a new page
  if (yPosition > pageHeight - 40) {
    doc.addPage();
    yPosition = margin;
  }

  // Probable Conditions Section
  doc.setFontSize(14);
  doc.setFont('helvetica', 'bold');
  doc.text('PROBABLE CONDITIONS (DIFFERENTIAL DIAGNOSIS)', margin, yPosition);
  yPosition += 10;
  
  result.conditions.forEach((condition, index) => {
    // Check if we need a new page
    if (yPosition > pageHeight - 50) {
      doc.addPage();
      yPosition = margin;
    }

    doc.setFontSize(11);
    doc.setFont('helvetica', 'bold');
    doc.text(`${index + 1}. ${condition.name}`, margin, yPosition);
    yPosition += 6;
    
    doc.setFontSize(10);
    doc.setFont('helvetica', 'normal');
    doc.text(`Confidence: ${condition.confidence}%`, margin + 5, yPosition);
    yPosition += 5;
    
    if (condition.description) {
      const descLines = doc.splitTextToSize(`Description: ${condition.description}`, pageWidth - 2 * margin - 5);
      doc.text(descLines, margin + 5, yPosition);
      yPosition += descLines.length * 5;
    }
    
    if (condition.complications && condition.complications.length > 0) {
      const complText = `Possible Complications: ${condition.complications.join(', ')}`;
      const complLines = doc.splitTextToSize(complText, pageWidth - 2 * margin - 5);
      doc.text(complLines, margin + 5, yPosition);
      yPosition += complLines.length * 5;
    }
    
    yPosition += 5;
  });

  // Risk Factors Section
  if (result.riskFactors && result.riskFactors.length > 0) {
    // Check if we need a new page
    if (yPosition > pageHeight - 40) {
      doc.addPage();
      yPosition = margin;
    }

    doc.setFontSize(14);
    doc.setFont('helvetica', 'bold');
    doc.text('RISK FACTORS IDENTIFIED', margin, yPosition);
    yPosition += 8;
    
    doc.setFontSize(10);
    doc.setFont('helvetica', 'normal');
    result.riskFactors.forEach((factor) => {
      doc.text(`• ${factor}`, margin + 5, yPosition);
      yPosition += 6;
    });
    yPosition += 5;
  }

  // New Page for First Aid and Medicines
  doc.addPage();
  yPosition = margin;

  // First Aid Steps Section
  doc.setFontSize(14);
  doc.setFont('helvetica', 'bold');
  doc.text('IMMEDIATE FIRST AID STEPS', margin, yPosition);
  yPosition += 10;
  
  doc.setFontSize(10);
  doc.setFont('helvetica', 'normal');
  result.firstAid.forEach((step, index) => {
    if (yPosition > pageHeight - 30) {
      doc.addPage();
      yPosition = margin;
    }

    const stepLines = doc.splitTextToSize(`${index + 1}. ${step}`, pageWidth - 2 * margin - 5);
    doc.text(stepLines, margin, yPosition);
    yPosition += stepLines.length * 5 + 3;
  });

  yPosition += 5;

  // Medicines Section
  if (result.medicines && result.medicines.length > 0) {
    if (yPosition > pageHeight - 40) {
      doc.addPage();
      yPosition = margin;
    }

    doc.setFontSize(14);
    doc.setFont('helvetica', 'bold');
    doc.text('RECOMMENDED MEDICINES', margin, yPosition);
    yPosition += 10;
    
    doc.setFontSize(10);
    doc.setFont('helvetica', 'normal');
    result.medicines.forEach((medicine, index) => {
      if (yPosition > pageHeight - 25) {
        doc.addPage();
        yPosition = margin;
      }

      const medLines = doc.splitTextToSize(`${index + 1}. ${medicine}`, pageWidth - 2 * margin - 5);
      doc.text(medLines, margin, yPosition);
      yPosition += medLines.length * 5 + 3;
    });

    yPosition += 5;
  }

  // Warning Signs to Watch
  if (result.warningSignsToWatch && result.warningSignsToWatch.length > 0) {
    if (yPosition > pageHeight - 40) {
      doc.addPage();
      yPosition = margin;
    }

    doc.setFontSize(14);
    doc.setFont('helvetica', 'bold');
    doc.setTextColor(239, 68, 68);
    doc.text('⚠️ WARNING SIGNS TO WATCH', margin, yPosition);
    yPosition += 10;
    
    doc.setTextColor(0, 0, 0);
    doc.setFontSize(10);
    doc.setFont('helvetica', 'normal');
    result.warningSignsToWatch.forEach((sign) => {
      if (yPosition > pageHeight - 20) {
        doc.addPage();
        yPosition = margin;
      }

      doc.text(`• ${sign}`, margin + 5, yPosition);
      yPosition += 6;
    });

    yPosition += 5;
  }

  // Follow-Up Instructions
  if (result.followUpInstructions && result.followUpInstructions.length > 0) {
    if (yPosition > pageHeight - 40) {
      doc.addPage();
      yPosition = margin;
    }

    doc.setFontSize(14);
    doc.setFont('helvetica', 'bold');
    doc.text('FOLLOW-UP INSTRUCTIONS', margin, yPosition);
    yPosition += 10;
    
    doc.setFontSize(10);
    doc.setFont('helvetica', 'normal');
    result.followUpInstructions.forEach((instruction) => {
      if (yPosition > pageHeight - 20) {
        doc.addPage();
        yPosition = margin;
      }

      const instrLines = doc.splitTextToSize(`• ${instruction}`, pageWidth - 2 * margin - 5);
      doc.text(instrLines, margin + 5, yPosition);
      yPosition += instrLines.length * 5 + 2;
    });

    yPosition += 5;
  }

  // Clinical Notes
  if (result.clinicalNotes) {
    if (yPosition > pageHeight - 60) {
      doc.addPage();
      yPosition = margin;
    }

    doc.setFontSize(14);
    doc.setFont('helvetica', 'bold');
    doc.text('CLINICAL NOTES', margin, yPosition);
    yPosition += 10;
    
    doc.setFontSize(9);
    doc.setFont('helvetica', 'normal');
    const noteLines = doc.splitTextToSize(result.clinicalNotes, pageWidth - 2 * margin);
    doc.text(noteLines, margin, yPosition);
    yPosition += noteLines.length * 4 + 10;
  }

  // Footer with Disclaimer
  const disclaimerYPos = pageHeight - 30;
  doc.setFillColor(255, 237, 213);
  doc.setDrawColor(251, 146, 60);
  doc.setLineWidth(1);
  doc.roundedRect(margin, disclaimerYPos, pageWidth - 2 * margin, 20, 2, 2, 'FD');
  
  doc.setTextColor(194, 65, 12);
  doc.setFontSize(8);
  doc.setFont('helvetica', 'bold');
  doc.text('⚠️ MEDICAL DISCLAIMER', margin + 3, disclaimerYPos + 5);
  
  doc.setFont('helvetica', 'normal');
  doc.setFontSize(7);
  const disclaimerText = 'This is an AI-generated assessment for triage purposes only. It is NOT a substitute for professional medical diagnosis or treatment. Always consult a qualified healthcare professional for accurate diagnosis and treatment.';
  const disclaimerLines = doc.splitTextToSize(disclaimerText, pageWidth - 2 * margin - 6);
  doc.text(disclaimerLines, margin + 3, disclaimerYPos + 10);

  // Page Numbers
  const pageCount = doc.getNumberOfPages();
  for (let i = 1; i <= pageCount; i++) {
    doc.setPage(i);
    doc.setTextColor(128, 128, 128);
    doc.setFontSize(8);
    doc.setFont('helvetica', 'normal');
    doc.text(`Page ${i} of ${pageCount}`, pageWidth / 2, pageHeight - 10, { align: 'center' });
  }

  return doc;
}

export function generateMedicalReportPDF(result: AnalysisResult): void {
  const doc = buildMedicalReportPDF(result);
  const timestamp = new Date().toISOString().replace(/[:.]/g, '-').slice(0, -5);
  doc.save(`Medical_Triage_Report_${timestamp}.pdf`);
}

export function generateMedicalReportPDFBlob(result: AnalysisResult): Blob {
  const doc = buildMedicalReportPDF(result);
  return doc.output('blob');
}
