using Microsoft.EntityFrameworkCore.Migrations;

namespace SKLADISTE.DAL.Migrations
{
    public partial class PisSkladiste_2_2 : Migration
    {
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "FK_Dokumenti_Dobavljaci_DobavljacId1",
                table: "Dokumenti");

            migrationBuilder.DropIndex(
                name: "IX_Dokumenti_DobavljacId1",
                table: "Dokumenti");

            migrationBuilder.DropColumn(
                name: "DobavljacId1",
                table: "Dokumenti");
        }

        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AddColumn<int>(
                name: "DobavljacId1",
                table: "Dokumenti",
                type: "int",
                nullable: true);

            migrationBuilder.CreateIndex(
                name: "IX_Dokumenti_DobavljacId1",
                table: "Dokumenti",
                column: "DobavljacId1");

            migrationBuilder.AddForeignKey(
                name: "FK_Dokumenti_Dobavljaci_DobavljacId1",
                table: "Dokumenti",
                column: "DobavljacId1",
                principalTable: "Dobavljaci",
                principalColumn: "DobavljacId",
                onDelete: ReferentialAction.Restrict);
        }
    }
}
