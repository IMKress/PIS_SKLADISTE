using System;
using System.Collections.Generic;
using System.Text;

namespace Skladiste.Model
{
    public class PrimkaInfoDto
    {
        public int DokumentId { get; set; }
        public DateTime DatumDokumenta { get; set; }
        public string TipDokumenta { get; set; }
        public string ZaposlenikId { get; set; }
        public string OznakaDokumenta { get; set; }
        public int? NarudzbenicaId { get; set; }
        public string Dostavio {  get; set; }
        public string Napomena { get; set; }
    }

}
