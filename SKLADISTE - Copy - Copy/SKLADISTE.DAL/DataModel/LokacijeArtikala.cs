using System;
using System.Collections.Generic;
using System.Text;

namespace SKLADISTE.DAL.DataModel
{   //TODO OGRANICENJE U BAZI DA RED I STUPAC NE MOGU BITI VEĆI OD ONOGA KOJI JE U LOKACIJI SKLADISTA
    public class LokacijeArtikala
    {
        public int LOK_ART_ID { get; set; }
        public int LOK_ID { get; set; }
        public int ART_DOK_ID { get; set; }
        public int red { get; set; }
        public int stupac { get; set; }
        public SkladisteLokacija Lokacija { get; set; }
        public ArtikliDokumenata ArtikliDokument { get; set; }
    }
}
