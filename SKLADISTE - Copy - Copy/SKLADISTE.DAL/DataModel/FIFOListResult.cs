using System;

namespace SKLADISTE.DAL.DataModel
{
    public class FIFOListResult
    {
        public int DokumentId { get; set; }
        public int TipDokumentaId { get; set; }
        public DateTime DatumDokumenta { get; set; }
        public int ArtiklId { get; set; }
        public float Kolicina { get; set; }
        public int TrenutnaKolicina { get; set; }
        public float Cijena { get; set; }
        public int? Red { get; set; }
        public int? Stupac { get; set; }
        public string? Polica { get; set; }
    }
}
