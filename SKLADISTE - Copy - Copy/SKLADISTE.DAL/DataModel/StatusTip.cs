using System.Collections.Generic;

namespace SKLADISTE.DAL.DataModel
{
    public class StatusTip
    {
        public int StatusId { get; set; }
        public string StatusNaziv { get; set; }

        public ICollection<StatusDokumenta> StatusiDokumenata { get; set; }
    }
}
