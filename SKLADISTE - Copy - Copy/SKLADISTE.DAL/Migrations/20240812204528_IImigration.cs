using Microsoft.EntityFrameworkCore.Migrations;

namespace SKLADISTE.DAL.Migrations
{
    public partial class IImigration : Migration
    {
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropColumn(
                name: "Jmj",
                table: "ArtikliDokumenata");

            migrationBuilder.DropColumn(
                name: "Rb",
                table: "ArtikliDokumenata");

            migrationBuilder.DropColumn(
                name: "UkupnaKolicina",
                table: "ArtikliDokumenata");

            migrationBuilder.AddColumn<int>(
                name: "RbArtikla",
                table: "ArtikliDokumenata",
                nullable: false,
                defaultValue: 0);

            migrationBuilder.AddColumn<float>(
                name: "UkupnaCijena",
                table: "ArtikliDokumenata",
                nullable: false,
                defaultValue: 0f);
        }

        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropColumn(
                name: "RbArtikla",
                table: "ArtikliDokumenata");

            migrationBuilder.DropColumn(
                name: "UkupnaCijena",
                table: "ArtikliDokumenata");

            migrationBuilder.AddColumn<string>(
                name: "Jmj",
                table: "ArtikliDokumenata",
                type: "nvarchar(max)",
                nullable: true);

            migrationBuilder.AddColumn<int>(
                name: "Rb",
                table: "ArtikliDokumenata",
                type: "int",
                nullable: false,
                defaultValue: 0);

            migrationBuilder.AddColumn<float>(
                name: "UkupnaKolicina",
                table: "ArtikliDokumenata",
                type: "real",
                nullable: false,
                defaultValue: 0f);
        }
    }
}
