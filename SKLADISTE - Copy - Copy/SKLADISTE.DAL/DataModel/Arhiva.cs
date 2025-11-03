using System;
using System.Collections.Generic;

namespace SKLADISTE.DAL.DataModel
{
    public class Arhiva
    {
        public int ArhivaId { get; set; }
        public string ArhivaOznaka { get; set; } = null!;
        public string ArhivaNaziv { get; set; } = null!;
        public DateTime DatumArhive { get; set; }
        public string? Napomena { get; set; }
        public ICollection<ArhivaDokument> Dokumenti { get; set; } = new List<ArhivaDokument>();
    }
}
