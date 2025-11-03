namespace SKLADISTE.DAL.DataModel
{
    public class SkladisteLokacija
    {
        public int LokacijaId { get; set; }
        public string? Polica { get; set; }
        public int BrRed { get; set; }
        public int BrStup { get; set; }
        public bool NemaMjesta { get; set; }
        public int SkladisteId { get; set; }
        public SkladistePodatci Skladiste { get; set; } = null!;
    }
}
