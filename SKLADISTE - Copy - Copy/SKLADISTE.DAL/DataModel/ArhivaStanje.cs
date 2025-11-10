namespace SKLADISTE.DAL.DataModel
{
    public class ArhivaStanje
    {
        public int ArhivaStanjeId { get; set; }
        public int ArhivaId { get; set; }
        public int DokumentId { get; set; }
        public int ArtiklId { get; set; }
        public string ArtiklOznaka { get; set; }
        public string ArtiklNaziv { get; set; }
        public string ArtiklJmj { get; set; }
        public string KategorijaNaziv { get; set; }
        public float ArtiklKolicina { get; set; }
        public float Cijena { get; set; }
        public float UkupnaCijena { get; set; }
        public int TrenutnaKolicina { get; set; }

        public Arhiva Arhiva { get; set; }
        public Dokument Dokument { get; set; }
    }
}
