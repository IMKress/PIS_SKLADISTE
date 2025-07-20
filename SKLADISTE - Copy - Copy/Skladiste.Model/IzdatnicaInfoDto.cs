using System;

namespace Skladiste.Model
{
    public class IzdatnicaInfoDto
    {
        public int DokumentId { get; set; }
        public DateTime DatumDokumenta { get; set; }
        public string TipDokumenta { get; set; }
        public string ZaposlenikId { get; set; }
        public string OznakaDokumenta { get; set; }
        public string MjestoTroska { get; set; }
        public string Napomena {  get; set; }
    }
}
