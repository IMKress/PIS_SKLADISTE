using System;
using System.Collections.Generic;
using System.Text;

namespace SKLADISTE.DAL.DataModel
{
    public class Dobavljac
    {
        public int DobavljacId { get; set; }
        public string DobavljacNaziv {  get; set; }
        public string AdresaDobavljaca {  get; set; }
        public string brojTelefona { get; set; }
        public string Email { get; set; }
        public bool Aktivan { get; set; } = true;
        public ICollection<Dokument> Dokumenti { get; set; }

    }
}
