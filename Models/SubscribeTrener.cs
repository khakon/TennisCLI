using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace TennisCLI.Models
{
    public class SubscribeTrener:Subscribe
    {
        public int TrenerId { get; set; }

        public virtual Trener Trener { get; set; }
    }
}
