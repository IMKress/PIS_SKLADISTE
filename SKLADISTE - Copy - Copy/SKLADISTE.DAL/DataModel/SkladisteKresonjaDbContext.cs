using Microsoft.AspNetCore.Identity.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore;

namespace SKLADISTE.DAL.DataModel
{
    public class SkladisteKresonjaDbContext : IdentityDbContext<ApplicationUser>
    {
        public SkladisteKresonjaDbContext(DbContextOptions<SkladisteKresonjaDbContext> options)
            : base(options) { }

        public DbSet<Kategorija> Kategorije { get; set; }
        public DbSet<Dokument> Dokumenti { get; set; }
        public DbSet<Artikl> Artikli { get; set; }
        public DbSet<ArtikliDokumenata> ArtikliDokumenata { get; set; }
        public DbSet<DokumentTip> DokumentTipovi { get; set; }
        public DbSet<StatusDokumenta> StatusiDokumenata { get; set; }
        public DbSet<StatusTip> StatusiTipova { get; set; }
        public DbSet<Dobavljac> Dobavljaci { get; set; }
        public DbSet<SkladistePodatci> SkladistePodatcis { get; set; }
        public DbSet<SkladisteLokacija> SkladisteLokacije { get; set; }
        public DbSet<Arhiva> Arhive { get; set; }
        public DbSet<ArhivaDokument> ArhiveDokumenti { get; set; }
        public DbSet<PrimNaruVeze> PrimNaruVeze { get; set; }
        public DbSet<Nacin_Placanja> NaciniPlacanja { get; set; }
        public DbSet<NarudzbenicaDetalji> NarudzbenicaDetalji { get; set; }

