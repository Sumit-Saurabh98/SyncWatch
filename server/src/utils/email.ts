import nodemailer from "nodemailer";
import dotenv from "dotenv";
dotenv.config();
export const sendVerificationEmail = async (email: string, code: string) => {
  const transport = nodemailer.createTransport({
    host: process.env.MAIL_HOST,
    port: 465,
    secure: true,
    auth: {
      user: process.env.MAIL_USER,
      pass: process.env.MAIL_PASS,
    },
  });

  const emailTemplate = `
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Verify Your Email - SyncWatch</title>
    <style>
        body {
            font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
            margin: 0;
            padding: 0;
            background-color: #0f0821;
            color: #fff;
        }
        .email-container {
            max-width: 600px;
            margin: 20px auto;
            background-color: #1a103a;
            border-radius: 12px;
            overflow: hidden;
            box-shadow: 0 4px 20px rgba(123, 97, 255, 0.2);
            border: 1px solid rgba(138, 122, 235, 0.3);
        }
        .header {
            background: linear-gradient(to right, #5a32a3, #7c3aed, #ec4899);
            padding: 35px;
            text-align: center;
        }
        .logo {
            font-size: 28px;
            font-weight: bold;
            color: white;
            text-decoration: none;
            background-clip: text;
            -webkit-background-clip: text;
            background-image: linear-gradient(to right, #fff, #ec4899);
            color: transparent;
        }
        .content {
            padding: 40px 30px;
            line-height: 1.6;
            background-color: #1e1246;
        }
        .greeting {
            font-size: 24px;
            font-weight: 600;
            margin-bottom: 20px;
            background: linear-gradient(to right, #7c3aed, #ec4899);
            -webkit-background-clip: text;
            background-clip: text;
            color: transparent;
            display: inline-block;
        }
        .message {
            margin-bottom: 30px;
            font-size: 16px;
            color: #c7c7d9;
        }
        .code-container {
            text-align: center;
            margin: 30px 0;
        }
        .verification-code {
            letter-spacing: 8px;
            font-size: 32px;
            font-weight: 700;
            padding: 20px 30px;
            background-color: #2a1a5e;
            border-radius: 8px;
            color: white;
            display: inline-block;
            border: 1px solid rgba(138, 122, 235, 0.4);
            box-shadow: 0 4px 12px rgba(123, 97, 255, 0.3);
            background: linear-gradient(135deg, #2a1a5e, #3a2276);
        }
        .alternative {
            font-size: 14px;
            color: #a8a8bd;
            margin-top: 20px;
        }
        .footer {
            background-color: #150d33;
            padding: 20px;
            text-align: center;
            font-size: 14px;
            color: #8888a2;
            border-top: 1px solid rgba(138, 122, 235, 0.2);
        }
        .social-links {
            margin-top: 15px;
        }
        .social-icon {
            display: inline-block;
            margin: 0 8px;
            color: #ec4899;
            text-decoration: none;
        }
        .feature-row {
            display: flex;
            justify-content: center;
            margin: 30px 0;
            flex-wrap: wrap;
        }
        .feature-item {
            background-color: #2a1a5e;
            border-radius: 8px;
            padding: 20px 15px;
            width: 28%;
            margin: 0 2%;
            text-align: center;
            border: 1px solid rgba(138, 122, 235, 0.2);
            transition: transform 0.3s, box-shadow 0.3s;
        }
        .feature-item:hover {
            transform: translateY(-5px);
            box-shadow: 0 6px 15px rgba(236, 72, 153, 0.3);
        }
        .feature-icon {
            display: inline-flex;
            width: 54px;
            height: 54px;
            background: linear-gradient(to right, #7c3aed, #ec4899);
            border-radius: 50%;
            align-items: center;
            justify-content: center;
            margin: 0 auto 15px;
        }
        .feature-icon svg {
            width: 28px;
            height: 28px;
            fill: none;
            stroke: #ffffff;
            stroke-width: 2;
        }
        .feature-title {
            font-weight: 600;
            margin-bottom: 5px;
            color: #ffffff;
            font-size: 18px;
        }
        .code-instructions {
            margin-top: 15px;
            font-size: 14px;
            color: #a8a8bd;
        }
        @media only screen and (max-width: 600px) {
            .content {
                padding: 30px 20px;
            }
            .feature-item {
                width: 100%;
                margin: 10px 0;
            }
        }
    </style>
</head>
<body>
    <div class="email-container">
        <div class="header">
            <div class="logo">SyncWatch</div>
        </div>
        
        <div class="content">
            <div class="greeting">Verify Your Email Address</div>
            
            <div class="message">
                Thank you for signing up with SyncWatch! To complete your registration and start watching videos together with friends, please verify your email using the code below.
            </div>
            
            <div class="code-container">
                <div class="verification-code">${code}</div>
                <div class="code-instructions">Please copy this code and enter it on the verification page</div>
            </div>
            
            <div class="message">
                This verification code will expire in 24 hours. If you didn't create an account with us, please ignore this email.
            </div>
            
            <div style="margin-top: 30px; text-align: center;">
                <div style="font-weight: 600; margin-bottom: 15px; color: #ffffff; font-size: 18px;">Watch Together, Never Alone</div>
            </div>
            
            <div class="feature-row">
                <div class="feature-item">
                    <div class="feature-icon">
                        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24"><polygon points="23 7 16 12 23 17 23 7" fill="none" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2"/><rect x="1" y="5" width="15" height="14" rx="2" ry="2" fill="none" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2"/></svg>
                    </div>
                    <div class="feature-title">Synchronized Viewing</div>
                </div>
                <div class="feature-item">
                    <div class="feature-icon">
                        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24"><path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" fill="none" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2"/></svg>
                    </div>
                    <div class="feature-title">Live Discussions</div>
                </div>
                <div class="feature-item">
                    <div class="feature-icon">
                        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24"><circle cx="12" cy="8" r="7" fill="none" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2"/><polyline points="8.21 13.89 7 23 12 20 17 23 15.79 13.88" fill="none" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2"/></svg>
                    </div>
                    <div class="feature-title">Interactive Polls</div>
                </div>
            </div>
        </div>
        
        <div class="footer">
            <div>© 2025 SyncWatch. All rights reserved.</div>
            <div style="margin-top: 10px;">Connect with people who share your interests.</div>
        </div>
    </div>
</body>
</html>
`;

  await transport.sendMail({
    from: process.env.MAIL_USER,
    to: email,
    subject: "Verify your email",
    html: emailTemplate,
  });
};