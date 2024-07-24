import { Resend } from 'resend';

const resend = new Resend(process.env.RESEND_API_KEY!);

export const sendEmail = async ({
  email,
  subject,
  body,
}: {
  email: string;
  subject: string;
  body: React.ReactNode;
}) => {
  const { error } = await resend.emails.send({
    from: process.env.EMAIL_FROM!,
    to: email,
    subject,
    react: body,
    text: 'send email',
  });

  if (error) {
    throw error;
  }
};
