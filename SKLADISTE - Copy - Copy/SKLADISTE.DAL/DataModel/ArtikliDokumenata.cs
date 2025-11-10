using System;
using System.Collections.Generic;
using System.Text;

namespace SKLADISTE.DAL.DataModel
{
    public class ArtikliDokumenata
    {
        public int Id { get; set; }
        public int DokumentId { get; set; }//Prati hrpu(Dokument) od kuda je dosao artikl
        public int RbArtikla { get; set; }
        public float Kolicina { get; set; }
        public float Cijena { get; set; }
        public float UkupnaCijena { get; set; }
        public int ArtiklId { get; set; }
        public int TrenutnaKolicina { get; set; }
        public string ZaposlenikId { get; set; }

        public Dokument Dokument { get; set; }
        public Artikl Artikl { get; set; }
        public ICollection<LokacijeArtikala>? LokacijeArtikala { get; set; }

    }
}
