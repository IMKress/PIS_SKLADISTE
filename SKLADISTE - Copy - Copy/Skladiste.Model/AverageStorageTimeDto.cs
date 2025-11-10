using System;

namespace Skladiste.Model
{
    public class AverageStorageTimeDto
    {
        public int ArtiklId { get; set; }
        public string ArtiklNaziv { get; set; }
        public double ProsjecniDani { get; set; }
        public string ArtiklOznaka { get; set; }
    }
}
