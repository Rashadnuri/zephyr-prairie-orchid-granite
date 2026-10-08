import type { MetricKey } from "@/data/metrics";

export type Region =
  | "Avropa"
  | "Asiya"
  | "Afrika"
  | "Şimali Amerika"
  | "Cənubi Amerika"
  | "Okeaniya"
  | "Antarktida"
  | "Avrasiya";

export type Country = {
  key: string;
  name: string;
  capital: string;
  region: Region;
  population: number | null;
  gdpPc: number | null;
  life: number | null;
  internet: number | null;
  forest: number | null;
};

function c(
  key: string,
  name: string,
  capital: string,
  region: Region,
  population: number | null,
  gdpPc: number | null,
  life: number | null,
  internet: number | null,
  forest: number | null,
): Country {
  return { key, name, capital, region, population, gdpPc, life, internet, forest };
}

const NONE = "—";

export const COUNTRIES: Country[] = [
  c("Afghanistan", "Əfqanıstan", "Kabil", "Asiya", 42200000, 410, 64.5, 18, 1.9),
  c("Albania", "Albaniya", "Tirana", "Avropa", 2800000, 8300, 76.5, 83, 28.8),
  c("Algeria", "Əlcəzair", "Əlcəzair", "Afrika", 45600000, 5300, 76.3, 71, 0.8),
  c("American Samoa", "Amerika Samoası", "Paqo-Paqo", "Okeaniya", 48000, 15700, 73.4, 60, 86),
  c("Andorra", "Andorra", "Andorra-la-Velya", "Avropa", 85000, 44000, 83.6, 94, 34),
  c("Angola", "Anqola", "Luanda", "Afrika", 36700000, 2300, 61.6, 36, 53.4),
  c("Anguilla", "Angilya", "Valli", "Şimali Amerika", 16000, 23000, 81.6, 78, 61),
  c("Antarctica", "Antarktida", NONE, "Antarktida", null, null, null, null, null),
  c("Antigua and Barb.", "Antiqua və Barbuda", "Sent-Cons", "Şimali Amerika", 94000, 21000, 77.6, 96, 18),
  c("Argentina", "Argentina", "Buenos-Ayres", "Cənubi Amerika", 45700000, 13700, 76, 88, 10.4),
  c("Armenia", "Ermənistan", "İrəvan", "Asiya", 2800000, 8500, 73.4, 79, 11.5),
  c("Aruba", "Aruba", "Oranyestad", "Şimali Amerika", 107000, 33000, 76.6, 97, 2.3),
  c("Ashmore and Cartier Is.", "Aşmor və Kartye adaları", NONE, "Okeaniya", null, null, null, null, null),
  c("Australia", "Avstraliya", "Kanberra", "Okeaniya", 26600000, 65000, 83.2, 96, 17.4),
  c("Austria", "Avstriya", "Vyana", "Avropa", 9100000, 56800, 81.6, 93, 47.2),
  c("Azerbaijan", "Azərbaycan", "Bakı", "Asiya", 10200000, 7800, 73.5, 88, 13.7),
  c("Bahamas", "Baham adaları", "Nassau", "Şimali Amerika", 410000, 35000, 73.9, 94, 51),
  c("Bahrain", "Bəhreyn", "Mənama", "Asiya", 1500000, 29000, 79.2, 100, 0.7),
  c("Bangladesh", "Banqladeş", "Dəkkə", "Asiya", 173000000, 2700, 73.7, 45, 14.5),
  c("Barbados", "Barbados", "Brictaun", "Şimali Amerika", 280000, 22000, 77.6, 85, 14.7),
  c("Belarus", "Belarus", "Minsk", "Avropa", 9200000, 7800, 73.1, 86, 43.2),
  c("Belgium", "Belçika", "Brüssel", "Avropa", 11700000, 53000, 81.9, 94, 22.6),
  c("Belize", "Beliz", "Belmopan", "Şimali Amerika", 420000, 7000, 73, 62, 55),
  c("Benin", "Benin", "Porto-Novo", "Afrika", 13700000, 1400, 60, 34, 27.8),
  c("Bermuda", "Bermud adaları", "Hamilton", "Şimali Amerika", 64000, 118000, 81.7, 98, 20),
  c("Bhutan", "Butan", "Thimphu", "Asiya", 790000, 3700, 72, 86, 71),
  c("Bolivia", "Boliviya", "Sukre", "Cənubi Amerika", 12400000, 3700, 64.5, 66, 46.9),
  c("Bosnia and Herz.", "Bosniya və Herseqovina", "Sarayevo", "Avropa", 3200000, 8100, 75.3, 80, 42.7),
  c("Botswana", "Botsvana", "Qaborone", "Afrika", 2700000, 7300, 65.9, 77, 26.9),
  c("Br. Indian Ocean Ter.", "Britaniya Hind okeanı ərazisi", NONE, "Afrika", 3000, null, null, null, null),
  c("Brazil", "Braziliya", "Brazilia", "Cənubi Amerika", 216000000, 10200, 73.4, 84, 59.4),
  c("British Virgin Is.", "Britaniya Virgin adaları", "Rod-Taun", "Şimali Amerika", 31000, 48000, 79.4, 78, 24),
  c("Brunei", "Bruney", "Bandar-Seri-Beqavan", "Asiya", 450000, 33000, 74.6, 98, 72),
  c("Bulgaria", "Bolqarıstan", "Sofiya", "Avropa", 6400000, 15700, 74.5, 80, 36),
  c("Burkina Faso", "Burkina-Faso", "Uaqaduqu", "Afrika", 23300000, 860, 59.3, 22, 22.7),
  c("Burundi", "Burundi", "Giteqa", "Afrika", 13200000, 250, 62, 11, 10.9),
  c("Cabo Verde", "Kabo-Verde", "Praya", "Afrika", 520000, 4300, 74.1, 70, 11.3),
  c("Cambodia", "Kamboca", "Pnompen", "Asiya", 17400000, 1900, 70, 60, 45.7),
  c("Cameroon", "Kamerun", "Yaunde", "Afrika", 28600000, 1700, 60.3, 46, 42),
  c("Canada", "Kanada", "Ottava", "Şimali Amerika", 40100000, 54000, 81.6, 93, 38.7),
  c("Cayman Is.", "Kayman adaları", "Corctaun", "Şimali Amerika", 73000, 97000, 82.2, 81, 53),
  c("Central African Rep.", "Mərkəzi Afrika Respublikası", "Banqi", "Afrika", 5700000, 500, 54.5, 11, 35.6),
  c("Chad", "Çad", "Ncamena", "Afrika", 18500000, 700, 53, 18, 3.4),
  c("Chile", "Çili", "Santyaqo", "Cənubi Amerika", 19600000, 17000, 79.5, 90, 24.5),
  c("China", "Çin", "Pekin", "Asiya", 1412000000, 13000, 78, 76, 23.4),
  c("Colombia", "Kolumbiya", "Boqota", "Cənubi Amerika", 52100000, 7000, 73.7, 73, 53.3),
  c("Comoros", "Komor adaları", "Moroni", "Afrika", 850000, 1600, 63.7, 27, 17),
  c("Congo", "Konqo", "Brazzavil", "Afrika", 6100000, 2500, 63.5, 36, 64.5),
  c("Cook Is.", "Kuk adaları", "Avarua", "Okeaniya", 15000, 21000, 76.9, 64, 64),
  c("Costa Rica", "Kosta-Rika", "San-Xose", "Şimali Amerika", 5200000, 17000, 77.3, 83, 59),
  c("Croatia", "Xorvatiya", "Zaqreb", "Avropa", 3900000, 21400, 77.6, 82, 34.7),
  c("Cuba", "Kuba", "Havana", "Şimali Amerika", 11000000, 9600, 73.7, 71, 31.3),
  c("Curaçao", "Kürasao", "Villemstad", "Şimali Amerika", 150000, 19000, 78.6, 68, 5),
  c("Cyprus", "Kipr", "Nikosiya", "Avropa", 1260000, 35000, 81.2, 91, 18.7),
  c("Czechia", "Çexiya", "Praqa", "Avropa", 10900000, 31000, 79, 85, 34.7),
  c("Côte d'Ivoire", "Kot-d'İvuar", "Yamussukro", "Afrika", 28900000, 2700, 59, 45, 8.7),
  c("Dem. Rep. Congo", "Konqo DR", "Kinşasa", "Afrika", 105000000, 650, 59.7, 23, 55.6),
  c("Denmark", "Danimarka", "Kopenhagen", "Avropa", 5900000, 68000, 81.4, 98, 15.7),
  c("Djibouti", "Cibuti", "Cibuti", "Afrika", 1150000, 3600, 62.9, 69, 0.3),
  c("Dominica", "Dominika", "Rozo", "Şimali Amerika", 72000, 9600, 73, 83, 63),
  c("Dominican Rep.", "Dominikan Respublikası", "Santo-Dominqo", "Şimali Amerika", 11300000, 10700, 72.6, 85, 44.4),
  c("Ecuador", "Ekvador", "Kito", "Cənubi Amerika", 18200000, 6600, 73.7, 76, 50),
  c("Egypt", "Misir", "Qahirə", "Afrika", 112000000, 3500, 70.2, 72, 0.1),
  c("El Salvador", "Salvador", "San-Salvador", "Şimali Amerika", 6300000, 5500, 71.5, 63, 28),
  c("Eq. Guinea", "Ekvatorial Qvineya", "Malabo", "Afrika", 1700000, 7700, 61.2, 54, 87),
  c("Eritrea", "Eritreya", "Əsmərə", "Afrika", 3700000, 640, 66.5, 22, 14.9),
  c("Estonia", "Estoniya", "Tallin", "Avropa", 1370000, 30000, 78.2, 91, 56),
  c("eSwatini", "Esvatini", "Mbabane", "Afrika", 1200000, 4100, 57.1, 58, 28),
  c("Ethiopia", "Efiopiya", "Əddis-Əbəbə", "Afrika", 129000000, 1300, 66.2, 19, 15.2),
  c("Faeroe Is.", "Farer adaları", "Torshavn", "Avropa", 54000, 69000, 81.4, 98, 0.1),
  c("Falkland Is.", "Folklend adaları", "Stenli", "Cənubi Amerika", 3800, 70000, 79.5, 99, 0),
  c("Fiji", "Fici", "Suva", "Okeaniya", 930000, 5800, 67.3, 70, 56),
  c("Finland", "Finlandiya", "Helsinki", "Avropa", 5600000, 54000, 81.7, 93, 73.7),
  c("Fr. Polynesia", "Fransız Polineziyası", "Papeete", "Okeaniya", 280000, 22000, 78.2, 73, 43),
  c("Fr. S. Antarctic Lands", "Fransız Cənub əraziləri", NONE, "Antarktida", null, null, null, null, null),
  c("France", "Fransa", "Paris", "Avropa", 68200000, 46000, 82.3, 86, 31.5),
  c("Gabon", "Qabon", "Librevil", "Afrika", 2400000, 8800, 66.5, 72, 91),
  c("Gambia", "Qambiya", "Bancul", "Afrika", 2800000, 840, 62.9, 53, 24),
  c("Georgia", "Gürcüstan", "Tbilisi", "Asiya", 3700000, 8100, 71.7, 81, 40.6),
  c("Germany", "Almaniya", "Berlin", "Avropa", 84500000, 54000, 80.7, 92, 32.7),
  c("Ghana", "Qana", "Akkra", "Afrika", 34100000, 2300, 64.1, 70, 35.1),
  c("Greece", "Yunanıstan", "Afina", "Avropa", 10400000, 23000, 80.5, 83, 30.3),
  c("Greenland", "Qrenlandiya", "Nuuk", "Şimali Amerika", 57000, 54000, 73.1, 70, 0.1),
  c("Grenada", "Qrenada", "Sent-Corces", "Şimali Amerika", 126000, 11000, 74.9, 79, 50),
  c("Guam", "Quam", "Haqatnya", "Okeaniya", 170000, 41000, 79.9, 81, 46),
  c("Guatemala", "Qvatemala", "Qvatemala", "Şimali Amerika", 18100000, 5600, 69.2, 50, 33),
  c("Guernsey", "Gernsi", "Sent-Piter-Port", "Avropa", 64000, 55000, 82.6, 95, 4),
  c("Guinea", "Qvineya", "Konakri", "Afrika", 14200000, 1600, 59.3, 27, 25),
  c("Guinea-Bissau", "Qvineya-Bisau", "Bisau", "Afrika", 2100000, 900, 59.7, 35, 70),
  c("Guyana", "Qayana", "Corctaun", "Cənubi Amerika", 810000, 21000, 66, 37, 93.5),
  c("Haiti", "Haiti", "Port-o-Prins", "Şimali Amerika", 11700000, 1700, 63.2, 39, 12.6),
  c("Heard I. and McDonald Is.", "Herd və Makdonald adaları", NONE, "Antarktida", null, null, null, null, null),
  c("Honduras", "Honduras", "Tequsiqalpa", "Şimali Amerika", 10600000, 3200, 70.1, 48, 47),
  c("Hong Kong", "Honkonq", "Honkonq", "Asiya", 7500000, 51000, 85.1, 96, 23),
  c("Hungary", "Macarıstan", "Budapeşt", "Avropa", 9600000, 22000, 76, 89, 22.5),
  c("Iceland", "İslandiya", "Reykyavik", "Avropa", 390000, 79000, 82.6, 100, 0.5),
  c("India", "Hindistan", "Yeni Dehli", "Asiya", 1430000000, 2700, 67.7, 52, 24.3),
  c("Indian Ocean Ter.", "Hind okeanı adaları", "Flayinq-Fiş-Kov", "Asiya", 2200, null, null, null, null),
  c("Indonesia", "İndoneziya", "Cakarta", "Asiya", 279000000, 4900, 68.3, 69, 49.1),
  c("Iran", "İran", "Tehran", "Asiya", 89000000, 4600, 74, 79, 6.6),
  c("Iraq", "İraq", "Bağdad", "Asiya", 45500000, 5500, 70.4, 60, 1.9),
  c("Ireland", "İrlandiya", "Dublin", "Avropa", 5300000, 103000, 82.1, 95, 11.4),
  c("Isle of Man", "Men adası", "Duqlas", "Avropa", 84000, 89000, 81.4, 95, 6),
  c("Israel", "İsrail", "Yerusəlim", "Asiya", 9800000, 54000, 82.6, 90, 6.5),
  c("Italy", "İtaliya", "Roma", "Avropa", 58900000, 39000, 82.9, 86, 32.5),
  c("Jamaica", "Yamayka", "Kinqston", "Şimali Amerika", 2800000, 6800, 70.7, 82, 55),
  c("Japan", "Yaponiya", "Tokio", "Asiya", 124000000, 34000, 84, 83, 68.4),
  c("Jersey", "Cersi", "Sent-Helyer", "Avropa", 103000, 62000, 81.8, 95, 6),
  c("Jordan", "İordaniya", "Amman", "Asiya", 11400000, 4500, 74.3, 88, 1.1),
  c("Kazakhstan", "Qazaxıstan", "Astana", "Asiya", 20000000, 13000, 70.4, 92, 1.3),
  c("Kenya", "Keniya", "Nayrobi", "Afrika", 55100000, 2100, 62.1, 41, 6.3),
  c("Kiribati", "Kiribati", "Tarava", "Okeaniya", 133000, 1800, 67.4, 54, 1.5),
  c("Kosovo", "Kosovo", "Priştina", "Avropa", 1800000, 5900, 76.7, 90, 45),
  c("Kuwait", "Küveyt", "Küveyt", "Asiya", 4300000, 37000, 80.3, 100, 0.4),
  c("Kyrgyzstan", "Qırğızıstan", "Bişkek", "Asiya", 7100000, 1900, 71.9, 78, 6.9),
  c("Laos", "Laos", "Vyentyan", "Asiya", 7700000, 2100, 68.1, 62, 71.9),
  c("Latvia", "Latviya", "Riqa", "Avropa", 1880000, 23000, 75, 91, 55),
  c("Lebanon", "Livan", "Beyrut", "Asiya", 5500000, 4100, 74.4, 87, 13.6),
  c("Lesotho", "Lesoto", "Maseru", "Afrika", 2300000, 1100, 53.1, 48, 1.6),
  c("Liberia", "Liberiya", "Monroviya", "Afrika", 5500000, 750, 61.1, 33, 79),
  c("Libya", "Liviya", "Tripoli", "Afrika", 7000000, 6700, 72, 65, 0.1),
  c("Liechtenstein", "Lixtenşteyn", "Vaduts", "Avropa", 40000, 180000, 83.4, 98, 43),
  c("Lithuania", "Litva", "Vilnüs", "Avropa", 2860000, 28000, 75.8, 87, 35.1),
  c("Luxembourg", "Lüksemburq", "Lüksemburq", "Avropa", 660000, 128000, 82.2, 99, 34),
  c("Macao", "Makao", "Makao", "Asiya", 700000, 45000, 85.4, 89, 0),
  c("Macedonia", "Şimali Makedoniya", "Skopye", "Avropa", 1800000, 7600, 75, 84, 39.7),
  c("Madagascar", "Madaqaskar", "Antananarivu", "Afrika", 30300000, 530, 64.5, 20, 21.4),
  c("Malawi", "Malavi", "Lilongve", "Afrika", 21100000, 640, 63, 24, 23.8),
  c("Malaysia", "Malayziya", "Kuala-Lumpur", "Asiya", 34100000, 12000, 75, 97, 58),
  c("Maldives", "Maldiv adaları", "Male", "Asiya", 520000, 12000, 80.4, 85, 2.7),
  c("Mali", "Mali", "Bamako", "Afrika", 23300000, 890, 59, 33, 10.9),
  c("Malta", "Malta", "Valletta", "Avropa", 540000, 38000, 82.7, 90, 1.4),
  c("Marshall Is.", "Marşal adaları", "Macuro", "Okeaniya", 42000, 6700, 65.3, 40, 52),
  c("Mauritania", "Mavritaniya", "Nuakşot", "Afrika", 4900000, 2100, 64.5, 59, 0.3),
  c("Mauritius", "Mavriki", "Port-Lui", "Afrika", 1300000, 11000, 74.5, 70, 19),
  c("Mexico", "Meksika", "Mexiko", "Şimali Amerika", 129000000, 14000, 75, 76, 33.6),
  c("Micronesia", "Mikroneziya", "Palikir", "Okeaniya", 115000, 4100, 70.9, 40, 92),
  c("Moldova", "Moldova", "Kişinyov", "Avropa", 2500000, 6700, 68.8, 80, 11.7),
  c("Monaco", "Monako", "Monako", "Avropa", 39000, 240000, 86.5, 98, 0),
  c("Mongolia", "Monqolustan", "Ulan-Bator", "Asiya", 3500000, 5700, 71, 81, 9.1),
  c("Montenegro", "Monteneqro", "Podqoritsa", "Avropa", 620000, 12000, 76.3, 82, 61),
  c("Montserrat", "Monserat", "Plimut", "Şimali Amerika", 4400, 14000, 74.8, 60, 25),
  c("Morocco", "Mərakeş", "Rabat", "Afrika", 37800000, 3900, 74, 88, 12.9),
  c("Mozambique", "Mozambik", "Maputu", "Afrika", 33900000, 600, 59.3, 21, 46.7),
  c("Myanmar", "Myanma", "Nepido", "Asiya", 54500000, 1200, 66.8, 44, 43.7),
  c("N. Cyprus", "Şimali Kipr", "Lefkoşa", "Avropa", 380000, 15000, 78.5, 80, 18),
  c("N. Mariana Is.", "Şimali Marian adaları", "Saypan", "Okeaniya", 47000, 23000, 76.4, 70, 50),
  c("Namibia", "Namibiya", "Vindxuk", "Afrika", 2600000, 4800, 59.3, 53, 8.3),
  c("Nauru", "Nauru", "Yaren", "Okeaniya", 12000, 12000, 64.3, 84, 0),
  c("Nepal", "Nepal", "Katmandu", "Asiya", 30900000, 1400, 70.5, 50, 41.6),
  c("Netherlands", "Niderland", "Amsterdam", "Avropa", 17900000, 63000, 81.7, 95, 11.2),
  c("New Caledonia", "Yeni Kaledoniya", "Numea", "Okeaniya", 290000, 35000, 77.5, 82, 45),
  c("New Zealand", "Yeni Zelandiya", "Vellinqton", "Okeaniya", 5200000, 48000, 82.2, 95, 37.6),
  c("Nicaragua", "Nikaraqua", "Manaqua", "Şimali Amerika", 7000000, 2600, 73.8, 55, 28),
  c("Niger", "Niger", "Niamey", "Afrika", 27200000, 620, 61.6, 22, 0.9),
  c("Nigeria", "Nigeriya", "Abuca", "Afrika", 223000000, 1600, 53.6, 55, 23.4),
  c("Niue", "Niue", "Alofi", "Okeaniya", 1900, 18000, 73.5, 80, 72),
  c("Norfolk Island", "Norfolk adası", "Kinqston", "Okeaniya", 2200, 35000, 80, 70, 20),
  c("North Korea", "Koreya XDR", "Pxenyan", "Asiya", 26200000, 1300, 73.3, 0, 48),
  c("Norway", "Norveç", "Oslo", "Avropa", 5500000, 88000, 83.1, 99, 33.2),
  c("Oman", "Oman", "Məsqət", "Asiya", 4600000, 21000, 73.9, 96, 0),
  c("Pakistan", "Pakistan", "İslamabad", "Asiya", 240000000, 1600, 66.4, 36, 4.8),
  c("Palau", "Palau", "Ngerulmud", "Okeaniya", 18000, 14000, 69.3, 60, 87),
  c("Palestine", "Fələstin", "Ramallah", "Asiya", 5500000, 3600, 73.5, 75, 1.5),
  c("Panama", "Panama", "Panama", "Şimali Amerika", 4500000, 18000, 76.7, 68, 56.8),
  c("Papua New Guinea", "Papua-Yeni Qvineya", "Port-Morsbi", "Okeaniya", 10300000, 2800, 65.4, 32, 79.2),
  c("Paraguay", "Paraqvay", "Asunson", "Cənubi Amerika", 6900000, 6200, 70.3, 77, 38),
  c("Peru", "Peru", "Lima", "Cənubi Amerika", 34000000, 7800, 73.4, 75, 56.5),
  c("Philippines", "Filippin", "Manila", "Asiya", 117000000, 3900, 69.8, 73, 24.1),
  c("Pitcairn Is.", "Pitkern adaları", "Adamstaun", "Okeaniya", 50, null, null, null, null),
  c("Poland", "Polşa", "Varşava", "Avropa", 36600000, 22000, 77.3, 87, 31),
  c("Portugal", "Portuqaliya", "Lissabon", "Avropa", 10400000, 27000, 81.6, 85, 36.2),
  c("Puerto Rico", "Puerto-Riko", "San-Xuan", "Şimali Amerika", 3200000, 35000, 80.1, 78, 56),
  c("Qatar", "Qətər", "Doha", "Asiya", 2700000, 82000, 79.3, 100, 0),
  c("Romania", "Rumıniya", "Buxarest", "Avropa", 19000000, 18000, 75.3, 86, 30.1),
  c("Russia", "Rusiya", "Moskva", "Avrasiya", 144000000, 14000, 73.3, 90, 49.8),
  c("Rwanda", "Ruanda", "Kiqali", "Afrika", 14100000, 1000, 66.1, 30, 11.2),
  c("S. Geo. and the Is.", "Cənubi Georgiya", NONE, "Antarktida", null, null, null, null, null),
  c("S. Sudan", "Cənubi Sudan", "Cuba", "Afrika", 11100000, 400, 55, 8, 11),
  c("Saint Helena", "Müqəddəs Yelena", "Ceymstaun", "Afrika", 4500, 9000, 78, 55, 6),
  c("Saint Lucia", "Sent-Lusiya", "Kastris", "Şimali Amerika", 180000, 13000, 73.6, 78, 34),
  c("Samoa", "Samoa", "Apia", "Okeaniya", 220000, 4300, 72.8, 78, 58),
  c("San Marino", "San-Marino", "San-Marino", "Avropa", 34000, 55000, 83.6, 80, 16),
  c("Saudi Arabia", "Səudiyyə Ərəbistanı", "Ər-Riyad", "Asiya", 36900000, 32000, 76.9, 100, 0.5),
  c("Senegal", "Seneqal", "Dakar", "Afrika", 18000000, 1700, 67.9, 58, 41.6),
  c("Serbia", "Serbiya", "Belqrad", "Avropa", 6600000, 11300, 75, 85, 31),
  c("Seychelles", "Seyşel adaları", "Viktoriya", "Afrika", 120000, 20000, 73.4, 82, 73),
  c("Siachen Glacier", "Siaçen buzlağı", NONE, "Asiya", null, null, null, null, null),
  c("Sierra Leone", "Syerra-Leone", "Fritaun", "Afrika", 8800000, 530, 60.1, 30, 35),
  c("Singapore", "Sinqapur", "Sinqapur", "Asiya", 6000000, 88000, 83.7, 96, 21),
  c("Sint Maarten", "Sint-Marten", "Filipsburq", "Şimali Amerika", 43000, 37000, 78.5, 80, 10),
  c("Slovakia", "Slovakiya", "Bratislava", "Avropa", 5400000, 24000, 77.4, 90, 40),
  c("Slovenia", "Sloveniya", "Lyublyana", "Avropa", 2100000, 32000, 81.3, 90, 61),
  c("Solomon Is.", "Solomon adaları", "Honiara", "Okeaniya", 740000, 2300, 70.3, 36, 78),
  c("Somalia", "Somali", "Moqadişu", "Afrika", 18100000, 600, 56.5, 28, 9.8),
  c("Somaliland", "Somalilend", "Hargeysa", "Afrika", 5700000, 700, 55, 20, 2),
  c("South Africa", "Cənubi Afrika", "Pretoriya", "Afrika", 60400000, 6200, 62.3, 75, 14),
  c("South Korea", "Koreya Respublikası", "Seul", "Asiya", 51700000, 35000, 83.5, 97, 64),
  c("Spain", "İspaniya", "Madrid", "Avropa", 48000000, 33000, 83.2, 94, 37.2),
  c("Sri Lanka", "Şri-Lanka", "Şri-Cayavardenepura-Kotte", "Asiya", 22000000, 3800, 76.6, 50, 34),
  c("St-Barthélemy", "Sen-Bartelemi", "Qustaviya", "Şimali Amerika", 11000, 42000, 80, 75, 20),
  c("St-Martin", "Sen-Marten", "Marigo", "Şimali Amerika", 32000, 22000, 80, 70, 18),
  c("St. Kitts and Nevis", "Sent-Kits və Nevis", "Baster", "Şimali Amerika", 47000, 21000, 74.6, 76, 42),
  c("St. Pierre and Miquelon", "Sen-Pyer və Mikelon", "Sen-Pyer", "Şimali Amerika", 5800, 42000, 80.5, 80, 5),
  c("St. Vin. and Gren.", "Sent-Vinsent və Qrenadin", "Kinqstaun", "Şimali Amerika", 103000, 10500, 71.9, 78, 68),
  c("Sudan", "Sudan", "Xartum", "Afrika", 48100000, 870, 65.3, 29, 9.8),
  c("Suriname", "Surinam", "Paramaribo", "Cənubi Amerika", 620000, 5900, 70.3, 66, 97.4),
  c("Sweden", "İsveç", "Stokholm", "Avropa", 10500000, 56000, 83, 95, 68.7),
  c("Switzerland", "İsveçrə", "Bern", "Avropa", 8900000, 99000, 83.8, 97, 32),
  c("Syria", "Suriya", "Dəməşq", "Asiya", 23200000, 1100, 72.1, 47, 2.7),
  c("São Tomé and Principe", "San-Tome və Prinsipi", "San-Tome", "Afrika", 230000, 2600, 68.8, 51, 54),
  c("Taiwan", "Tayvan", "Taybey", "Asiya", 23400000, 33000, 80.6, 90, 60),
  c("Tajikistan", "Tacikistan", "Düşənbə", "Asiya", 10200000, 1200, 71.6, 36, 3),
  c("Tanzania", "Tanzaniya", "Dodoma", "Afrika", 67400000, 1200, 66.2, 32, 51),
  c("Thailand", "Tailand", "Banqkok", "Asiya", 71700000, 7200, 79.7, 85, 38.9),
  c("Timor-Leste", "Şərqi Timor", "Dili", "Asiya", 1400000, 1500, 67.7, 41, 61),
  c("Togo", "Toqo", "Lome", "Afrika", 9100000, 1000, 61.6, 37, 22),
  c("Tonga", "Tonqa", "Nukualofa", "Okeaniya", 107000, 5100, 71, 70, 12),
  c("Trinidad and Tobago", "Trinidad və Tobaqo", "Port-of-Speyn", "Şimali Amerika", 1500000, 18000, 73, 80, 44),
  c("Tunisia", "Tunis", "Tunis", "Afrika", 12500000, 4200, 74.3, 72, 6.8),
  c("Turkey", "Türkiyə", "Ankara", "Asiya", 85400000, 13000, 77.2, 86, 28.9),
  c("Turkmenistan", "Türkmənistan", "Aşqabad", "Asiya", 6500000, 8000, 69.3, 25, 8.8),
  c("Turks and Caicos Is.", "Terks və Kaykos", "Kokbern-Taun", "Şimali Amerika", 46000, 28000, 80.3, 80, 36),
  c("U.S. Virgin Is.", "ABŞ Virgin adaları", "Şarlotta-Amaliya", "Şimali Amerika", 87000, 40000, 79.7, 64, 50),
  c("Uganda", "Uqanda", "Kampala", "Afrika", 48600000, 1100, 63.6, 28, 11),
  c("Ukraine", "Ukrayna", "Kiyev", "Avropa", 37000000, 5200, 71.6, 79, 16.7),
  c("United Arab Emirates", "Birləşmiş Ərəb Əmirlikləri", "Əbu-Dabi", "Asiya", 9500000, 52000, 79.2, 100, 4.5),
  c("United Kingdom", "Birləşmiş Krallıq", "London", "Avropa", 68300000, 49000, 80.7, 95, 13.2),
  c("United States of America", "Amerika Birləşmiş Ştatları", "Vaşinqton", "Şimali Amerika", 340000000, 82000, 77.5, 92, 33.9),
  c("Uruguay", "Uruqvay", "Montevideo", "Cənubi Amerika", 3400000, 22000, 78, 90, 11.6),
  c("Uzbekistan", "Özbəkistan", "Daşkənd", "Asiya", 36000000, 2500, 71.7, 77, 8.4),
  c("Vanuatu", "Vanuatu", "Port-Vila", "Okeaniya", 330000, 3400, 70.4, 66, 36),
  c("Vatican", "Vatikan", "Vatikan", "Avropa", 800, null, null, null, null),
  c("Venezuela", "Venesuela", "Karakas", "Cənubi Amerika", 28400000, 3700, 71.1, 72, 52),
  c("Vietnam", "Vyetnam", "Hanoy", "Asiya", 100000000, 4300, 74.6, 79, 46),
  c("W. Sahara", "Qərbi Saxara", "Əl-Əyun", "Afrika", 600000, null, 70, 30, 0.3),
  c("Wallis and Futuna Is.", "Uollis və Futuna", "Mata-Utu", "Okeaniya", 11000, 12000, 76, 40, 40),
  c("Yemen", "Yəmən", "Səna", "Asiya", 34400000, 700, 64, 27, 1),
  c("Zambia", "Zambiya", "Lusaka", "Afrika", 20600000, 1400, 61.8, 31, 60),
  c("Zimbabwe", "Zimbabve", "Harare", "Afrika", 16600000, 2100, 59.3, 34, 35),
  c("Åland", "Aland adaları", "Marienhamn", "Avropa", 30000, 45000, 82, 94, 58),
];

