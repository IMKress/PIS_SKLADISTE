    using System;
    using System.ComponentModel;
using System.IO;
using System.Net;
    using System.Net.Mail;
    using System.Net.Mime;
    using System.Text;

    namespace SSPmailer
    {
        public class Mailer
        {
            private static bool _mailSent = false;
            protected static bool poslanoCheck = false;
            private static void SendCompletedCallback(object sender, AsyncCompletedEventArgs e)
            {
            
                string token = (string)e.UserState;
                if (e.Cancelled)
            {
                Console.WriteLine("[{0}] Slanje otkazano.", token);
                Console.WriteLine(token);

                poslanoCheck = true;

            }

                else if (e.Error != null)
                    Console.WriteLine("[{0}] Greška: {1}", token, e.Error);
                else
                {
                    Console.WriteLine("Poruka poslana.");
                    poslanoCheck=true;
                }


                _mailSent = true;
            }

            /// <summary>
            /// Šalje email preko Gmail SMTP-a (app password) s opcionalnim privitkom.
            /// </summary>
            /// <param name="toEmail">Primatelj (npr. "primatelj@example.com")</param>
            /// <param name="subject">Naslov poruke</param>
            /// <param name="body">Tijelo poruke (plain text)</param>
            /// <param name="attachmentPath">Opcionalna putanja do datoteke za privitak</param>
            /// <param name="fromDisplayName">Prikazno ime pošiljatelja (opcijsko)</param>
            /// <param name="userStateToken">Token za praćenje async slanja (opcijsko)</param>
            public bool Send(
                string toEmail,
                string pdfBase64String,
                string attachmentName,
                string subject,
                string body,
           
                string fromDisplayName = "My Gmail Test",
                string userStateToken = "gmail-send")
            {
            _mailSent = false;
            poslanoCheck = false;
            // Postavke Gmail SMTP-a
            const string smtpHost = "smtp.gmail.com";
                const int smtpPort = 587;
            // Čitaj app password iz env varijable (preporuka)
            // npr. postavi: setx GMAIL_APP_PASSWORD ieutlbjsxhgwjmnc
            string gmailUser = "osamdeset80@gmail.com";
                string gmailAppPassword =
                    Environment.GetEnvironmentVariable("ieutlbjsxhgwjmnc")
                    ?? "ieutlbjsxhgwjmnc"; // <-- bez razmaka! (zamijeni svojim ili koristi env varijablu)

                var client = new SmtpClient(smtpHost, smtpPort)
                {
                    EnableSsl = true,
                    Credentials = new NetworkCredential(gmailUser, gmailAppPassword),
                    Timeout = 100000 // 100s
                };

                var from = new MailAddress(gmailUser, fromDisplayName, Encoding.UTF8);
                var to = new MailAddress(toEmail);

                var message = new MailMessage(from, to)
                {
                    Subject = subject,
                    SubjectEncoding = Encoding.UTF8,
                    Body = body,
                    BodyEncoding = Encoding.UTF8,
                    IsBodyHtml = false // postavi na true ako šalješ HTML
                };

             



            var bytes = Convert.FromBase64String(pdfBase64String);

            using var ms = new MemoryStream(bytes);
            var attachmentt = new Attachment(ms, attachmentName, "application/pdf");

            message.Attachments.Add(attachmentt);
            client.SendCompleted += SendCompletedCallback;

            // Pošalji asinkrono
            client.SendAsync(message, userStateToken);

            // Čekaj dok se ne pošalje ili otkaže
            while (!_mailSent)
            {
                System.Threading.Thread.Sleep(100); // čekaj 0.1s
            }

            message.Dispose();
            client.Dispose();
            Console.WriteLine(poslanoCheck);
            return poslanoCheck;


        }
    }
    }
