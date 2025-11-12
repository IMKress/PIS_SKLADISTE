using System;

namespace SKLADISTE.DAL.DataModel
{
    public class LokacijeArtiklaIzdatniceResult
    {
        public string Artikl { get; set; }
        public string Polica { get; set; }
        public int? Red { get; set; }
        public int? Stupac { get; set; }
        public int DokumentId { get; set; }
        public string OznakaDokumenta { get; set; }
        public string DatumDokumenta { get; set; }
        public decimal KolicinaOduzeta { get; set; }
    }
}
