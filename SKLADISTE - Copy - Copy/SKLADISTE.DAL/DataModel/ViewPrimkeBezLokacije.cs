using System;

namespace SKLADISTE.DAL.DataModel
{
    public class ViewPrimkeBezLokacije
    {
        public int DokumentId { get; set; }
        public string OznakaDokumenta { get; set; }
        public DateTime DatumDokumenta { get; set; }
        public string ZaposlenikId { get; set; }
        public int? DobavljacId { get; set; }
        public string Napomena { get; set; }
    }
}
