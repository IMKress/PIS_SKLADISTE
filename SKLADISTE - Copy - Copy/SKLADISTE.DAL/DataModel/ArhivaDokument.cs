namespace SKLADISTE.DAL.DataModel
{
    public class ArhivaDokument
    {
        public int ArhivaDokumentId { get; set; }
        public int ArhivaId { get; set; }
        public int DokumentId { get; set; }
        public Arhiva Arhiva { get; set; } = null!;
        public Dokument Dokument { get; set; } = null!;
    }
}
