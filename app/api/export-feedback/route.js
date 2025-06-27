import { NextResponse } from 'next/server';
import { db } from '@/utils/db';
import { UserAnswer, MockInterview } from '@/utils/schema';
import { eq } from 'drizzle-orm';
import { Resend } from 'resend';

const resend = new Resend(process.env.RESEND_API_KEY);

let puppeteer;
let isProd = process.env.NODE_ENV === 'production';

if (isProd) {
  const chromium = await import('chrome-aws-lambda');
  puppeteer = chromium.puppeteer;
} else {
  puppeteer = await import('puppeteer');
}

export async function POST(req) {
  try {
    const { interviewId, email } = await req.json();
    if (!interviewId || !email) {
      return NextResponse.json({ error: 'Missing interviewId or email' }, { status: 400 });
    }

    // Get DB data
    const feedbackData = await db
      .select()
      .from(UserAnswer)
      .where(eq(UserAnswer.mockIdRef, interviewId))
      .orderBy(UserAnswer.id);

    const interviewMeta = await db
      .select()
      .from(MockInterview)
      .where(eq(MockInterview.mockId, interviewId));

    const meta = interviewMeta[0];

  
    // Construct HTML
    const html = `
      <!DOCTYPE html>
      <html lang="en">
      <head>
        <meta charset="UTF-8" />
        <title>Interview Feedback</title>
        <style>
          body {
            font-family: Arial, sans-serif;
            padding: 12px;
            color: #333;
            line-height: 1.5;
          }

          h1 { color: green; font-size: 22px; margin-bottom: 20px; }
          .meta {
            margin-bottom: 30px;
            padding: 15px;
            background-color: #f1f5f9;
            border-left: 5px solid green;
            border-radius: 6px;
          }
          .meta p { margin: 8px 0; }

          .question {
            background-color: #f8fafc;
            margin-bottom: 25px;
            padding: 15px;
            border: 1px solid #ccc;
            border-radius: 8px;
            font-size: 14px;
          }
          .label { font-weight: bold; }

          .expected {
            background-color: #e6ffed;
            border-left: 4px solid #22c55e;
            padding: 10px; margin: 10px 0; border-radius: 6px;
          }
          .user {
            background-color: #e0f2fe;
            border-left: 4px solid #3b82f6;
            padding: 10px; margin: 10px 0; border-radius: 6px;
          }
          .feedback {
            background-color: #fee2e2;
            border-left: 4px solid #ef4444;
            padding: 10px; margin: 10px 0; border-radius: 6px;
          }
          .rating {
            background-color: #fef9c3;
            border-left: 4px solid #facc15;
            padding: 10px; margin: 10px 0; border-radius: 6px;
          }
        </style>
      </head>
      <body>
        <h1>🎉 Interview Feedback Report</h1>
        <div class="meta">
          <p><span class="label">👤 Candidate:</span> ${meta.createdBy || 'N/A'}</p>
          <p><span class="label">💼 Role:</span> ${meta.jobPosition || 'N/A'}</p>
          <p><span class="label">🧑‍💼 Experience:</span> ${meta.jobExperience || 'N/A'}</p>
          <p><span class="label">🛠️ Tech:</span> ${meta.techStack || 'N/A'}</p>
          <p><span class="label">📝 Description:</span> ${meta.jobDesc || 'N/A'}</p>
        </div>

        ${feedbackData.map((item, i) => `
          <div class="question">
            <p><span class="label">Q${i + 1}:</span> ${item.question}</p>
            <div class="expected">✅ <strong>Expected:</strong> ${item.correctAns}</div>
            <div class="user">ℹ️ <strong>Your Answer:</strong> ${item.userAns}</div>
            <div class="feedback">⚠️ <strong>Feedback:</strong> ${item.feedback}</div>
            <div class="rating">⭐ <strong>Rating:</strong> ${item.rating}/10</div>
          </div>
        `).join('')}
      </body>
      </html>
    `;

    // Launch browser (env-aware)
    const browser = await puppeteer.launch({
      args: isProd ? (await import('chrome-aws-lambda')).args : [],
      executablePath: isProd
        ? await (await import('chrome-aws-lambda')).executablePath
        : undefined,
      headless: isProd ? true : 'new', // 'new' for Puppeteer v21+, true for older
    });

    const page = await browser.newPage();
    await page.setContent(html, { waitUntil: 'networkidle0' });
    await page.evaluateHandle('document.fonts.ready');

    const pdfBuffer = await page.pdf({
      format: 'A4',
      printBackground: true,
      margin: { top: '20px', bottom: '10px', left: '30px', right: '30px' },
    });

    await browser.close();

    if (!pdfBuffer || pdfBuffer.length === 0) {
      return NextResponse.json({ error: 'Empty PDF generated' }, { status: 500 });
    }

    await resend.emails.send({
      from: 'Interview AI <onboarding@resend.dev>',
      to: email,
      subject: '📄 Your Interview Feedback PDF',
      html: '<p>Hi, please find your interview feedback attached.</p>',
      attachments: [
        {
          filename: 'interview-feedback.pdf',
          content: Buffer.from(pdfBuffer).toString('base64'),
          type: 'application/pdf',
        },
      ],
    });

    return NextResponse.json({ message: 'Email sent and PDF exported' });
  } catch (err) {
    console.error('Export error:', err);
    return NextResponse.json({ error: err.message || 'Server error' }, { status: 500 });
  }
}
