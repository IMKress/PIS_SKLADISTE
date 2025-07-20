using System;
using System.Collections.Generic;
using System.Text;

namespace SKLADISTE.DAL.DataModel
{
    public class Nacin_Placanja
    {
        public int NP_Id { get; set; }
        public string NP_Naziv { get; set; }


        public ICollection<NarudzbenicaDetalji> Narudzbenice { get; set; } 

    }
}
