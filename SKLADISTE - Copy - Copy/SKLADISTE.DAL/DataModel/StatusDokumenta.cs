using System;
using System.Collections.Generic;

namespace SKLADISTE.DAL.DataModel
{
    public class StatusDokumenta
    {
        public int DokumentId { get; set; }
        public int StatusId { get; set; }
        public DateTime Datum { get; set; }
        public string ZaposlenikId { get; set; }
        public bool aktivan {  get; set; }

        public StatusTip StatusTip { get; set; }
        public Dokument Dokument { get; set; }
    }
}