        protected override void OnModelCreating(ModelBuilder modelBuilder)
        {
            base.OnModelCreating(modelBuilder);

            // Kategorije
            modelBuilder.Entity<Kategorija>()
                .HasKey(k => k.KategorijaId);

            // Artikli
            modelBuilder.Entity<Artikl>()
                .HasKey(a => a.ArtiklId);

            modelBuilder.Entity<Artikl>()
                .HasOne(a => a.Kategorija)
                .WithMany()
                .HasForeignKey(a => a.KategorijaId);

            // DokumentTip
            modelBuilder.Entity<DokumentTip>()
                .HasKey(dt => dt.TipDokumentaId);

            modelBuilder.Entity<DokumentTip>()
                .Property(dt => dt.TipDokumenta)
                .IsRequired();

            // Dokument
            modelBuilder.Entity<Dokument>()
                .HasKey(d => d.DokumentId);

            modelBuilder.Entity<Dokument>()
                .Property(d => d.DokumentId)
                .ValueGeneratedOnAdd();

            modelBuilder.Entity<Dokument>()
                .Property(d => d.Napomena)
                .HasMaxLength(500);

            modelBuilder.Entity<Dokument>()
                .Property(d => d.MjestoTroska);



            modelBuilder.Entity<Dokument>()
                .Property(d => d.DobavljacId)
                .IsRequired(false);
                

            modelBuilder.Entity<Dokument>()
                .HasOne(d => d.TipDokumenta)
                .WithMany(dt => dt.Dokumenti)
                .HasForeignKey(d => d.TipDokumentaId)
                .OnDelete(DeleteBehavior.Cascade);

            // Skladiste
            modelBuilder.Entity<SkladistePodatci>()
                .HasKey(s => s.SkladisteId);

            modelBuilder.Entity<SkladistePodatci>()
                .HasMany(s => s.Lokacije)
                .WithOne(l => l.Skladiste)
                .HasForeignKey(l => l.SkladisteId)
                .OnDelete(DeleteBehavior.Cascade);

            modelBuilder.Entity<SkladisteLokacija>()
                .HasKey(l => l.LokacijaId);

            modelBuilder.Entity<SkladisteLokacija>()
                .Property(l => l.LokacijaId)
                .ValueGeneratedOnAdd();

            modelBuilder.Entity<SkladisteLokacija>()
                .ToTable("SkladisteLokacije");

            // ArtikliDokumenata
            modelBuilder.Entity<ArtikliDokumenata>()
                .HasKey(ad => ad.Id);

            modelBuilder.Entity<ArtikliDokumenata>()
                .HasOne(ad => ad.Dokument)
                .WithMany(d => d.ArtikliDokumenata)
                .HasForeignKey(ad => ad.DokumentId);

            modelBuilder.Entity<ArtikliDokumenata>()
                .HasOne(ad => ad.Artikl)
                .WithMany()
                .HasForeignKey(ad => ad.ArtiklId);

            // StatusTip
            modelBuilder.Entity<StatusTip>()
                .HasKey(st => st.StatusId);

            modelBuilder.Entity<StatusTip>()
                .Property(st => st.StatusNaziv)
                .IsRequired()
                .HasMaxLength(100);

            // StatusDokumenta
            modelBuilder.Entity<StatusDokumenta>()
                .HasKey(sd => new { sd.DokumentId, sd.StatusId });

            modelBuilder.Entity<StatusDokumenta>()
                .HasOne(sd => sd.Dokument)
                .WithMany(d => d.StatusDokumenta)
                .HasForeignKey(sd => sd.DokumentId);

            modelBuilder.Entity<StatusDokumenta>()
                .HasOne(sd => sd.StatusTip)
                .WithMany(st => st.StatusiDokumenata)
                .HasForeignKey(sd => sd.StatusId);

            // Arhive
            modelBuilder.Entity<Arhiva>()
                .HasKey(a => a.ArhivaId);

            modelBuilder.Entity<Arhiva>()
                .HasMany(a => a.Dokumenti)
                .WithOne(ad => ad.Arhiva)
                .HasForeignKey(ad => ad.ArhivaId)
                .OnDelete(DeleteBehavior.Cascade);

            modelBuilder.Entity<Arhiva>()
                .ToTable("Arhive");

            modelBuilder.Entity<ArhivaDokument>()
                .HasKey(ad => ad.ArhivaDokumentId);

            modelBuilder.Entity<ArhivaDokument>()
                .HasOne(ad => ad.Dokument)
                .WithMany()
                .HasForeignKey(ad => ad.DokumentId)
                .OnDelete(DeleteBehavior.Restrict);

            modelBuilder.Entity<ArhivaDokument>()
                .ToTable("ArhiveDokumenti");

            // PrimNaruVeze
            modelBuilder.Entity<PrimNaruVeze>()
                .HasKey(p => p.PmvId); // novi primarni ključ

            modelBuilder.Entity<PrimNaruVeze>()
      .HasOne(p => p.Primka)
      .WithMany(d => d.PrimkeVeze)
      .HasForeignKey(p => p.PrimkaId)
      .OnDelete(DeleteBehavior.Restrict);

            modelBuilder.Entity<PrimNaruVeze>()
                .HasOne(p => p.Narudzbenica)
                .WithMany(d => d.NarudzbeniceVeze)
                .HasForeignKey(p => p.NarudzbenicaId)
                 .OnDelete(DeleteBehavior.Cascade);


            // Nacin Placanja
            modelBuilder.Entity<Nacin_Placanja>()
                .HasKey(n => n.NP_Id);

            modelBuilder.Entity<Nacin_Placanja>()
                .Property(n => n.NP_Naziv)
                .IsRequired(false);

            // NarudzbenicaDetalji
            modelBuilder.Entity<NarudzbenicaDetalji>()
                .HasKey(d => d.DokumentId);
           
            modelBuilder.Entity<NarudzbenicaDetalji>()
                .HasOne(n => n.NacinPlacanja)
                .WithMany(p => p.Narudzbenice)
                .HasForeignKey(n => n.NP_Id)
                .OnDelete(DeleteBehavior.Restrict);

            modelBuilder.Entity<NarudzbenicaDetalji>()
                .HasOne<Dokument>()
                .WithOne()
                .HasForeignKey<NarudzbenicaDetalji>(d => d.DokumentId)
                .OnDelete(DeleteBehavior.Cascade);
        }
    }
}
