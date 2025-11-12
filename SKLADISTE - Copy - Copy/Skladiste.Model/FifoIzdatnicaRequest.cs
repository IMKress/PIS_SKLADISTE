namespace Skladiste.Model
{
    public class FifoIzdatnicaRequest
    {
        public int DokumentId { get; set; }
        public string ProcedureName { get; set; } = "FIFO_Izdatnica";
    }
}
