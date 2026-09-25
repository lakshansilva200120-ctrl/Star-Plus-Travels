/**
 * =========================================================================
 * STAR PLUS TRAVEL & TOURISM LLC - GOOGLE APPS SCRIPT WEB APP HANDLER
 * =========================================================================
 * 
 * Deployment Endpoint:
 * https://script.google.com/macros/s/AKfycbz7vtBsDq--xmYbATR1Zszv2aO-aZeIIeJRvrj4OJgpYhPu9ZJjRTWDPu88y5_sW0DN/exec
 * 
 * Instructions:
 * 1. In your Google Spreadsheet (e.g., "Star Plus Travel - Master Submissions"),
 *    go to: Extensions -> Apps Script.
 * 2. Delete existing code and paste this entire file.
 * 3. Click "Deploy" -> "New deployment".
 * 4. Select type: "Web app".
 * 5. Configuration:
 *    - Description: Star Plus Inquiries, Careers & DMC Submissions Handler
 *    - Execute as: Me (<your google email>)
 *    - Who has access: Anyone (MANDATORY for anonymous website POST requests)
 * 6. Click "Deploy", review authorizations, and approve Google Drive & Gmail permissions.
 * 
 * Target Sheets Handled:
 * 1. "Inquiries" - Holiday tour inquiries, quote requests, fast-track visa processing, airline ticket queries
 * 2. "Job Applications" - Career submissions, CV/resume file uploads saved to Drive & attached to HR emails
 * 3. "DMC Partners" - Inbound ground operator/supplier registration & trade licenses
 * 
 * Primary Email Inboxes:
 * - UAE Desk: info@starplustraveluae.com
 * - Sri Lanka Desk: info@starplustravelsl.com
 */

