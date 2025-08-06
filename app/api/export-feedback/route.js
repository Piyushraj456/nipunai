import { NextResponse } from 'next/server';
import { db } from '@/utils/db';
import { eq } from 'drizzle-orm';
import { Resend } from 'resend';
import { UserAnswer, MockInterview } from '@/utils/schema';
import { renderToBuffer } from '@react-pdf/renderer';
import FeedbackDocument from '../../_components/FeedbackDocument'

const resend = new Resend(process.env.RESEND_API_KEY);

export async function POST(req) {
  try {
    const { interviewId, email } = await req.json();
     console.log('📥 Received Export Request');
    console.log('Interview ID:', interviewId);
    console.log('Email to send:', email);


    if (!interviewId || !email) {
      return NextResponse.json({ error: 'Missing fields' }, { status: 400 });
    }

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

    const pdfBuffer = await renderToBuffer(
      <FeedbackDocument meta={meta} feedbackData={feedbackData} />
    );

    const sendResult = await resend.emails.send({
  from: 'Interview AI <onboarding@resend.dev>',
  to: email,
  subject: '📄 Your Interview Feedback PDF',
  html: '<p>Hi, please find your interview feedback attached.</p>',
  attachments: [
    {
      filename: 'interview-feedback.pdf',
      content: pdfBuffer.toString('base64'),
      type: 'application/pdf',
    },
  ],
});

console.log('📨 Resend response:', sendResult);

if (sendResult.error) {
  console.error("❌ Resend send failed:", sendResult.error);
  return NextResponse.json({ error: sendResult.error.message }, { status: 500 });
}


    return NextResponse.json({ message: 'Email sent!' });
  } catch (err) {
    console.error('PDF Export Error:', err);
    return NextResponse.json({ error: err.message || 'Export failed' }, { status: 500 });
  }
}
