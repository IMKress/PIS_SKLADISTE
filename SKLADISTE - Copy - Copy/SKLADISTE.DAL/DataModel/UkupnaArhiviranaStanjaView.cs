using System;
using System.Collections.Generic;
using System.Text;

namespace SKLADISTE.DAL.DataModel
{
    public class UkupnaArhiviranaStanjaView
    {
        public int ArtiklId { get; set; }
        public string ArtiklOznaka { get; set; }
        public string ArtiklNaziv { get; set; }
        public string ArtiklJmj { get; set; }
        public string KategorijaNaziv { get; set; }
        public double Stanje { get; set; }
        public double Cijena { get; set; }
    }
}