function doPost(e) {
  var lock = LockService.getScriptLock();
  // Try to acquire lock for up to 30 seconds to prevent concurrent write collisions in Google Sheets
  try {
    lock.waitLock(30000);
  } catch (err) {
    return ContentService.createTextOutput(JSON.stringify({
      status: "error",
      message: "Server busy. Please try again."
    })).setMimeType(ContentService.MimeType.JSON);
  }

  try {
    var ss = SpreadsheetApp.getActiveSpreadsheet();
    var data = JSON.parse(e.postData.contents);
    var formType = data.formType || "inquiry";
    var timestamp = new Date();
    var recipientEmail = "info@starplustraveluae.com";
    var emailSubject = "";
    var emailHtmlBody = "";
    var attachments = [];

    // =========================================================================
    // 1. JOB APPLICATION HANDLER (formType === "job")
    // =========================================================================
    if (formType === "job") {
      var sheet = getOrCreateSheet(ss, "Job Applications", [
        "Timestamp",
        "Position",
        "Full Name",
        "Email Address",
        "Phone / WhatsApp",
        "Branch",
        "Experience",
        "LinkedIn / Portfolio",
        "Resume URL / Link",
        "Cover Note"
      ]);

      var resumeFileUrl = data.resumeLink || "";

      // Handle direct file upload to Google Drive if base64 file data is passed
      if (data.fileData && data.fileName) {
        try {
          var folderName = "Star Plus Careers - Resumes";
          var folders = DriveApp.getFoldersByName(folderName);
          var folder = folders.hasNext() ? folders.next() : DriveApp.createFolder(folderName);

          var rawBase64 = data.fileData.indexOf(",") > -1 ? data.fileData.split(",")[1] : data.fileData;
          var decodedData = Utilities.base64Decode(rawBase64);
          var fileMime = data.fileType || "application/pdf";
          var safeApplicantName = (data.fullName || "Applicant").replace(/[^a-zA-Z0-9_-]/g, "_");
          var blob = Utilities.newBlob(decodedData, fileMime, safeApplicantName + "_" + data.fileName);
          
          var driveFile = folder.createFile(blob);
          driveFile.setSharing(DriveApp.Access.ANYONE_WITH_LINK, DriveApp.Permission.VIEW);
          resumeFileUrl = driveFile.getUrl();
          attachments.push(blob);
        } catch (driveErr) {
          Logger.log("Drive upload error: " + driveErr.toString());
        }
      }

      // Append row to sheet
      sheet.appendRow([
        timestamp,
        data.position || "Senior Travel Consultant",
        data.fullName || "",
        data.email || "",
        data.phone || "",
        data.branch === "sl" ? "Sri Lanka Branch" : "UAE Branch",
        data.experience || "",
        data.linkedin || "",
        resumeFileUrl,
        data.coverNote || ""
      ]);

      // Route email according to branch
      var branchTitle = data.branch === "sl" ? "Sri Lanka Branch (Colombo)" : "UAE Branch (Dubai)";
      if (data.branch === "sl") {
        recipientEmail = "info@starplustravelsl.com";
      }

      emailSubject = "🌟 New Job Application: " + (data.position || "Travel Consultant") + " - " + (data.fullName || "Applicant");
      
      emailHtmlBody = 
        "<div style='font-family: Arial, sans-serif; line-height: 1.6; color: #1e293b; max-width: 600px; border: 1px solid #e2e8f0; border-radius: 12px; overflow: hidden;'>" +
          "<div style='background: linear-gradient(135deg, #0f172a, #1e293b); padding: 24px; color: #ffffff;'>" +
            "<h2 style='margin: 0; font-size: 20px; color: #f59e0b;'>Star Plus Travel & Tourism - Careers</h2>" +
            "<p style='margin: 6px 0 0 0; font-size: 14px; color: #cbd5e1;'>New Candidate Application Received</p>" +
          "</div>" +
          "<div style='padding: 24px; background: #ffffff;'>" +
            "<table style='width: 100%; border-collapse: collapse; font-size: 14px;'>" +
              "<tr><td style='padding: 8px 0; font-weight: bold; width: 35%; color: #64748b;'>Position Applied:</td><td style='padding: 8px 0; font-weight: bold; color: #0f172a;'>" + (data.position || "Senior Travel Consultant") + "</td></tr>" +
              "<tr><td style='padding: 8px 0; font-weight: bold; color: #64748b;'>Candidate Name:</td><td style='padding: 8px 0; color: #0f172a;'>" + (data.fullName || "N/A") + "</td></tr>" +
              "<tr><td style='padding: 8px 0; font-weight: bold; color: #64748b;'>Email Address:</td><td style='padding: 8px 0;'><a href='mailto:" + data.email + "' style='color: #2563eb; text-decoration: none;'>" + (data.email || "N/A") + "</a></td></tr>" +
              "<tr><td style='padding: 8px 0; font-weight: bold; color: #64748b;'>Phone / WhatsApp:</td><td style='padding: 8px 0;'><a href='https://wa.me/" + (data.phone ? data.phone.replace(/[^0-9]/g, '') : '') + "' style='color: #16a34a; font-weight: bold; text-decoration: none;'>" + (data.phone || "N/A") + "</a></td></tr>" +
              "<tr><td style='padding: 8px 0; font-weight: bold; color: #64748b;'>Target Branch:</td><td style='padding: 8px 0;'>" + branchTitle + "</td></tr>" +
              "<tr><td style='padding: 8px 0; font-weight: bold; color: #64748b;'>Experience:</td><td style='padding: 8px 0;'>" + (data.experience || "Not specified") + "</td></tr>" +
              "<tr><td style='padding: 8px 0; font-weight: bold; color: #64748b;'>LinkedIn / Portfolio:</td><td style='padding: 8px 0;'>" + (data.linkedin ? "<a href='" + data.linkedin + "' target='_blank' style='color: #2563eb;'>" + data.linkedin + "</a>" : "Not provided") + "</td></tr>" +
              "<tr><td style='padding: 8px 0; font-weight: bold; color: #64748b;'>Resume / CV Link:</td><td style='padding: 8px 0;'>" + (resumeFileUrl ? "<a href='" + resumeFileUrl + "' target='_blank' style='display: inline-block; padding: 6px 12px; background: #f59e0b; color: #0f172a; font-weight: bold; border-radius: 6px; text-decoration: none;'>View Resume / CV</a>" : "None provided") + "</td></tr>" +
            "</table>" +
            "<div style='margin-top: 20px; padding: 16px; background: #f8fafc; border-left: 4px solid #f59e0b; border-radius: 4px;'>" +
              "<strong style='display: block; margin-bottom: 6px; color: #334155;'>Applicant Cover Note:</strong>" +
              "<p style='margin: 0; font-size: 13px; color: #475569; white-space: pre-wrap;'>" + (data.coverNote || "No cover note provided.") + "</p>" +
            "</div>" +
            (attachments.length > 0 ? "<p style='margin-top: 14px; font-size: 12px; color: #16a34a;'>📎 Resume file is attached to this email and saved in Google Drive folder 'Star Plus Careers - Resumes'.</p>" : "") +
          "</div>" +
          "<div style='background: #f1f5f9; padding: 14px 24px; font-size: 11px; color: #94a3b8; text-align: center;'>" +
            "Star Plus Travel & Tourism LLC • Dubai, UAE • Automated Recruitment Portal" +
          "</div>" +
        "</div>";
    }

    // =========================================================================
    // 2. DMC / GROUND SERVICES PARTNER HANDLER (formType === "dmc")
    // =========================================================================
    else if (formType === "dmc") {
      var sheet = getOrCreateSheet(ss, "DMC Partners", [
        "Timestamp",
        "Company Name",
        "Country / Destination",
        "Contact Person",
        "Corporate Email",
        "Corporate Phone",
        "Website",
        "Social / Directory Profile",
        "License / Reg No",
        "License Document URL"
      ]);

      var licenseFileUrl = "";

      // Handle license file upload if provided
      if (data.fileData && data.fileName) {
        try {
          var dmcFolderName = "Star Plus Partners - Licenses";
          var dmcFolders = DriveApp.getFoldersByName(dmcFolderName);
          var dmcFolder = dmcFolders.hasNext() ? dmcFolders.next() : DriveApp.createFolder(dmcFolderName);

          var rawLicenseBase64 = data.fileData.indexOf(",") > -1 ? data.fileData.split(",")[1] : data.fileData;
          var decodedLicense = Utilities.base64Decode(rawLicenseBase64);
          var docBlob = Utilities.newBlob(decodedLicense, data.fileType || "application/pdf", (data.companyName || "Partner").replace(/[^a-zA-Z0-9_-]/g, "_") + "_License_" + data.fileName);
          
          var dmcFile = dmcFolder.createFile(docBlob);
          dmcFile.setSharing(DriveApp.Access.ANYONE_WITH_LINK, DriveApp.Permission.VIEW);
          licenseFileUrl = dmcFile.getUrl();
          attachments.push(docBlob);
        } catch (dmcErr) {
          Logger.log("DMC file upload error: " + dmcErr.toString());
        }
      }

      sheet.appendRow([
        timestamp,
        data.companyName || "",
        data.country || "",
        data.contactPerson || "",
        data.corporateEmail || "",
        data.corporatePhone || "",
        data.website || "",
        data.socialProfile || "",
        data.licenseNumber || "",
        licenseFileUrl
      ]);

      emailSubject = "🤝 New DMC Partner Registration: " + (data.companyName || "Partner") + " (" + (data.country || "Global") + ")";
      
      emailHtmlBody = 
        "<div style='font-family: Arial, sans-serif; line-height: 1.6; color: #1e293b; max-width: 600px; border: 1px solid #e2e8f0; border-radius: 12px; overflow: hidden;'>" +
          "<div style='background: linear-gradient(135deg, #0f172a, #1e293b); padding: 24px; color: #ffffff;'>" +
            "<h2 style='margin: 0; font-size: 20px; color: #f59e0b;'>Star Plus Travel & Tourism - B2B DMC Network</h2>" +
            "<p style='margin: 6px 0 0 0; font-size: 14px; color: #cbd5e1;'>New Ground Operator / Supplier Intake</p>" +
          "</div>" +
          "<div style='padding: 24px; background: #ffffff;'>" +
            "<table style='width: 100%; border-collapse: collapse; font-size: 14px;'>" +
              "<tr><td style='padding: 8px 0; font-weight: bold; width: 35%; color: #64748b;'>Company Name:</td><td style='padding: 8px 0; font-weight: bold; color: #0f172a;'>" + (data.companyName || "N/A") + "</td></tr>" +
              "<tr><td style='padding: 8px 0; font-weight: bold; color: #64748b;'>Destination Coverage:</td><td style='padding: 8px 0; color: #0f172a;'>" + (data.country || "N/A") + "</td></tr>" +
              "<tr><td style='padding: 8px 0; font-weight: bold; color: #64748b;'>Contact Person:</td><td style='padding: 8px 0; color: #0f172a;'>" + (data.contactPerson || "N/A") + "</td></tr>" +
              "<tr><td style='padding: 8px 0; font-weight: bold; color: #64748b;'>Corporate Email:</td><td style='padding: 8px 0;'><a href='mailto:" + data.corporateEmail + "' style='color: #2563eb; text-decoration: none;'>" + (data.corporateEmail || "N/A") + "</a></td></tr>" +
              "<tr><td style='padding: 8px 0; font-weight: bold; color: #64748b;'>Corporate Phone:</td><td style='padding: 8px 0;'><a href='https://wa.me/" + (data.corporatePhone ? data.corporatePhone.replace(/[^0-9]/g, '') : '') + "' style='color: #16a34a; font-weight: bold; text-decoration: none;'>" + (data.corporatePhone || "N/A") + "</a></td></tr>" +
              "<tr><td style='padding: 8px 0; font-weight: bold; color: #64748b;'>Official Website:</td><td style='padding: 8px 0;'><a href='" + data.website + "' target='_blank' style='color: #2563eb;'>" + (data.website || "N/A") + "</a></td></tr>" +
              "<tr><td style='padding: 8px 0; font-weight: bold; color: #64748b;'>Social / Directory:</td><td style='padding: 8px 0;'>" + (data.socialProfile ? "<a href='" + data.socialProfile + "' target='_blank' style='color: #2563eb;'>" + data.socialProfile + "</a>" : "N/A") + "</td></tr>" +
              "<tr><td style='padding: 8px 0; font-weight: bold; color: #64748b;'>License / Reg No:</td><td style='padding: 8px 0;'>" + (data.licenseNumber || "Pending verification") + "</td></tr>" +
              (licenseFileUrl ? "<tr><td style='padding: 8px 0; font-weight: bold; color: #64748b;'>License Document:</td><td style='padding: 8px 0;'><a href='" + licenseFileUrl + "' target='_blank' style='display: inline-block; padding: 4px 10px; background: #0ea5e9; color: #ffffff; font-weight: bold; border-radius: 6px; text-decoration: none; font-size: 12px;'>View Document</a></td></tr>" : "") +
            "</table>" +
            (attachments.length > 0 ? "<p style='margin-top: 14px; font-size: 12px; color: #16a34a;'>📎 Partner license document is attached to this email and saved in Google Drive folder 'Star Plus Partners - Licenses'.</p>" : "") +
          "</div>" +
          "<div style='background: #f1f5f9; padding: 14px 24px; font-size: 11px; color: #94a3b8; text-align: center;'>" +
            "Star Plus Travel & Tourism LLC • B2B Partnership Division • Dubai, UAE" +
          "</div>" +
        "</div>";
    }

    // =========================================================================
    // 3. TRAVEL INQUIRY & QUOTE HANDLER (DEFAULT: formType === "inquiry")
    // =========================================================================
    else {
      var sheet = getOrCreateSheet(ss, "Inquiries", [
        "Timestamp",
        "Full Name",
        "Email Address",
        "Phone / WhatsApp",
        "Primary Interest",
        "Destination / Route / Country",
        "Travelers / Nationality / Dates",
        "Notes / Special Requests"
      ]);

      sheet.appendRow([
        timestamp,
        data.fullName || "",
        data.email || "",
        data.phone || "",
        data.interest || "General Inquiry",
        data.destination || "",
        data.travelers || "",
        data.notes || ""
      ]);

      emailSubject = "✈️ New Travel Inquiry: " + (data.interest || "Trip Quote") + " - " + (data.fullName || "Guest");
      
      emailHtmlBody = 
        "<div style='font-family: Arial, sans-serif; line-height: 1.6; color: #1e293b; max-width: 600px; border: 1px solid #e2e8f0; border-radius: 12px; overflow: hidden;'>" +
          "<div style='background: linear-gradient(135deg, #0f172a, #1e293b); padding: 24px; color: #ffffff;'>" +
            "<h2 style='margin: 0; font-size: 20px; color: #f59e0b;'>Star Plus Travel & Tourism</h2>" +
            "<p style='margin: 6px 0 0 0; font-size: 14px; color: #cbd5e1;'>New Travel Inquiry & Free Itinerary Request</p>" +
          "</div>" +
          "<div style='padding: 24px; background: #ffffff;'>" +
            "<table style='width: 100%; border-collapse: collapse; font-size: 14px;'>" +
              "<tr><td style='padding: 8px 0; font-weight: bold; width: 35%; color: #64748b;'>Client Name:</td><td style='padding: 8px 0; font-weight: bold; color: #0f172a;'>" + (data.fullName || "N/A") + "</td></tr>" +
              "<tr><td style='padding: 8px 0; font-weight: bold; color: #64748b;'>Email Address:</td><td style='padding: 8px 0;'><a href='mailto:" + data.email + "' style='color: #2563eb; text-decoration: none;'>" + (data.email || "N/A") + "</a></td></tr>" +
              "<tr><td style='padding: 8px 0; font-weight: bold; color: #64748b;'>Phone / WhatsApp:</td><td style='padding: 8px 0;'><a href='https://wa.me/" + (data.phone ? data.phone.replace(/[^0-9]/g, '') : '') + "' style='color: #16a34a; font-weight: bold; text-decoration: none;'>" + (data.phone || "N/A") + "</a></td></tr>" +
              "<tr><td style='padding: 8px 0; font-weight: bold; color: #64748b;'>Primary Interest:</td><td style='padding: 8px 0; font-weight: bold; color: #f59e0b;'>" + (data.interest || "General Inquiry") + "</td></tr>" +
              "<tr><td style='padding: 8px 0; font-weight: bold; color: #64748b;'>Destination / Target:</td><td style='padding: 8px 0; font-weight: bold; color: #0f172a;'>" + (data.destination || "Flexible / Not specified") + "</td></tr>" +
              "<tr><td style='padding: 8px 0; font-weight: bold; color: #64748b;'>Travelers / Details:</td><td style='padding: 8px 0;'>" + (data.travelers || "Not specified") + "</td></tr>" +
            "</table>" +
            "<div style='margin-top: 20px; padding: 16px; background: #f8fafc; border-left: 4px solid #f59e0b; border-radius: 4px;'>" +
              "<strong style='display: block; margin-bottom: 6px; color: #334155;'>Client Notes / Specific Requests:</strong>" +
              "<p style='margin: 0; font-size: 13px; color: #475569; white-space: pre-wrap;'>" + (data.notes || "No additional notes provided.") + "</p>" +
            "</div>" +
          "</div>" +
          "<div style='background: #f1f5f9; padding: 14px 24px; font-size: 11px; color: #94a3b8; text-align: center;'>" +
            "Star Plus Travel & Tourism LLC • Al Rigga, Deira, Dubai, UAE • +971 4 297 8844" +
          "</div>" +
        "</div>";
    }

    // =========================================================================
    // SEND AUTOMATED EMAIL NOTIFICATION VIA GMAIL
    // =========================================================================
    if (emailHtmlBody && recipientEmail) {
      var mailOptions = {
        to: recipientEmail,
        subject: emailSubject,
        htmlBody: emailHtmlBody,
        replyTo: data.email || (formType === "dmc" ? data.corporateEmail : "info@starplustraveluae.com")
      };

      if (attachments.length > 0) {
        mailOptions.attachments = attachments;
      }

      MailApp.sendEmail(mailOptions);
    }

    return ContentService.createTextOutput(JSON.stringify({
      status: "success",
      message: "Data logged and notification delivered successfully."
    })).setMimeType(ContentService.MimeType.JSON);

  } catch (error) {
    Logger.log("doPost error: " + error.toString());
    return ContentService.createTextOutput(JSON.stringify({
      status: "error",
      message: error.toString()
    })).setMimeType(ContentService.MimeType.JSON);
  } finally {
    lock.releaseLock();
  }
}

/**
 * Helper to retrieve an existing sheet or create it with formatted headers if it doesn't exist
 */
function getOrCreateSheet(spreadsheet, sheetName, headers) {
  var sheet = spreadsheet.getSheetByName(sheetName);
  if (!sheet) {
    sheet = spreadsheet.insertSheet(sheetName);
    if (headers && headers.length > 0) {
      sheet.appendRow(headers);
      sheet.getRange(1, 1, 1, headers.length).setFontWeight("bold").setBackground("#f1f5f9");
      sheet.setFrozenRows(1);
    }
  }
  return sheet;
}
