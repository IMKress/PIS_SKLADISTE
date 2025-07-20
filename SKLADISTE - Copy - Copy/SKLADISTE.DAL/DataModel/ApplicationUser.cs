using Microsoft.AspNetCore.Identity;
using System;
using System.Collections.Generic;
using System.Text;

namespace SKLADISTE.DAL.DataModel
{
    public class ApplicationUser: IdentityUser
    {
       
            //dodatna svojstva koja idu u tablicu sa predefiniranim
            public string FirstName { get; set; }
            public string LastName { get; set; }
        
    }
}
