using System.ComponentModel.DataAnnotations;

namespace Backend.Models
{
    public class FileEntity
    {
        [Key]
        public int Id { get; set; }
        public string FileName { get; set; }
        public string Description { get; set; }
        public string Theme { get; set; }
        public string Version { get; set; }
    }
}
