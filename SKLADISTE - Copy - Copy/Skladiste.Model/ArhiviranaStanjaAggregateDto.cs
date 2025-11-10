namespace Skladiste.Model
{
    public class ArhiviranaStanjaAggregateDto
    {
        public int ArtiklId { get; set; }
        public string ArtiklOznaka { get; set; }
        public string ArtiklNaziv { get; set; }
        public string ArtiklJmj { get; set; }
        public string KategorijaNaziv { get; set; }
        public float Stanje { get; set; }
        public float Cijena { get; set; }
    }
}
