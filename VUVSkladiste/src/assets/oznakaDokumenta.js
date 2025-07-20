export function generirajOznakuDokumenta() {
  const randomBroj = Math.floor(1000 + Math.random() * 9000);
  const danas = new Date();
  const dan = danas.getDate();
  const mjesec = danas.getMonth() + 1;
  const godina = danas.getFullYear();
  const oznaka = `${randomBroj}-${dan}-${mjesec}-${godina}`;
  return oznaka;
}
