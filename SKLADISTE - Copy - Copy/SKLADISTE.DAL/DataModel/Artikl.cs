using System;
using System.Collections.Generic;
using System.Text;

namespace SKLADISTE.DAL.DataModel
{
    public class Artikl
    {
        public int ArtiklId { get; set; }
        public string ArtiklNaziv { get; set; }
        public string ArtiklJmj { get; set; }
        public int KategorijaId { get; set; }
        public string ArtiklOznaka { get; set; }
        public int? MalaKolicinaGranica { get; set; }

        public Kategorija Kategorija { get; set; }
        public ICollection<ArhiveStanja> ArhiveStanja { get; set; }
    }
}
