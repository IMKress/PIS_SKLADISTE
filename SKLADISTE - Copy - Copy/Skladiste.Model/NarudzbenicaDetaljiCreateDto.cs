using System;
using System.Collections.Generic;
using System.Text;

namespace Skladiste.Model
{
    public class NarudzbenicaDetaljiCreateDto
    {
        public int DokumentId { get; set; }
        public int NP_Id { get; set; }
        public string? MjestoIsporuke { get; set; }
        public DateTime RokIsporuke { get; set; }
    }
}
