using System;
using System.Collections.Generic;
using System.Text;

namespace SKLADISTE.DAL.DataModel
{
    public class NarudzbenicaDetalji
    {
        public int DokumentId { get; set; }
        public int NP_Id { get; set; }
        public string MjestoIsporuke { get; set; }
        public DateTime RokIsporuke { get; set; }

        public Nacin_Placanja NacinPlacanja { get; set; }
    }
}
