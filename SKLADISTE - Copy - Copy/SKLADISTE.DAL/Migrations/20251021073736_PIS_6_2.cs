using Microsoft.EntityFrameworkCore.Migrations;

namespace SKLADISTE.DAL.Migrations
{
    public partial class PIS_6_2 : Migration
    {
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.CreateTable(
                name: "LokacijeArtikala",
                columns: table => new
                {
                    LOK_ART_ID = table.Column<int>(nullable: false)
                        .Annotation("SqlServer:Identity", "1, 1"),
                    LOK_ID = table.Column<int>(nullable: false),
                    ART_DOK_ID = table.Column<int>(nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_LokacijeArtikala", x => x.LOK_ART_ID);
                    table.ForeignKey(
                        name: "FK_LokacijeArtikala_ArtikliDokumenata_ART_DOK_ID",
                        column: x => x.ART_DOK_ID,
                        principalTable: "ArtikliDokumenata",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Restrict);
                    table.ForeignKey(
                        name: "FK_LokacijeArtikala_SkladisteLokacija_LOK_ID",
                        column: x => x.LOK_ID,
                        principalTable: "SkladisteLokacija",
                        principalColumn: "LOK_ID",
                        onDelete: ReferentialAction.Restrict);
                });

            migrationBuilder.CreateIndex(
                name: "IX_LokacijeArtikala_ART_DOK_ID",
                table: "LokacijeArtikala",
                column: "ART_DOK_ID");

            migrationBuilder.CreateIndex(
                name: "IX_LokacijeArtikala_LOK_ID",
                table: "LokacijeArtikala",
                column: "LOK_ID");
        }

        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropTable(
                name: "LokacijeArtikala");
        }
    }
}
