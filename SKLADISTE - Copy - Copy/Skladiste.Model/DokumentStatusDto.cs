using System;
using System.Collections.Generic;
using System.Text;

namespace Skladiste.Model
{
    public class DokumentStatusDto
    {
        public int DokumentId { get; set; }
        public int StatusId { get; set; }
        public bool aktivan {get; set;}
    }

}
