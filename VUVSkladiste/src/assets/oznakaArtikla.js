export function generirajOznakuArtikla(kategorijaNaziv) {
  const randomBroj = Math.floor(1000 + Math.random() * 9000);
  const prvoSlovo = kategorijaNaziv ? kategorijaNaziv.charAt(0).toUpperCase() : 'A';
  return `${prvoSlovo}${randomBroj}`;
}
