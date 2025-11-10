using SKLADISTE.DAL.DataModel;
using System;
using System.Collections.Generic;
using System.Text;

namespace Skladiste.Model
{
    public class naruMailerDTO
    {
        public string DobavljacMail;
        public string DokumentOznaka;
        public int DokumentId { get; set; }
        public int StatusId { get; set; }
        public DateTime Datum { get; set; }
        public string ZaposlenikId { get; set; }
        public bool aktivan { get; set; }
     
        public string attachmentBase64 {  get; set; }
        public string attachmentName {  get; set; }

        public StatusTip StatusTip { get; set; }
        public Dokument Dokument { get; set; }

    }
}
