export const config = {
  api: {
    bodyParser: false,
  },
};

export default async function handler(req, res) {
  // CORS Headers
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  if (req.method !== 'POST') {
    return res.status(405).json({
      success: false,
      message: 'Method Not Allowed'
    });
  }

  try {
    // Read raw body stream
    const chunks = [];
    for await (const chunk of req) {
      chunks.push(typeof chunk === 'string' ? Buffer.from(chunk) : chunk);
    }
    const buffer = Buffer.concat(chunks);

    const contentType = req.headers['content-type'] || '';
    const boundaryMatch = contentType.match(/boundary=(?:"([^"]+)"|([^;]+))/i);
    const boundary = boundaryMatch ? (boundaryMatch[1] || boundaryMatch[2]) : null;

    const fields = {};
    const files = [];

    if (boundary) {
      const boundaryBuffer = Buffer.from('--' + boundary);
      let searchPos = 0;

      while (searchPos < buffer.length) {
        const boundaryIndex = buffer.indexOf(boundaryBuffer, searchPos);
        if (boundaryIndex === -1) break;

        const partStart = boundaryIndex + boundaryBuffer.length;
        if (buffer.slice(partStart, partStart + 2).toString() === '--') {
          // Final boundary encountered
          break;
        }

        let bodyStartPos = partStart;
        if (buffer.slice(bodyStartPos, bodyStartPos + 2).toString() === '\r\n') {
          bodyStartPos += 2;
        }

        const headerEndIndex = buffer.indexOf(Buffer.from('\r\n\r\n'), bodyStartPos);
        if (headerEndIndex === -1) break;

        const headerRaw = buffer.slice(bodyStartPos, headerEndIndex).toString('utf-8');
        const contentStart = headerEndIndex + 4;

        const nextBoundaryIndex = buffer.indexOf(boundaryBuffer, contentStart);
        if (nextBoundaryIndex === -1) break;

        let contentEnd = nextBoundaryIndex;
        if (buffer.slice(contentEnd - 2, contentEnd).toString() === '\r\n') {
          contentEnd -= 2;
        }

        const partContent = buffer.slice(contentStart, Math.max(contentStart, contentEnd));

        const nameMatch = headerRaw.match(/name="([^"]+)"/i);
        const filenameMatch = headerRaw.match(/filename="([^"]+)"/i);

        if (nameMatch) {
          const fieldName = nameMatch[1];
          if (filenameMatch) {
            const fileName = filenameMatch[1];
            const mimeMatch = headerRaw.match(/Content-Type:\s*([^\r\n]+)/i);
            const fileMime = mimeMatch ? mimeMatch[1].trim() : 'application/octet-stream';
            files.push({
              fieldName,
              filename: fileName,
              contentType: fileMime,
              size: partContent.length,
              data: partContent
            });
          } else {
            fields[fieldName] = partContent.toString('utf-8');
          }
        }

        searchPos = nextBoundaryIndex;
      }
    }

    console.log('Career Application Received:', {
      name: fields.applicant_name,
      email: fields.email,
      phone: fields.phone,
      position: fields.position,
      branch: fields.branch,
      experience: fields.experience,
      hasResume: files.length > 0,
      resumeFileName: files.length > 0 ? files[0].filename : null,
      resumeFileSize: files.length > 0 ? `${Math.round(files[0].size / 1024)} KB` : 'None'
    });

    return res.status(200).json({
      success: true,
      message: 'Thank you! Your application has been successfully submitted.',
      data: {
        applicant: fields.applicant_name,
        position: fields.position,
        branch: fields.branch,
        fileReceived: files.length > 0 ? files[0].filename : null
      }
    });
  } catch (err) {
    console.error('API /api/apply error processing multipart request:', err);
    return res.status(500).json({
      success: false,
      message: 'Internal server error processing job application',
      error: err.message
    });
  }
}
