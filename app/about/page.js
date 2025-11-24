import Style from '../styles/About.module.css';
import Footer from '../components/Footer';
export default function AboutPage() {
  return (
    <div className={Style.aboutPage}>
        <h1>Tentang Kami</h1>
        <div className={Style.about}>
            <h3>“Abadikan Momen dan Ciptakan Kenangan Bersama TechnoLens”</h3>
            <p>Di era digital yang didorong oleh pesatnya perkembangan teknologi dan tren media sosial, kebutuhan akan kamera, CCTV, dan perlengkapan multimedia meningkat tajam di berbagai sektor seperti pendidikan, bisnis, dan kreatif. Meskipun pasar ini potensial, tantangan seperti kurangnya edukasi produk, persaingan harga, dan isu kepercayaan terhadap kualitas serta keaslian barang masih menjadi kendala. Menanggapi kondisi ini, PT. TechnoLens hadir dengan strategi berfokus pada edukasi pelanggan, harga yang kompetitif dan transparan, serta jaminan keaslian produk bergaransi resmi untuk membangun kepercayaan dan hubungan jangka panjang. Perusahaan ini menyediakan beragam produk unggulan bagi berbagai segmen pasar, mulai dari konten kreator hingga perusahaan, sekaligus berkomitmen mengembangkan komunitas visual melalui pelatihan dan event kreatif untuk memperkaya budaya visual dan memperluas jaringan usaha.</p>
        </div>
        <div className={Style.aboutVisiMisiion}>
            <div className={Style.visi}>
                <h2>Visi Kami</h2>
                <p>Menjadi toko elektronik kamera yang terpercaya dalam kualitas produk  serta unggul dalam bidang teknologi.</p>
            </div>
            <div className={Style.misi}>
                <h2>Misi Kami</h2>
                <ul>
                    <li>Memiliki produk elektronik kamera yang berkualitas dan terpercaya serta terjangkau sesuai kebutuhan pasar.</li>
                    <li>Menjadikan pengembangan komunitas fotografi dan videografi yang unggul melalui pelatihan, serta kegiatan kreatif lainnya.</li>
                </ul>
            </div>
        </div>
        <Footer />
    </div>
  );
}