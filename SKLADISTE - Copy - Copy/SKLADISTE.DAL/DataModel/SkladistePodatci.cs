using System.Collections.Generic;

namespace SKLADISTE.DAL.DataModel
{
    public class SkladistePodatci
    {
        public int SkladisteId { get; set; }
        public string SkladisteNaziv { get; set; }
        public string AdresaSkladista { get; set; }
        public string brojTelefona { get; set; }
        public string Email { get; set; }
        public ICollection<SkladisteLokacija>? Lokacije { get; set; }

    }
}
