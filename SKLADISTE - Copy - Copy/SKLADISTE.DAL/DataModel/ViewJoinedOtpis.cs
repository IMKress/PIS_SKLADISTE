using System;
using System.Collections.Generic;
using System.Text;

namespace SKLADISTE.DAL.DataModel
{
    public class ViewJoinedOtpis
    {
        public int DokumentId { get; set; }
        public int TipDokumentaId { get; set; }
        public int DokumentId { get; set; }
        public string TipDokumenta { get; set; }
        public string OznakaDokumenta { get; set; }
        public DateTime DatumDokumenta { get; set; }
    }
}
