using System;

namespace Skladiste.Model
{
    public class ArhivaDto
    {
        public int ArhivaId { get; set; }
        public DateTime DatumArhive { get; set; }
        public string ArhivaOznaka { get; set; }
        public string ArhivaNaziv { get; set; }
        public string Napomena { get; set; }
        public string ZaposlenikId { get; set; }
    }
}
