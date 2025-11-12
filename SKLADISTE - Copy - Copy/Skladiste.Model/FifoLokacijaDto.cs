namespace Skladiste.Model
{
    public class FifoLokacijaDto
    {
        public int ArtiklId { get; set; }
        public string ArtiklNaziv { get; set; } = string.Empty;
        public decimal IzdanaKolicina { get; set; }
        public string LokacijaOznaka { get; set; } = string.Empty;
        public string Polica { get; set; } = string.Empty;
        public int? Red { get; set; }
        public int? Stupac { get; set; }
        public int? DokumentId { get; set; }
        public int? RbArtikla { get; set; }
    }
}
