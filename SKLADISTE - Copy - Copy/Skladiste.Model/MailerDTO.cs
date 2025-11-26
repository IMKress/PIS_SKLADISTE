using System;
using System.Collections.Generic;
using System.Text;

namespace Skladiste.Model
{
    public class MailerDTO
    {
        public string DobavljacMail { get; set; }
        public string DokumentOznaka {  get; set; }
        public string attachmentBase64 { get; set; }
        public string attachmentName { get; set; }
        public string Subject { get; set; }
        public string Body { get; set; }
    }
}
