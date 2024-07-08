using Backend.Models;
using System.ComponentModel.DataAnnotations;

namespace Backend.DTO
{
    public class RateFile
    {
        public int RateId { get; set; }
        public int FileId { get; set; }
        public int UserId { get; set; }

    }
}
