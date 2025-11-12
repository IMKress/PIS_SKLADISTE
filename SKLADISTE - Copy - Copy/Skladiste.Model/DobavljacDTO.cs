using System;
using System.Collections.Generic;
using System.Text;

namespace Skladiste.Model
{
    public class DobavljacDTO
    {
        public int DobavljacId { get; set; }
        public string DobavljacNaziv { get; set; }
        public string AdresaDobavljaca { get; set; }
        public string BrojTelefona { get; set; }
        public string Email { get; set; }
        public bool Aktivan { get; set; }
    }
}
