using System;
using System.Collections.Generic;
using System.Text;

namespace Skladiste.Model
{
    public class DokumentDto
    {
        public int DokumentId { get; set; }
        public string OznakaDokumenta { get; set; }
        public DateTime DatumDokumenta { get; set; }
        public string Napomena { get; set; }
        public string TipDokumenta { get; set; }
        public int? DobavljacId { get; set; }
    }
}
