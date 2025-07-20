using System;
using System.Collections.Generic;
using System.Text;

namespace Skladiste.Model
{
        public class StatusDokumentaCreateRequest
        {
            public int DokumentId { get; set; }
            public int StatusId { get; set; }
            public DateTime Datum { get; set; }
        }
    

}
