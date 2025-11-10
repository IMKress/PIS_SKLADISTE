using System;
using System.Collections.Generic;
using System.Text;

namespace SKLADISTE.DAL.DataModel
{
    public class DokumentByArhivaId
    {//KORISTI SE ZA SPREMLJENU PROCEDURU
        public int DokumentId { get; set; }
        public DateTime DatumDokumenta { get; set; }
        public string OznakaDokumenta { get; set; }
        public string ZaposlenikId { get; set; }
        public int ArhivaId { get; set; }
        public string TipDokumenta { get; set; }
    }
}
