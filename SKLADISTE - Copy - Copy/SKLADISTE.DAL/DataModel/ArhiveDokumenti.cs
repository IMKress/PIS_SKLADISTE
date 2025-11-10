using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.Text;

namespace SKLADISTE.DAL.DataModel
{
    public class ArhiveDokumenti
    {
        [Key]
        public int ZapisArhivieDokumentaId { get; set; }
        public int ArhivaId { get; set; }
        public int DokumentId { get; set; }

        public Arhive? Arhiva { get; set; }
        public Dokument? Dokument { get; set; }

    }
}
