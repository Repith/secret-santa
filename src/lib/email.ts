import { Resend } from "resend";
import * as fs from "fs";
import * as path from "path";

export interface EmailOptions {
  to: string;
  subject: string;
  body: string;
}

const resend = new Resend(process.env.RESEND_API_KEY);

const MAIL_BG_CID = "mail_bg_header";

function getFileBuffer(imageFileName: string): Buffer {
  const filePath = path.join(process.cwd(), "public", imageFileName);

  try {
    if (!fs.existsSync(filePath)) {
      console.error(
        `[FATAL ERROR] PLIK NIE ZNALEZIONY: Oczekiwana ścieżka: ${filePath}`,
      );
      throw new Error("Image file not found for CID attachment.");
    }

    const fileBuffer = fs.readFileSync(filePath);

    console.log(
      `[DIAGNOSTYKA] Pomyślnie wczytano bufor dla ${imageFileName}. Rozmiar: ${fileBuffer.length} bajtów`,
    );

    return fileBuffer;
  } catch (error) {
    console.error(
      `[FATAL ERROR] Błąd podczas ładowania bufora obrazka dla CID:`,
      error,
    );
    throw error;
  }
}

const MAIL_BG_BUFFER = getFileBuffer("mail_bg.png");

// ----------------------------------------------------------------------------------

export async function sendEmail(options: EmailOptions): Promise<void> {
  const loginToken = options.body;

  const htmlBody = `
    <!DOCTYPE html>
    <html lang="pl">
    <head>
      <meta charset="UTF-8" />
      <meta name="viewport" content="width=device-width, initial-scale=1.0" />
      <title>Secret Santa: Kod Logowania</title>
      <style>
        /* CSS Inline dla kompatybilności */
        body {
          font-family: Arial, Helvetica, sans-serif;
          background-color: #f7f3ed;
          margin: 0;
          padding: 0;
          line-height: 1.6;
        }
        .container {
          max-width: 500px;
          margin: 40px auto;
          background-color: #ffffff;
          border-radius: 25px;
          box-shadow: 0 10px 20px rgba(0, 0, 0, 0.1);
          border: 1px solid #e0e0e0;
          overflow: hidden;
        }

        .header-wrapper {
          text-align: center;
          border-radius: 25px 25px 0 0;
          overflow: hidden;
        }

        .content {
          padding: 40px 30px 30px;
          text-align: center;
          color: #444444;
          background-color: #ffffff;
        }
        /* Nowy styl powitalny */
        .welcome-title {
            font-size: 26px;
            font-weight: bold;
            color: #DA4A3C; /* Czerwony kolor świąteczny */
            margin-bottom: 5px;
            text-shadow: 1px 1px 1px rgba(0,0,0,0.1);
        }
        .welcome-text {
             font-size: 18px;
             margin-top: 0;
             margin-bottom: 20px;
        }
        .code-box {
          background-color: #fff8f8;
          border: 2px solid #DA4A3C; /* Grubsza ramka */
          border-radius: 12px; /* Większe zaokrąglenie */
          padding: 25px;
          margin: 30px 0;
          box-shadow: 0 4px 8px rgba(218, 74, 60, 0.1);
        }
        .code-label {
          font-size: 14px; /* Zmniejszony, by kod był najważniejszy */
          font-weight: bold;
          color: #DA4A3C;
          margin: 0;
          letter-spacing: 1px;
        }
        .code {
          font-family: monospace, Arial, Helvetica, sans-serif; /* Monospace dla tokenu */
          font-size: 40px; /* Znacznie większy kod */
          font-weight: 900; /* Extra bold */
          color: #DA4A3C; /* Czerwony kolor dla kodu */
          letter-spacing: 8px; /* Większe odstępy */
          margin: 10px 0 0;
        }
        .footer {
          background-color: #eeeeee; /* Lekko ciemniejszy stopka */
          padding: 20px;
          text-align: center;
          font-size: 13px;
          color: #777777;
          border-top: 1px solid #d0d0d0;
        }
        .small-text {
            font-size: 12px; /* Minimalnie większa informacja o wygaśnięciu */
            color: #888888;
            margin-top: 8px;
            line-height: 1.4;
        }
        .emoji-sparkle {
            font-size: 24px;
            vertical-align: middle;
            line-height: 1;
        }
      </style>
    </head>
    <body>
      <div style="background-color: #f7f3ed; padding: 1px 0;">
        <div class="container">

          <div class="header-wrapper" role="img" aria-label="Świąteczny nagłówek Tajny Mikołaj">
            <img
              src="cid:${MAIL_BG_CID}"
              alt="Świąteczny nagłówek Tajny Mikołaj"
              width="500"
              height="120"
              style="display: block; width: 100%; max-width: 500px; height: auto; border: 0;"
            />
          </div>

          <div class="content">
            <h2 class="welcome-title">🎁 Cześć! 🎁</h2>

            <p class="welcome-text">
              Twój jednorazowy kod logowania do Tajnego Mikołaja jest gotowy.
            </p>

            <div class="code-box">
              <p class="code-label">TWÓJ KOD LOGOWANIA</p>
              <p class="code">${loginToken}</p>
              <p class="small-text">Ten kod wygasa za 24 godziny i działa **tylko jednorazowo**.</p>
            </div>

            <p style="font-size: 17px; margin-top: 25px;">
                Miłego obdarowywania i magicznych Świąt! <span class="emoji-sparkle">✨</span>
            </p>
          </div>

          <div class="footer">
            <p style="margin: 0;">
              Jeśli nie prosiłeś o ten kod, po prostu zignoruj tę wiadomość.
            </p>
          </div>
        </div>
      </div>
    </body>
    </html>
  `;

  const from = process.env.EMAIL_FROM;
  if (!from) {
    throw new Error("EMAIL_FROM is not set");
  }

  const result = await resend.emails.send({
    from,
    to: options.to,
    subject: "Twój kod logowania do Tajnego Mikołaja",
    html: htmlBody,
    attachments: [
      {
        filename: "mail_bg.png",
        content: MAIL_BG_BUFFER,
        contentId: MAIL_BG_CID,
      },
    ],
  });

  if (result.error) {
    console.error("Error sending email:", result.error);
    throw new Error("Failed to send email");
  }
}
