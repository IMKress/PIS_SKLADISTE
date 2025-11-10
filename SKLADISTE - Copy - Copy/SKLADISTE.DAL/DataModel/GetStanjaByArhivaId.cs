using System;
using System.Collections.Generic;
using System.Text;

namespace SKLADISTE.DAL.DataModel
{
    public class GetStanjaByArhivaId
    {
        public int ArhivaId { get; set; }
        public string ArtiklNaziv { get; set; }
        public string ArtiklOznaka { get; set; }
        public string KategorijaNaziv { get; set; }
        public string ArtiklJmj { get; set; }
        public int ArtiklKolicina { get; set; }
    }
}
