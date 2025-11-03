import about0 from "@/assets/about/about_0.jpg";
import about1 from "@/assets/about/about_1.jpg";
import about2 from "@/assets/about/about_2.jpg";
import about3 from "@/assets/about/about_3.jpg";
import about4 from "@/assets/about/about_4.jpg";
import about5 from "@/assets/about/about_5.jpg";

interface SectionProps {
  className: string;
  paragraph: string;
  image: string;
}

const Section = ({ className, paragraph, image }: SectionProps) => {
  return (
    <div
      className={`w-full flex items-center justify-between gap-5 ${className}`}
    >
      {/* Section Image */}
      <div className="flex-1">
        <img src={image} className="max-w-[300px] mx-auto rounded-md" />
      </div>
      {/* Section Paragraph */}
      <div className="flex-1 mx-auto">
        <p className="max-w-[300px] md:max-w-full text-md">{paragraph}</p>
      </div>
    </div>
  );
};

const AboutUsSection = () => {
  const paragraphs = [
    "The process begins with raw sheep’s wool. Women shear the wool, wash it by hand—often in mountain streams—and let it dry naturally under the sun. Once dry, the wool is carded (combed) and spun into yarn using simple wooden spindles. Natural dyes are prepared from plants, roots, minerals, and sometimes insects. Examples: saffron for yellow, indigo for blue, henna for orange-red, and pomegranate rind for earthy tones.",
    "Each carpet is woven on a vertical loom built from wood, set up inside the weaver’s home. The loom defines the rug’s dimensions. The warp threads (vertical) are tightly stretched and serve as the skeleton of the carpet.",
    "The woman weaver ties thousands of individual knots by hand, row after row. Each knot is made around two warp threads, then cut and packed tightly with a comb-like beater. The technique varies by region of Beni Zrantel rugs use a high, soft pile.",
    "Patterns are not drawn beforehand. They come from memory and intuition. Motifs—diamonds, zigzags, abstract lines—carry cultural meaning: protection, fertility, life transitions, and spirituality. Each carpet becomes a visual diary of the weaver’s emotions, environment, and personal story.",
    "Once completed, the rug is cut from the loom, edges are knotted or braided, and it’s washed again to soften the wool and stabilize the fibers. Drying under natural sunlight enhances the colors.",
    "Spending time to make these amazing Moroccan carpets depends on the carpet size, threads used, and design; it takes between 1 and 3 weeks to be ready to send.",
  ];

  return (
    <div className="my-10">
      {/* Section Heading */}
      <h1 className="text-center text-3xl mb-25">About Us</h1>
      {/* Sections */}
      <div className="flex flex-col gap-15">
        <Section
          className="flex-col md:flex-row"
          image={about0}
          paragraph={paragraphs[0]}
        />
        <Section
          className="flex-col md:flex-row-reverse"
          image={about1}
          paragraph={paragraphs[1]}
        />
        <Section
          className="flex-col md:flex-row"
          image={about2}
          paragraph={paragraphs[2]}
        />
        <Section
          className="flex-col md:flex-row-reverse"
          image={about3}
          paragraph={paragraphs[3]}
        />
        <Section
          className="flex-col md:flex-row"
          image={about4}
          paragraph={paragraphs[4]}
        />
        <Section
          className="flex-col md:flex-row-reverse"
          image={about5}
          paragraph={paragraphs[5]}
        />
      </div>
    </div>
  );
};

export default AboutUsSection;
