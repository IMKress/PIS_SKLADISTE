using System;
using System.Collections.Generic;

namespace SKLADISTE.DAL.DataModel
{
    public class Arhiva
    {
        public int ArhivaId { get; set; }
        public DateTime DatumArhive { get; set; }
        public string ArhivaOznaka { get; set; }
        public string ArhivaNaziv { get; set; }
        public string Napomena { get; set; }
        public string ZaposlenikId { get; set; }

        public ICollection<ArhivaDokument> ArhiveDokumenti { get; set; }
        public ICollection<ArhivaStanje> ArhiveStanja { get; set; }
    }
}