export const COUNTRY_BY_KEY = new Map(COUNTRIES.map((country) => [country.key, country]));

export const ALIASES: Record<string, string[]> = {
  "United States of America": ["ABŞ", "Amerika"],
  "United Kingdom": ["Böyük Britaniya", "İngiltərə", "Britaniya"],
  "United Arab Emirates": ["BƏƏ", "Əmirliklər"],
  "South Korea": ["Cənubi Koreya", "Koreya"],
  "North Korea": ["Şimali Koreya"],
  Czechia: ["Çex Respublikası"],
  Macedonia: ["Makedoniya"],
  eSwatini: ["Svazilend"],
  Myanmar: ["Birma"],
  "Timor-Leste": ["Timor"],
  "Dem. Rep. Congo": ["KDR", "Konqo Demokratik Respublikası"],
  "Côte d'Ivoire": ["Fil Dişi Sahili"],
  "Bosnia and Herz.": ["Bosniya"],
  Russia: ["Rusiya Federasiyası"],
  Turkey: ["Türkiye"],
  Azerbaijan: ["Azerbaycan"],
};

export function countryValue(country: Country, metric: MetricKey): number | null {
  return country[metric];
}

export function fold(value: string): string {
  return value
    .toLocaleLowerCase("az")
    .replaceAll("ə", "e")
    .replaceAll("ö", "o")
    .replaceAll("ü", "u")
    .replaceAll("ı", "i")
    .replaceAll("ş", "s")
    .replaceAll("ç", "c")
    .replaceAll("ğ", "g")
    .normalize("NFD")
    .replace(/\p{M}/gu, "");
}

export function searchCountries(query: string): Country[] {
  const needle = fold(query.trim());
  if (!needle) return [];
  const ranked = COUNTRIES.map((country) => {
    const name = fold(country.name);
    const capital = fold(country.capital);
    const aliases = (ALIASES[country.key] ?? []).map(fold);
    let score = 0;
    if (name.startsWith(needle)) score = 4;
    else if (aliases.some((alias) => alias.startsWith(needle))) score = 3;
    else if (name.includes(needle)) score = 2;
    else if (capital.startsWith(needle) || capital.includes(needle)) score = 1;
    else if (aliases.some((alias) => alias.includes(needle))) score = 1;
    return { country, score };
  }).filter((item) => item.score > 0);
  ranked.sort(
    (a, b) => b.score - a.score || a.country.name.localeCompare(b.country.name, "az"),
  );
  return ranked.slice(0, 8).map((item) => item.country);
}
