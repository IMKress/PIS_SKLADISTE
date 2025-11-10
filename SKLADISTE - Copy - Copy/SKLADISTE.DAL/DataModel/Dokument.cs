using Microsoft.EntityFrameworkCore;
using System;
using System.Collections.Generic;

namespace SKLADISTE.DAL.DataModel
{
    public class Dokument
    {
        public int DokumentId { get; set; }
        public int TipDokumentaId { get; set; } // Strani ključ
        public string OznakaDokumenta { get; set; }
        public DateTime DatumDokumenta { get; set; }
        public string ZaposlenikId { get; set; }
        public string Napomena { get; set; }
        public string MjestoTroska { get; set; }
        public int? DobavljacId { get; set; }
        public string Dostavio {  get; set; }
        public bool Arhiviran { get; set; }
        public ICollection<ArtikliDokumenata> ArtikliDokumenata { get; set; }
        public ICollection<ArhiveDokumenti>? ArhiveDokumenti { get; set; }

        public DokumentTip TipDokumenta { get; set; } // Navigacijsko svojstvo
        public ICollection<StatusDokumenta> StatusDokumenta { get; set; } // ✅ Matches the WithMany

       
        public ICollection<PrimNaruVeze> PrimkeVeze { get; set; }  // ako koristiš obratnu navigaciju
        public ICollection<PrimNaruVeze> NarudzbeniceVeze { get; set; }

    }
}
