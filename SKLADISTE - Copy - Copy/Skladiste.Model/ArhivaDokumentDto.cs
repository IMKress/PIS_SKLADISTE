using System;

namespace Skladiste.Model
{
    public class ArhivaDokumentDto
    {
        public int DokumentId { get; set; }
        public string OznakaDokumenta { get; set; }
        public string TipDokumenta { get; set; }
        public DateTime DatumDokumenta { get; set; }
        public string ZaposlenikId { get; set; }
        public string Napomena { get; set; }
    }
}
