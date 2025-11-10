using System;
using System.Collections.Generic;
using System.Text;

namespace Skladiste.Model
{
    public class ArhiveDTO
    {
        public int ArhivaId { get; set; }
        public DateTime DatumArhive { get; set; }
        public string ArhivaOznaka { get; set; }
        public string ArhivaNaziv { get; set; }
        public string Napomena { get; set; }
    }
}
