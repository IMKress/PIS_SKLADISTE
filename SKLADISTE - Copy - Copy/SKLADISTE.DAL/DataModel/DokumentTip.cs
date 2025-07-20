using System.Collections.Generic;

namespace SKLADISTE.DAL.DataModel
{
    public class DokumentTip
    {
        public int TipDokumentaId { get; set; } // Primarni ključ
        public string TipDokumenta { get; set; } // Primka ili Izdatnica

        public ICollection<Dokument> Dokumenti { get; set; } // Navigacijska svojstva
    }
}
