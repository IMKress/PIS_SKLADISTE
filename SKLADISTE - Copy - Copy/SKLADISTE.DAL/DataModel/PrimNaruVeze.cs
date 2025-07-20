using System;
using System.Collections.Generic;
using System.Text;

namespace SKLADISTE.DAL.DataModel
{
    public class PrimNaruVeze
    {
        public int PmvId { get; set; }
        public int PrimkaId { get; set; }
        public int NarudzbenicaId { get; set; }

        public Dokument Primka { get; set; }
        public Dokument Narudzbenica { get; set; }
    }
}
