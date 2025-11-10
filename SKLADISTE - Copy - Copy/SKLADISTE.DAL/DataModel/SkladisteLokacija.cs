using System;
using System.Collections.Generic;
using System.Text;

namespace SKLADISTE.DAL.DataModel
{
    public class SkladisteLokacija
    {
        public int LOK_ID { get; set; }
        public int skladiste_id { get;set; }
        public string POLICA { get; set; }
        public int BR_RED { get; set; }
        public int BR_STUP { get; set; }
        public bool NEMA_MJESTA { get; set; }
        public SkladistePodatci? Skladiste { get; set; }

        public ICollection<LokacijeArtikala>? LokacijeArtikala { get; set; }

    }
}
