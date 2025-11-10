using System;
using System.Collections.Generic;
using System.Text;

namespace SKLADISTE.DAL.DataModel
{
    public class ArhiveStanja
    {
        public int ZapisArhiveStanjaId { get; set; }
        public int ArhivaId { get; set; }
        public int ArtiklId { get; set; }
        public int ArtiklKolicina { get; set; }

        public Arhive Arhiva { get; set; }
        public Artikl Artikl { get; set; }




    }
}
