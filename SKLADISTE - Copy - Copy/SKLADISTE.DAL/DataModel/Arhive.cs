using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.Text;

namespace SKLADISTE.DAL.DataModel
{
    public  class Arhive
    {
        [Key]//TODO DODATI ZAPOSLENIKA
        public int ArhivaId { get; set; }
        public DateTime DatumArhive { get; set; }
        public string ArhivaOznaka { get; set; }
        public string ArhivaNaziv { get; set; }
        public string Napomena { get; set; }

        public ICollection<ArhiveStanja> ArhiveStanja { get; set; }
        public ICollection<ArhiveDokumenti>? ArhiveDokumenti { get; set; }

    }
}
